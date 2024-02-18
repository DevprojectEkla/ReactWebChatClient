import React, { useState, useEffect, useRef } from "react";
import UserList from "./UserList";
import WebCam from "./WebCam";
import styled from "styled-components";
import io from "socket.io-client";
import { HOVER_EFFECT, THEME_COLOR, apiBaseUrl, isDevelopment } from "config";
import {
  getUserName,
  createCookie,
  getCookie,
  generateUniqueId,
  generateDefaultName,
} from "../utils/cookieUtils";
const LeftContainer = styled.div`
  margin-right: 20px;
`;
const WebCamContainer = styled.div`
  display: flex;
  flex-align: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const ChatRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const CenteredContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const ChatContainer = styled.div`
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  background-color: rgba(0, 0, 255, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(70, 80, 250, 0.5);
  }
`;

const ChatHeader = styled.h2`
  color: #fff;
  padding: 5px;
  text-align: center;
`;

const ChatMessages = styled.div`
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

const Message = styled.div`
  color: white;
  margin-bottom: 8px;
  padding: 8px;
  background-color: rgb(100, 180, 255, 0.4);
  border-radius: 4px;
  transition: background-color 0.3s ease;
  word-wrap: break-word;

  ${(props) =>
    props.$issender === "true"
      ? `
    margin-left:65%;
    width:120px;
        background-color: rgb(230,80,15,.2);
        text-align: right;
        color: white;
      `
      : `
        width:120px;
        background-color: #d3ffd3;
        text-align: left;
        color: green;
      `}

  &:hover {
    background-color: rgb(230, 80, 15, 0.5);
  }
`;

const SenderName = styled.span`
  color: black;
  font-weight: bold;
  margin-right: 8px;
`;

const ChatInput = styled.input`
  width: 90%;
  padding: 10px;
  border: none;
  border-top: 1px solid #ccc;
  background-color: ;
  ${HOVER_EFFECT};
`;

const SendButton = styled.button`
background: url(/assets/send.png) no-repeat center center;
background-size: 50%;
border: 2px, solid, #95a5a6;
  border-radius: 4px;
height: 40px;
  width: 60px;
  padding: 10px;
  color: white;
  cursor: pointer;
vertical-align:middle;
${HOVER_EFFECT}  }

`;

const EmojiButton = styled.button`
  border-radius: 4px;
  border: 2px, solid, #95a5a6;
  height: 40px;
  width: 60px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  vertical-align: middle;
  cursor: pointer;
  ${HOVER_EFFECT}
`;

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [userSenderId, setUserSenderId] = useState("");
  const [currentUserData, setCurrentUserData] = useState("");
  const [users, setUsers] = useState([]);
  const [newUserData, setNewUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const chatContainerRef = useRef(null);

  const createIoDevClient = (userData) =>
    io(apiBaseUrl, {
      withCredentials: true,
      query: { userData: JSON.stringify(userData) },
    });
  const createIoProdClient = (userData) =>
    io(apiBaseUrl, { query: { userData: JSON.stringify(userData) } });

  const handleMessage = (data) => {
    console.log("Received Message", data);
    setUserSenderId(data.sender);
    console.log("ID", data.sender);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: data.sender, text: data.text },
    ]);
    // console.log("chatContainerRef values:",chatContainerRef.current,chatContainerRef.current.scrollTop,chatContainerRef.current.scrollHeight )
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    // console.log("dynamic value for chatContainerRef:",chatContainerRef.current.scrollTop)
  };
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    // console.log("chatContainerRef values from scrollToBottom function:",chatContainerRef.current,chatContainerRef.current.scrollTop,chatContainerRef.current.scrollHeight )
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && socket) {
      const username = await getUserName();
      socket.emit("message", { text: newMessage, sender: username });
      setNewMessage("");
      // console.log("chatContainerRef values:",chatContainerRef.current,chatContainerRef.current.scrollTop,chatContainerRef.current.scrollHeight )
    }
  };

  const handleEmojiClick = () => {
    console.log("emoji menu clicked");
  };
  useEffect(() => {
    const initializeSocket = async () => {
      const cookieData = await getCookie("session_data");
      // console.log(cookieData)

      // Initialize the socket
      if (socket === null) {
        const userData = cookieData;
        console.log("user data from cookie for socket io", userData);

        const socketInstance = isDevelopment
          ? createIoDevClient(userData)
          : createIoProdClient(userData);
        setSocket(socketInstance);
        setCurrentUserData(userData);

        // console.log("socket created", socket);
      }
    };
    initializeSocket();

    // Cleanup when the component unmounts
    return () => {
      if (socket) {
        console.log("socket disconnection", socket);
        socket.disconnect();
      }
    };

    // Empty dependency array means this effect will run once when the component mounts
  }, [socket]);
  useEffect(() => {
    if (socket) {
      socket.on("message", handleMessage);
      scrollToBottom();
      console.log("handling message", socket);

      socket.emit("joinRoom", { room: "chatRoom" });

      // Listen for the 'userJoined' event
      socket.on("userJoined", (data) => {
        console.log("new user data:", data);

        setNewUserData(data);
        console.log(`User ${data.username} joined the chat room`);

        setUsers((prevUsers) => {
          if (prevUsers.length === 0) {
            return data.users;
          } else {
            return prevUsers.some(
              (user) => user.userData.username === data.username
            )
              ? prevUsers
              : [...prevUsers, { userData: data, socketId: socket.id }];
          }
        });
      });

      // Listen for the 'userLeft' event
      socket.on("userLeft", (data) => {
        console.log(`User ${data.username} left the chat room`);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.userData.username !== data.username)
        );
      });
    }
  }, [socket]);
  useEffect(() => {
    const playMessageSound = () => {
      const audioElement = document.getElementById("messageSound");
      audioElement.play();
    };

    // Play sound when a new message is received
    playMessageSound();

    // Clean up function
    return () => {
      // Pause the audio when the component unmounts
      const audioElement = document.getElementById("messageSound");
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [messages]);
  return (
    <ChatRoomContainer>
      <WebCamContainer>
        {socket ? (
          <WebCam
            socket={socket}
            newUser={newUserData}
            users={users}
            currentUserData={currentUserData}
          />
        ) : (
          <></>
        )}
      </WebCamContainer>

      <CenteredContainer ref={chatContainerRef}>
        <LeftContainer>
          {socket ? <UserList users={users} /> : <></>}
        </LeftContainer>
        <ChatContainer>
          <ChatHeader>Chat Room</ChatHeader>
          <ChatMessages ref={chatContainerRef}>
            {messages.map((message, index) => (
              <Message
                ref={chatContainerRef}
                key={index}
                $issender={(message.sender === socket.id).toString()}
              >
                <SenderName>{message.text.sender}:</SenderName>
                {message.text.text}
              </Message>
            ))}
          </ChatMessages>
          <ChatInput
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />

          <audio id="messageSound" src="/assets/message_sent.mp3"></audio>

          <SendButton onClick={handleSendMessage}></SendButton>
          <EmojiButton onClick={handleEmojiClick}>😊</EmojiButton>
        </ChatContainer>
      </CenteredContainer>
    </ChatRoomContainer>
  );
};

export default ChatRoom;
