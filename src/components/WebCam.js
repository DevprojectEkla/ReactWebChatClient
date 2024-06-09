import React, { useState, useEffect, useCallback, useRef } from "react";
import { logger } from "../utils/logger";
import { apiBaseUrl } from "../config";
import { RemoteVideoContainer,RemoteVideo,LocalVideo } from "../styles/WebCamStyles";

const WebCam = ({ users, currentUserData, socket }) => {
  const localStream = useRef(null);
  const [peerConnections, setPeerConnections] = useState(new Map());
  const [newOffer, setNewOffer] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const localVideoRef = useRef(null);
  const [remoteVideoRefs, setRemoteVideoRefs] = useState([]);
  const [userStreamList, setUserStreamList] = useState(new Map());
  const [turnConfig, setTurnConfig] = useState(null);
  const [peerList, setPeerList] = useState([]);
  const socketIdRef = useRef(null);

  const peerConnection = useRef(null);
  const getMediaDevices = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
        logger.debug(JSON.stringify(localStream.current));
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);
  const addTracksToPc = useCallback(async (pc) => {
    if (localStream.current) {
      logger.debug("localStream detected: adding tracks to PCs");
      const tracks = await localStream.current.getTracks();
      logger.debug("Tracks from the client stream", tracks);

      // Add each track to the peer connection
      tracks.forEach((track) => {
        logger.debug(`setting tracks for PC:${JSON.stringify(pc)}`);
        pc.addTrack(track, localStream.current);
      });
    }
  }, []);

  const getTurnConfig = useCallback(async () => {
    fetch(`${apiBaseUrl}/api/getTurnConfig`)
      .then((response) => response.json())
      .then(async (data) => {
        setTurnConfig(data);
      });
  }, []);
  const getNewStreams = useCallback(
    (pc) => {
      //this gathers the stream tracks send by the remote peer
      //by listening to a specific event
      logger.debug("getting new streams from remote client");
      if (pc) {
        pc.ontrack = (event) => {
          const stream = event.streams[0];
            logger.debug(`Streams ${JSON.stringify(event.streams)}`);
          // logger.debug("Tracks",event.streams[0].getTracks())
          setVideoStream(stream);
          if (event.streams[0]) {
            if (!userStreamList.has(socketIdRef.current)) {
              setUserStreamList((prevMap) =>
                prevMap.set(socketIdRef.current, stream)
              );
            }

            logger.debug(`stream: ${JSON.stringify(userStreamList)}`);
          }
        };
      }
    },
    [userStreamList]
  );

  const initPeerConnection = useCallback(
    async (userId) => {
      logger.debug(
        `Initializing New Peer Connection for user: ${userId} turnConfig:${JSON.stringify(
          turnConfig
        )}`
      );
      if (turnConfig) {
          console.warn(turnConfig)
        const configuration = {
          iceServers: [

              {urls: turnConfig.urls.stun,
              username: turnConfig.username,
                  credential: turnConfig.credential,

              },
            {
              urls: turnConfig.urls.turn,
              username: turnConfig.username,
              credential: turnConfig.credential,
            },
            //{"urls": turnConfig.urls.stun,
            //"username": turnConfig.username,
            //"credential": turnConfig.credential
            //
            //    //"stun:stun.l.google.com:19302"
            //}
          ],
        };
        const pc = new RTCPeerConnection(configuration);
        // const pc = new RTCPeerConnection();
        peerConnection.current = pc;

        setPeerConnections(peerConnections.set(userId, pc));
        logger.debug(
          `new peer added to PeerConnections:${JSON.stringify(peerConnections)}`
        );
        await addTracksToPc(pc);

        getNewStreams(pc);
        return pc;
      } else {
        console.warn("Turn Credentials are not available yet");
          getTurnConfig()
      }
    },
    [addTracksToPc, turnConfig, getNewStreams, peerConnections,getTurnConfig]
  );

  const createOffer = useCallback(
    async (socketId, pc) => {
      console.log(
          "creating offer for:" ,socketId)
        console.log("and pc:",pc)
     
      const offerOpts = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      if (pc) {
        pc.createOffer(offerOpts)

          .then(async (offer) => {
            await pc.setLocalDescription(offer);
            pc.onicecandidate = async (event) => {
              if (event.candidate) {
                const iceCandidate = {
                  sender: socket.id,
                  receiver: socketId,
                  candidate: event.candidate,
                };
                console.info(
                  "gathering ice candidate and emitting:",
                  event.candidate
                );
                // Send ICE candidate to the server
                socket.emit("iceCandidate", iceCandidate);
              }
            };

            socket.emit("offer", { socketId: socketId, offer: offer });
          })
          .catch((error) => {
            console.error("Error creating offer:", error);
          });
      }
    },
    [socket]
  );
  const handleUserJoined = useCallback(
    async (data) => {
      //a user join and is alone in the room
      if (
        data.username === currentUserData.username &&
        data.users.length === 1
      ) {
        logger.debug("Salut t'es tout seul mon vieux");
      }
      //the user connect for the first time and triggers userJoined with its own data
      // but he is not alone in the room
      else if (
        data.username === currentUserData.username &&
        data.users.length > 1
      ) {
        console.info("hé mais t'es pas tout seul en plus !");
        const otherUsers = data.users.filter(
          (user) => user.userData.username !== currentUserData.username
        );
        console.info("voici les autres utilisateurs déjà connecté", otherUsers);
        otherUsers.forEach(async (userData) => {
          const pc = await initPeerConnection(userData.socketId);
        });
      }
      //the user is already connected and a new user join the room
      else if (data.username !== currentUserData.username) {
        const userId = data.socketId;
        logger.debug(
          `new user joined: ${data.username}, with socket: ${userId}, initializing PeerConnection`
        );
        const pc = await initPeerConnection(userId);
        await createOffer(userId, pc);
        getNewStreams(pc);
      }
    },
    [createOffer, currentUserData.username, getNewStreams, initPeerConnection]
  );
  const handleUserLeft = useCallback(
    (data) => {
      const id = data.socketId;
      logger.debug(
        `user ${data.username} has left the room, dropping peerConnection of ${
          data.socketId
        } now. see coherence with the list of users: ${JSON.stringify(
          data.users
        )}`
      );
      if (peerConnections.has(data.socketId)) {
        logger.debug(`dropping : ${data.socketId}`);
        const pcToDrop = peerConnections.get(id);
        pcToDrop.close();
        peerConnections.delete(id);
        logger.debug(
          `peerConnections after delete: ${JSON.stringify(peerConnections)}`
        );
      }
      if (userStreamList.has(id)) {
        const streamToDrop = userStreamList.get(id);
        logger.debug(
          `droping stream of value:${JSON.stringify(streamToDrop)},id: ${id}`
        );
        logger.debug(
          `list of remote Vid Ref before cleaning ${remoteVideoRefs}`
        );
        logger.debug(
          `list of remote Vid streams before cleaning ${JSON.stringify(
            remoteStreams
          )}`
        );
        logger.debug(
          `diff between VideoRef: ${remoteVideoRefs}, stream:${JSON.stringify(
            streamToDrop
          )}`
        );

        setRemoteVideoRefs((prevRefs) =>
          prevRefs.filter(
            (ref) => ref.current && ref.current.srcObject !== streamToDrop
          )
        );

        setRemoteStreams((prevStreams) =>
          prevStreams.filter((stream) => stream !== streamToDrop)
        );
      }

      logger.debug(`droping stream: ${userStreamList.get(id)}`);
      logger.debug(`videoStream:", videoStream`);
      logger.debug(`list of remote Vid Ref", ${remoteVideoRefs}`);
      logger.debug(`list of remote Vid streams", ${remoteStreams}`);
    },
    [peerConnections, remoteStreams, remoteVideoRefs, userStreamList]
  );
  const handleOffer = useCallback( async (offer) => {
      console.info("Received offer:",offer);
      logger.debug("setting newOffer with the received offer:", offer);
      socketIdRef.current = offer.id;
      if (peerConnections.has(offer.id)) {
        logger.debug("got an offer from", offer.id);
      }
      if (!peerConnections.has(offer.id)) {
        logger.debug(`no peerConnection associated with id: ${offer.id}`);
        return;
      } else {
        const sessionDescription = new RTCSessionDescription(offer.offer);
        const pc = peerConnections.get(offer.id);
        logger.debug("setting remoteDescription with offer:", offer.id, pc);
        pc.setRemoteDescription(sessionDescription);
        logger.debug("SDP", sessionDescription);

        // Create answer
        try {
            const answer = await pc.createAnswer();

            if (answer) {
            await pc.setLocalDescription(answer)
              const customAnswer = {
                sender: socket.id,
                receiver: offer.id,
                answer: pc.localDescription,
              };
              console.log(
                `answer ${JSON.stringify(
                  customAnswer
                )} correctly set, emitting right now ...`
              );
              socket.emit("answer", customAnswer);
            } else {
                console.error("Error creating answer, answer is:",answer);
            };
        } catch (err) {
          logger.error(`Error creating webRTC Answer: ${err}`);
          if (pc.iceConnectionState === "failed") {
            logger.error("Ice connection Failed");
          }
        }
      }
    },
    [peerConnections, socket]
  );
  const handleAnswer = useCallback(async (answer) => {
      logger.debug(`"Received answer:${JSON.stringify(answer)}`);

      if (!peerConnections.has(answer.sender)) {
        logger.debug(
          "on answer failed to setRemoteDescription, no peerConnection for the associated id",
          answer.sender
        );
        return;
      }
      const pc = peerConnections.get(answer.sender);
      await pc.setRemoteDescription(new RTCSessionDescription(answer.answer));
      const senders = pc.getSenders();
      logger.debug("SENDERS", senders);
      getNewStreams(pc);
    },
    [peerConnections, getNewStreams]
  );
  const cleanupTracksFromPeerConnection = (stream) => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      const receiver = peerConnection.current
        .getReceivers()
        .find((receiver) => receiver.track === track);
      if (receiver) {
        track.stop();
        logger.debug("track stopped from local pc", track, receiver);
      } else {
        console.warn("receiver not found for track:", track);
      }
    });
  };

  const handleIceCandidate = useCallback(
    async (iceCandidate) => {
      logger.debug(`ice candidate: ${JSON.stringify(iceCandidate)}`);
      if (!peerConnections.has(iceCandidate.sender)) return;
      const pc = await peerConnections.get(iceCandidate.sender);

      try {
        pc.addIceCandidate(new RTCIceCandidate(iceCandidate.candidate));
      } catch (error) {
        console.error("cannot add ice candidate", iceCandidate.candidate);
      }
    },
    [peerConnections]
  );
  const renewOfferLocalStream = useCallback(() => {
    // Send offer to server
    if (localStream.current) {
      const offerOptions = {
        iceRestart: true,
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      if (peerConnection.current) {
        peerConnection.current
          .createOffer(offerOptions)
          .then((offer) => {
            setNewOffer(offer);
            logger.debug("setting new offer:", newOffer);
            peerConnection.current.setLocalDescription(newOffer);
          })

          .then(() => {
            logger.debug("new offer", peerConnection.current.localDescription);
            let offer = peerConnection.current.localDescription;
            let socketId = socket.id;
            socket.emit("offer", { socketId: socketId, offer: offer });
          })
          .catch((error) => {
            console.error("Error creating offer:", error);
          });
      }
    }
  }, [socket, newOffer]);

  useEffect(() => {
    getTurnConfig();
  }, [getTurnConfig]);

  //useEffect(() => {
  //  if (
  //    peerConnection.current &&
  //    users[users.length ? users.length - 1 : null] !== currentUserData.username
  //  ) {
  //    logger.debug("new user joined, sending new offer stream");
  //
  //    getNewStreams(peerConnection.current);
  //    renewOfferLocalStream();
  //    logger.debug("new users", users);
  //  }
  //}, [users, getNewStreams, renewOfferLocalStream, currentUserData.username]);

  useEffect(() => {
    const initializeSocket = () => {
      socket.on("userLeft", (data) => {
        handleUserLeft(data);
      });
      socket.on("userJoined", async (data) => {
       await handleUserJoined(data);
      });
      socket.on("offer",  (offer) => {
        handleOffer(offer);
      });
      socket.on("answer",  (answer) => {
       handleAnswer(answer);
      });
      socket.on("iceCandidate", async (iceCandidate) => {
       await handleIceCandidate(iceCandidate);
      });
    };
    initializeSocket();
    return () => {
        //socket.off("userLeft"); call socket.off for this will make the behavior of the ChatRoom unstable, e. g usersList not always visible...
        //socket.off("userJoined")
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };
  }, [
    handleUserLeft,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    socket,
  ]);
  useEffect(() => {
    getMediaDevices();
    return () => {
      if (peerConnections.size > 0) {
        peerConnections.forEach((pc) => pc.close());
      }
    };
  }, [peerConnections, getMediaDevices]);

  useEffect(() => {
    return () => {
      if (localStream.current) {
        const tracks = localStream.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoStream) {
      logger.debug("adding element to RemoteStreams array");
      setRemoteStreams((prevStreams) => [...prevStreams, videoStream]);
    }
  }, [videoStream, socket]);

  
  useEffect(() => {
    if (peerConnections.size > 0) {
      peerConnections.forEach((pc) => {
        logger.debug("PC attributes:", pc);
        getNewStreams(pc);
      });
    }
  }, [videoStream, getNewStreams, peerConnections]);

  useEffect(() => {
    if (remoteStreams.length > 0) {
      remoteStreams.map(() =>
        setRemoteVideoRefs((prevRefs) => [...prevRefs, React.createRef()])
      );
    }
    // Initialize refs array
  }, [remoteStreams]);
  useEffect(() => {
    // Update srcObject for each remote video
    remoteStreams.forEach((stream, index) => {
      if (stream) {
        const videoRef = remoteVideoRefs[index];
        logger.debug("videoRef", videoRef);
        if (videoRef && videoRef.current) {
          logger.debug("single stream added to VidRemote Reference", stream);
          videoRef.current.srcObject = stream;
          logger.debug(
            "video Ref list  after adding remote stream",
            remoteVideoRefs
          );
          logger.debug(
            "video Streams list  after adding remote stream",
            remoteStreams
          );
        }
      }
    });
  }, [remoteStreams, remoteVideoRefs]);

  return (
    <div>
      <LocalVideo
        id="localVideo"
        ref={localVideoRef}
        autoPlay
        muted
      ></LocalVideo>
      <RemoteVideoContainer>
        {remoteVideoRefs.map((refStream, index) =>
          refStream !== null ? (
            <RemoteVideo key={index} autoPlay ref={refStream}></RemoteVideo>
          ) : null
        )}
      </RemoteVideoContainer>
    </div>
  );
};

export default WebCam;
