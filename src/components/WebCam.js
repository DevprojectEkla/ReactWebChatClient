import React, { useState, useEffect, useCallback, useRef } from "react";
import { logger } from "../utils/logger";
import { apiBaseUrl } from "../config";
import {
  VideoButtonContainer,
  RemoteVideoContainer,
  RemoteVideo,
  LocalVideo,
} from "../styles/WebCamStyles";
import VideoCamIcon from "@mui/icons-material/Videocam";
import Button from "@mui/material/Button";

const WebCam = ({ socket }) => {
  const localStream = useRef(null);
  const receivedIceCandidate = useRef(new Set());
  const [webCamOn, setWebCamOn] = useState(false);
  const [peerIsOffering, setPeerIsOffering] = useState(false);

  const [tracksOn, setTracksOn] = useState(false);
  const peerConnections = useRef(new Map());
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
  const killCam = () => {
    if (localStream.current) {
      let pc = peerConnection.current;
      const tracks = localStream.current.getTracks();
      const data = { socketId: socket.id };
      socket.emit("camTurnedOff", data);
      tracks.forEach((track) => {
        track.stop();
        if (pc && pc.signalingState !== "closed") {
          let trackToRemove = pc
            .getSenders()
            .find((sender) => sender.track === track);
          if (trackToRemove) {
            pc.removeTrack(trackToRemove);
          }
        }
      });
    }
    localStream.current = null;

    setWebCamOn(false);
  };
  const camTurnedOn = async () => {
    setWebCamOn(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
      if (webCamOn) {
      let pc = peerConnection.current;
      if (pc && pc.signalingState !== "closed") {
        console.log("renewing offer for users:", peerConnections.current);
        if (!tracksOn) {
          addTracksToPc(pc);
          setTracksOn(true);
        }
        const otherUsers = Array.from(peerConnections.current).filter(
          ([id, _]) => id !== socket.id
        );
        otherUsers.forEach(async (id) => {
          await createOffer(id, pc);
        });
        getNewStreams(pc);
      }
    }

  };

  const addTracksToPc = useCallback(async (pc) => {
    const sender = pc.getSenders().find((s) => s.track);
    if (localStream.current) {
      logger.debug("localStream detected: adding tracks to PCs");
      if (sender) {
        pc.getSenders().replaceTrack(localStream.current);
      } else {
        const tracks = await localStream.current.getTracks();
        logger.debug("Tracks from the client stream", tracks);

        // Add each track to the peer connection
        tracks.forEach((track) => {
          logger.debug(`setting tracks for PC:${JSON.stringify(pc)}`);
          pc.addTrack(track, localStream.current);
        });
      }
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
      logger.info("getting new streams from remote client");
      if (pc) {
        pc.ontrack = (event) => {
          const stream = event.streams[0];
          logger.debug(`Streams ${JSON.stringify(event.streams)}`);
          logger.info("Tracks", event.streams[0].getTracks());
          setVideoStream(stream);
          if (event.streams[0]) {
            if (!userStreamList.has(socketIdRef.current)) {
              setUserStreamList((prevMap) =>
                prevMap.set(socketIdRef.current, stream)
              );
            }

            logger.info("stream:", userStreamList);
          }
        };
      }
    },

    [userStreamList]
  );

  const initPeerConnection = useCallback(
    async (socketId) => {
      logger.info("Initializing New Peer Connection for user:", [
        socketId,
        turnConfig,
      ]);
      if (turnConfig) {
        console.warn(turnConfig);
        const configuration = {
          iceServers: [
            {
              urls: turnConfig.urls.turn_ssl,
              username: "test",
              credential: "123456",
            },

            {
              urls: turnConfig.urls.turn,
              username: "test",
              credential: "123456",
            },

            //             {
            //               urls: turnConfig.urls.stun,
            //               username: turnConfig.username,
            //               credential: turnConfig.credential,
            //             },
            //             {
            //               urls: turnConfig.urls.turn,
            //               username: turnConfig.username,
            //               credential: turnConfig.credential,
            //             },
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

        peerConnections.current.set(socketId, pc);
        logger.debug("new peer added to PeerConnections:", peerConnections);
     
        return pc;
      } else {
        console.warn("Turn Credentials are not available yet");
        getTurnConfig();
      }
    },
    [turnConfig, getTurnConfig]
  );

  const createOffer = useCallback(
    async (socketId, pc) => {
      console.log("creating offer for:", socketId);
      console.log("and pc:", pc);

      const offerOpts = {
        // iceRestart: true,
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      if (pc) {
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

        pc.createOffer(offerOpts)

          .then(async (offer) => {
            await pc.setLocalDescription(offer);

            socket.emit("offer", { socketId: socketId, offer: offer });
          })
          .catch((error) => {
            console.error("Error creating offer:", error);
          });
      }
    },
    [socket]
  );
  //the user is already connected and a new user join the room
  const handleUserJoined = useCallback(
    async (data) => {
      console.info("hé tu n'es plus tout seul maintenant !");

      console.info("voici le nouvel utilisateur", data.username);
      const socketId = data.socketId;
      logger.debug(
        `new user joined: ${data.username}, with socket: ${socketId}, initializing PeerConnection`
      );
      const pc = await initPeerConnection(socketId);

      getNewStreams(pc);
      if (webCamOn) {
        await addTracksToPc(pc);
        setTracksOn(true);
      }
      await createOffer(socketId, pc);
    },

    [addTracksToPc, createOffer, getNewStreams, initPeerConnection, webCamOn]
  );
  const handleConnect = useCallback(
    async (users) => {
      console.warn("users, socketId", users, socket.id);
      const otherUsers = users.filter((user) => user.socketId !== socket.id);
      console.warn("filtered:", otherUsers);
      otherUsers.forEach(
        async (user) => await initPeerConnection(user.socketId)
      );
      console.debug("Users for handle connected:", users);
    },
    [socket.id, initPeerConnection]
  );
  const handleCamTurnedOff = useCallback(
    (data) => {
      console.warn("Cam turned off");
      const id = data.socketId;
      if (userStreamList.has(id)) {
        const streamToDrop = userStreamList.get(id);
        logger.debug(`droping stream of value:`, streamToDrop, id);
        logger.debug(`list of remote Vid Ref before cleaning`, remoteVideoRefs);
        logger.debug(
          `list of remote Vid streams before cleaning:`,
          remoteStreams
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
    },
    [remoteStreams, remoteVideoRefs, userStreamList]
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
      if (peerConnections.current.has(data.socketId)) {
        logger.debug(`dropping :`, data.socketId);
        const pcToDrop = peerConnections.current.get(id);
        pcToDrop.close();
        peerConnections.current.delete(id);
        logger.debug(`peerConnections after delete:`, peerConnections.current);
      }
      if (userStreamList.has(id)) {
        const streamToDrop = userStreamList.get(id);
        logger.debug(`droping stream of value:`, streamToDrop, id);
        logger.debug(`list of remote Vid Ref before cleaning`, remoteVideoRefs);
        logger.debug(
          `list of remote Vid streams before cleaning:`,
          remoteStreams
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

      logger.debug(`droping stream:`, userStreamList.get(id));
      logger.debug("list of remote Vid Ref", remoteVideoRefs);
      logger.debug("list of remote Vid streams", remoteStreams);
    },
    [remoteStreams, remoteVideoRefs, userStreamList]
  );
  const handleOffer = useCallback(
    async (offer) => {
      console.info("Received offer:", offer);
      logger.debug("setting newOffer with the received offer:", offer);
      socketIdRef.current = offer.id;
      if (peerConnections.current.has(offer.id)) {
        logger.info("got an offer from", offer.id);
      }
      if (!peerConnections.current.has(offer.id)) {
        logger.info(`no peerConnection associated with id:`, offer.id);
        const pc = await initPeerConnection(offer.id);
        if (webCamOn) {
          await addTracksToPc(peerConnection.current);
        }
        getNewStreams(pc);
        handleOffer(offer);
      } else {
        const sessionDescription = new RTCSessionDescription(offer.offer);
        const pc = peerConnections.current.get(offer.id);
        logger.debug("setting remoteDescription with offer:", offer.id, pc);
        pc.setRemoteDescription(sessionDescription);
        logger.debug("SDP", sessionDescription);

        // Create answer
        try {
          const answer = await pc.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            // iceRestart: true,
          });
          console.log("Answer for localDescription :", answer);

          if (answer && pc.signalingState !== "stable") {
            console.log("starting gathering ICE Candidates for:", offer.id);
            console.log("from:", socket.id);

            await pc.setLocalDescription(answer);
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
            console.error("Error creating answer, answer is:", answer);
          }
        } catch (err) {
          logger.error(`Error creating webRTC Answer:`, err);

          if (pc.iceConnectionState === "failed") {
            logger.error("Ice connection Failed", err);
          }
        }
      }
    },
    [socket, initPeerConnection, addTracksToPc, getNewStreams, webCamOn]
  );
  const handleAnswer = useCallback(
    async (answer) => {
      logger.info("Received answer:", answer);

      if (!peerConnections.current.has(answer.sender)) {
        logger.info(
          "on answer failed to setRemoteDescription, no peerConnection for the associated id",
          answer.sender
        );
        return;
      }
      const pc = peerConnections.current.get(answer.sender);
      if (
        pc.signalingState === "have-local-offer" &&
        pc.signalingState !== "stable"
      ) {
        logger.info("Trying to set Remote description", pc.signalingState);
        await pc.setRemoteDescription(new RTCSessionDescription(answer.answer));
        pc.remoteDescriptionSet = true; //this avoid multiple rerenders of the same state
        // with the answer being set multiple times causing errors
        console.log("new state after SDP:", pc.signalingState);
        getNewStreams(pc)
      }
      // const senders = pc.getSenders();
      // logger.debug("SENDERS", senders);
    },
    [getNewStreams]
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
      logger.info(
        `ice candidate event received from server: ${JSON.stringify(
          iceCandidate
        )}`
      );
      if (!peerConnections.current.has(iceCandidate.sender)) return;
      const pc = await peerConnections.current.get(iceCandidate.sender);

      try {
        if (pc.iceGatheringState === "complete") {
          logger.info("ICE gathering complete");
          logger.info("Adding local tracks to own pc");
          await addTracksToPc();
          pc.iceGatheringComplete = true; // Mark ICE gathering as complete
        } else if (
          pc.iceGatheringState === "new" ||
          pc.iceGatheringState === "gathering"
        ) {
          console.log("Gathering State for candidate:", pc.iceGatheringState);
          if (receivedIceCandidate.current.has(iceCandidate.candidate)) {
            console.warn(
              "Ignoring Duplicate Ice Candidate",
              iceCandidate.candidate
            );
            return;
          } else {
            pc.addIceCandidate(new RTCIceCandidate(iceCandidate.candidate));
            receivedIceCandidate.current.add(iceCandidate.candidate);
            console.info(
              "added new candidate to receivedIceCandidate Set",
              receivedIceCandidate.current
            );
            getNewStreams(pc);
          }
        }
      } catch (error) {
        console.error("cannot add ice candidate", iceCandidate.candidate);
      }
    },
    [addTracksToPc, getNewStreams]
  );
  const renewOfferLocalStream = async () => {
    // Send offer to server
    if (localStream.current) {
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };

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
  };

  
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
      socket.on("connected", (users) => {
        console.log("WebCam Comp connected");
        handleConnect(users);
      });
      socket.on("camTurnedOff", (data) => {
        handleCamTurnedOff(data);
      });

      socket.on("userLeft", (data) => {
        handleUserLeft(data);
      });
      socket.on("userJoined", async (data) => {
        await handleUserJoined(data);
      });
      socket.on("offer", (offer) => {
          setPeerIsOffering(true)
        handleOffer(offer);
      });
      socket.on("answer", (answer) => {
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
      socket.off("camTurnedOff");
      socket.off("offer");
      socket.off("iceCandidate");
      socket.off("answer");
    };
  }, [
    handleConnect,
    handleCamTurnedOff,
    handleUserLeft,
    handleUserJoined,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    socket,
  ]);
  useEffect(() => {
    const pc =  peerConnection.current
    return () => {
      if (pc && pc.size > 0) {
        pc.forEach((pc) => pc.close());
      }
    };
  }, []);

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
    if (peerConnections.current.size > 0) {
      peerConnections.current.forEach((pc) => {
        logger.debug("PC attributes:", pc);
        getNewStreams(pc);
      });
    }
  }, [videoStream, getNewStreams]);

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
      {webCamOn ? (
        <VideoButtonContainer>
          <LocalVideo
            id="localVideo"
            ref={localVideoRef}
            autoPlay
            muted
          ></LocalVideo>

          <Button
            onClick={() => killCam()}
            variant="contained"
            endIcon={<VideoCamIcon />}
          >
            Close Cam
          </Button>
        </VideoButtonContainer>
      ) : (
        <Button
          onClick={() => camTurnedOn()}
          variant="contained"
          endIcon={<VideoCamIcon />}
        >
          Open Cam
        </Button>
      )}
      <div>
        <RemoteVideoContainer>
          {remoteVideoRefs.map((refStream, index) =>
            refStream !== null ? (
              <RemoteVideo key={index} autoPlay ref={refStream}></RemoteVideo>
            ) : null
          )}
        </RemoteVideoContainer>
      </div>
    </div>
  );
};

export default WebCam;
