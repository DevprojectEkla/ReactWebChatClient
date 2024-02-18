import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { apiBaseUrl, MY_TURN_SERVER } from "config";
import styled from "styled-components";
import { getCookie } from "../utils/cookieUtils";

const RemoteVideo = styled.video`
  width: 100%;
  max-width: 400px; /* Adjust the maximum width as needed */
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease; /* Smooth transition for border color */

  /* Cool effects on hover */
  &:hover {
    border-color: #ff6b6b; /* Change border color on hover */
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.5); /* Add shadow effect on hover */
  }
`;
const RemoteVideoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const LocalVideo = styled.video`
  width: 100%;
  max-width: 200px; /* Adjust the maximum width as needed */
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease; /* Smooth transition for border color */

  /* Cool effects on hover */
  &:hover {
    border-color: #ff6b6b; /* Change border color on hover */
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.5); /* Add shadow effect on hover */
  }
`;
const WebCam = ({ users, currentUserData, socket }) => {
  const localStream = useRef(null);
  const [peerConnections, setPeerConnections] = useState(new Map());
  const [newOffer, setNewOffer] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const localVideoRef = useRef(null);
  const [remoteVideoRefs, setRemoteVideoRefs] = useState([]);
  const [userStreamList, setUserStreamList] = useState(new Map());
  const [peerList, setPeerList] = useState([]);
  const socketIdRef = useRef(null);

  const peerConnection = useRef(null);
  const getMediaDevices = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
        console.log(localStream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };
  const addTracksToPc = async (pc) => {
    if (localStream.current) {
      console.log("localStream detected: adding tracks to PCs");
      const tracks = await localStream.current.getTracks();
      console.log("Tracks from the client stream", tracks);

      // Add each track to the peer connection
      tracks.forEach((track) => {
        console.log("setting tracks for PC:", pc);
        pc.addTrack(track, localStream.current);
      });
    }
  };
  const initPeerConnection = async (userId) => {
    console.log("Initializing New Peer Connection for user:", userId);
    const configuration = {
      iceServers: [
        {
          urls: `${MY_TURN_SERVER}`,
          // urls: "stun:stun.l.google.com:19302",
          username: "ekla",
          credential: "12345678",
        },
      ],
    };
    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    setPeerConnections(peerConnections.set(userId, pc));
    console.log("new peer added to PeerConnections", peerConnections);
    await addTracksToPc(pc);
    return pc;
  };

  const createOffer = async (socketId, pc) => {
    console.dir(`creating offer for ${socketId} and pc ${pc}`);
    const offerOpts = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
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
  };

  const cleanupTracksFromPeerConnection = (stream) => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      const receiver = peerConnection.current
        .getReceivers()
        .find((receiver) => receiver.track === track);
      if (receiver) {
        track.stop();
        console.log("track stopped from local pc", track, receiver);
      } else {
        console.warn("receiver not found for track:", track);
      }
    });
  };
  const renewOfferLocalStream = () => {
    // Send offer to server
    if (localStream.current) {
      const offerOptions = {
        iceRestart: true,
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      peerConnection.current
        .createOffer(offerOptions)
        .then((offer) => {
          setNewOffer(offer);
          console.log("setting new offer:", newOffer);
          peerConnection.current.setLocalDescription(newOffer);
        })

        .then(() => {
          console.log("new offer", peerConnection.current.localDescription);
          socket.broadcast.emit(
            "offer",
            peerConnection.current.localDescription
          );
        })
        .catch((error) => {
          console.error("Error creating offer:", error);
        });
    }
  };
  const getNewStreams = (pc) => {
    //this gathers the stream tracks send by the remote peer
    //by listening to a specific event
    console.log("getting new streams from remote client");
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      console.log("Streams", event.streams);
      // console.log("Tracks",event.streams[0].getTracks())
      setVideoStream(stream);
      if (event.streams[0]) {
        console.log("Stream List on user joined", userStreamList);
        if (!userStreamList.has(socketIdRef.current)) {
          setUserStreamList((prevMap) =>
            prevMap.set(socketIdRef.current, stream)
          );
        }

        console.log("stream:", stream);
      }
    };
  };
  // useEffect(() => {
  //   if (
  //     peerConnection.current &&
  //     users[users.length ? users.length - 1 : null] !== currentUserData.username
  //   ) {
  //     console.log("new user joined, sending new offer stream");
  //       getNewStreams()
  //     renewOfferLocalStream();
  //     console.log("new users", users);
  //   }
  // }, [users, currentUserData, peerConnection,videoStream]);
  useEffect(() => {
    socket.on("userLeft", (data) => {
      const id = data.socketId;
      console.log(
        `user ${data.username} has left the room, dropping peerConnection of ${
          data.socketId
        } now. see coherence with the list of users: ${JSON.stringify(
          data.users
        )}`
      );
      if (peerConnections.has(data.socketId)) {
        console.log("dropping :", data.socketId);
        const pcToDrop = peerConnections.get(id);
        pcToDrop.close();
        peerConnections.delete(id);
        console.log("peerConnections after delete", peerConnections);
      }
      if (userStreamList.has(id)) {
        const streamToDrop = userStreamList.get(id);
        console.log("droping stream of value:", streamToDrop, id);
        console.log("list of remote Vid Ref before cleaning", remoteVideoRefs);
        console.log(
          "list of remote Vid streams before cleaning",
          remoteStreams
        );
        console.log(
          "diff between ref, stream",
          remoteVideoRefs,
          streamToDrop
        );

        setRemoteVideoRefs(remoteVideoRefs.filter((element) => { const tracks = element.current.srcObject?.getTracks(); if(tracks && tracks.length>0){
                return !(tracks.every(track=> track.muted) )} else{return false}}))

        ;

        setRemoteStreams(remoteStreams.filter((element) => element !== streamToDrop)
        );
      }

      console.log("droping stream:", userStreamList.get(id));
      console.log("videoStream:", videoStream);
      console.log("list of remote Vid Ref", remoteVideoRefs);
      console.log("list of remote Vid streams", remoteStreams);
    });
  }, [
    socket,
    remoteVideoRefs,
    userStreamList,
    videoStream,
    peerConnections,
    remoteStreams,
  ]);
  useEffect(() => {
    getMediaDevices();
    return () => {
      if (peerConnections.size > 0) {
        peerConnections.forEach((pc) => pc.close());
      }
      if (localStream.current) {
        const tracks = localStream.current.getTracks();
        tracks.forEach((track) => track.stop);
      }
    };
  }, []);
  useEffect(() => {
    if (videoStream) {
      console.log("adding element to RemoteStreams array");
      setRemoteStreams((prevStreams) => [...prevStreams, videoStream]);
    }
  }, [videoStream, socket]);

  useEffect(() => {
    socket.on("userJoined", async (data) => {
      //a user join and is alone in the room
      if (
        data.username === currentUserData.username &&
        data.users.length === 1
      ) {
        console.log("Salut t'es tout seul mon vieux");
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
          getNewStreams(pc);
        });
      }
      //the user is already connected and a new user join the room
      else if (data.username !== currentUserData.username) {
        const userId = data.socketId;
        console.log(
          `new user joined: ${data.username}, with socket: ${userId}, initializing PeerConnection`
        );
        const pc = await initPeerConnection(userId);
        await createOffer(userId, pc);
        getNewStreams(pc);
      }
    });
  }, []);

  // Handle signaling messages
  useEffect(() => {
    socket.on("offer", (offer) => {
      console.log("Received offer:", offer);
      console.log("setting newOffer with the received offer:", offer);
      socketIdRef.current = offer.id;
      if (peerConnections.has(offer.id)) {
        console.log("got an offer from", offer.id);
      }
      if (!peerConnections.has(offer.id)) {
        console.log("no peerConnection associated with id:", offer.id);
        return;
      } else {
        const sessionDescription = new RTCSessionDescription(offer.offer);
        const pc = peerConnections.get(offer.id);
        console.log("setting remoteDescription with offer:", offer.id, pc);
        pc.setRemoteDescription(sessionDescription);
        console.log("SDP", sessionDescription);

        // Create answer
        pc.createAnswer()
          .then((answer) => pc.setLocalDescription(answer))
          .then(() => {
            const customAnswer = {
              sender: socket.id,
              receiver: offer.id,
              answer: pc.localDescription,
            };
            console.dir(
              `answer ${JSON.stringify(
                customAnswer
              )} correctly set, emitting right now ...`
            );
            socket.emit("answer", customAnswer);
          })
          .catch((error) => {
            console.error("Error creating answer:", error);
          });
      }
    });

    socket.on("answer", (answer) => {
      console.log("Received answer:", answer);

      if (!peerConnections.has(answer.sender)) {
        console.log(
          "on answer failed to setRemoteDescription, no peerConnection for the associated id",
          answer.sender
        );
        return;
      }
      const pc = peerConnections.get(answer.sender);
      pc.setRemoteDescription(new RTCSessionDescription(answer.answer));
      const senders = pc.getSenders();
      console.log("SENDERS", senders);
      getNewStreams(pc);
    });

    socket.on("iceCandidate", async (iceCandidate) => {
      console.log("ice candidate:", iceCandidate);
      if (!peerConnections.has(iceCandidate.sender)) return;
      const pc = await peerConnections.get(iceCandidate.sender);

      try {
        pc.addIceCandidate(new RTCIceCandidate(iceCandidate.candidate));
      } catch (error) {
        console.error("cannot add ice candidate", iceCandidate.candidate);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };
  }, [socket]);

  useEffect(() => {
    if (peerConnections.size > 0) {
      peerConnections.forEach((pc) => {
        console.log("PC attributes:", pc);
        getNewStreams(pc);
      });
    }
  }, [videoStream]);

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
        console.log("videoRef", videoRef);
        if (videoRef && videoRef.current) {
          console.log("single stream added to VidRemote Reference", stream);
          videoRef.current.srcObject = stream;
          console.log(
            "video Ref list  after adding remote stream",
            remoteVideoRefs
          );
          console.log(
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
          ) : (
            <></>
          )
        )}
      </RemoteVideoContainer>
    </div>
  );
};

export default WebCam;
