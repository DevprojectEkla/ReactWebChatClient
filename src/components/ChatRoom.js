import React, { useState, useEffect, useRef } from 'react';
import InsertEmoticonOutlinedIcon from '@mui/icons-material/InsertEmoticonOutlined';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

import UserList from './UserList';
import WebCam from './WebCam';
import { logger } from '../utils/logger';
import { getUserName } from '../utils/cookieUtils';
import {
    ChatRoomContainer,
    WebCamContainer,
    RightContainer,
    BottomContainer,
    LeftContainer,
    ChatInput,
    ChatHeader,
    ChatMessages,
    ChatContainer,
    Message,
    SenderName,
    SendButton,
    EmojiButton,
    TextMessage,
} from '../styles/ChatRoomStyles';
import { useSocketServer } from '../hooks/useSocketServer';
const colors = require('../styles/colors');
const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [userSenderId, setUserSenderId] = useState('');
    const [currentUserSet, setCurrentUserSet] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUserData, setNewUserData] = useState(null);
    const [userName, setUserName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);
    const { socket, currentUserData } = useSocketServer();

    const handleMessage = (data) => {
        logger.debug('Received Message', data);
        setUserSenderId(data.sender);
        logger.debug('ID', data.sender);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: data.sender, text: data.text },
        ]);
        // logger.debug("chatContainerRef values:",chatContainerRef.current,chatContainerRef.current.scrollTop,chatContainerRef.current.scrollHeight )
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        // logger.debug("dynamic value for chatContainerRef:",chatContainerRef.current.scrollTop)
    };
    const scrollToBottom = () => {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        // logger.debug("chatContainerRef values from scrollToBottom function:",chatContainerRef.current,chatContainerRef.current.scrollTop,chatContainerRef.current.scrollHeight )
    };
    const handleSendMessage = async () => {
        if (newMessage.trim() !== '' && socket) {
            const username = await getUserName();
            socket.emit('message', { text: newMessage, sender: username });
            setNewMessage('');
            // logger.debug("chatContainerRef values:",chatContainerRef.current,chatContainerRef.current.scrollTop,chatContainerRef.current.scrollHeight )
        }
    };

    const handleEmojiClick = () => {
        logger.debug('emoji menu clicked');
    };

    useEffect(() => {
        if (socket) {
            socket.on('connected', (users) => {
                setUsers(users);
                setCurrentUserSet(true);
                return console.info(
                    'I am connected',
                    currentUserData.current,
                    users,
                );
            });

            socket.on('message', handleMessage);
            scrollToBottom();
            logger.debug('handling message', socket);

            socket.emit('joinRoom', { room: 'chatRoom' });

            // Listen for the 'userJoined' event
            socket.on('userJoined', (data) => {
                logger.debug('new user data:', data);

                setNewUserData(data);
                logger.debug(`User ${data.username} joined the chat room`);

                setUsers((prevUsers) => {
                    if (prevUsers.length === 0) {
                        return data.users;
                    } else {
                        return prevUsers.some(
                            (user) => user.userData.username === data.username,
                        )
                            ? prevUsers
                            : [
                                  ...prevUsers,
                                  { userData: data, socketId: socket.id },
                              ];
                    }
                });
            });

            // Listen for the 'userLeft' event
            socket.on('userLeft', (data) => {
                console.info(`User ${data.username} left the chat room`);
                setUsers((prevUsers) =>
                    prevUsers.filter(
                        (user) => user.userData.username !== data.username,
                    ),
                );
            });
        }
    }, [socket]);
    useEffect(() => {
        const playMessageSound = () => {
            const audioElement = document.getElementById('messageSound');
            audioElement.play();
        };

        // Play sound when a new message is received
        playMessageSound();

        // Clean up function
        return () => {
            // Pause the audio when the component unmounts
            const audioElement = document.getElementById('messageSound');
            if (audioElement) {
                audioElement.pause();
            }
        };
    }, [messages]);
    return (
        <ChatRoomContainer>
            <BottomContainer>
                <UserList users={users} />
            </BottomContainer>
            {socket ? (
                <WebCamContainer>
                    <WebCam socket={socket} newUser={newUserData} />
                </WebCamContainer>
            ) : (
                <></>
            )}

            <ChatContainer ref={chatContainerRef}>
                <ChatHeader>Chat Room</ChatHeader>
                <ChatMessages ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        <Message
                            ref={chatContainerRef}
                            key={index}
                            $issender={(
                                message.sender === socket.id
                            ).toString()}
                        >
                            <SenderName>{message.text.sender}:</SenderName>
                            <TextMessage>{message.text.text}</TextMessage>
                        </Message>
                    ))}
                </ChatMessages>

                <Stack direction='row' spacing={2}>
                    <ChatInput
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        placeholder='Type a message'
                    />
                    <IconButton
                        aria-label='Send'
                        size='large'
                        variant='contained'
                        onClick={handleSendMessage}
                        sx={{
                            'color': 'white',
                            '&:hover': { color: colors.GBLUE_5 },
                        }}
                    >
                        <SendIcon fontSize='large' />
                    </IconButton>
                    <IconButton
                        variant='contained'
                        size='large'
                        onClick={handleEmojiClick}
                        sx={{
                            'color': 'white',
                            '&:hover': { color: colors.GBLUE_5 },
                        }}
                    >
                        <InsertEmoticonOutlinedIcon fontSize='large' />
                    </IconButton>
                </Stack>
            </ChatContainer>
            <audio id='messageSound' src='/assets/message_sent.mp3'></audio>
        </ChatRoomContainer>
    );
};

export default ChatRoom;
