import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { apiBaseUrl } from '../config';
import { useSocketServer } from '../hooks/useSocketServer';

const WebcamStream = () => {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [turnConf, setTurnConf] = useState(null);

    const getTurnConfig = useCallback(async () => {
        const response = await fetch(`${apiBaseUrl}/api/getTurnConfig`);
        const data = await response.json();
        setTurnConf(data);
        return data;
    }, []);

    const { socket, currentUserData } = useSocketServer();
    useEffect(() => {
        // Initialize socket connection
        if (turnConf === null) {
            getTurnConfig();
        }
        socketRef.current = socket;
        // WebRTC configuration
        if (turnConf) {
            const configuration = {
                iceServers: [
                    { urls: turnConf.urls.stun },
                    {
                        urls: turnConf.urls.turn_ssl,
                        username: 'test',
                        credential: '123456',
                    },

                    {
                        urls: turnConf.urls.turn,
                        username: 'test',
                        credential: '123456',
                    },
                ],
            };
            if (!peerConnectionRef.current) {
                peerConnectionRef.current = new RTCPeerConnection(
                    configuration,
                );
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.oniceconnectionstatechange = () => {
                    console.log(
                        'ICE Connection State:',
                        peerConnectionRef.current.iceConnectionState,
                    );
                };
                console.log('hello pc', peerConnectionRef.current);
                peerConnectionRef.current.ontrack = (event) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = event.streams[0];
                    }
                };
            }

            socketRef.current.on('server-offer', async (offer) => {
                console.log('received offer', offer);

                try {
                    await peerConnectionRef.current.setRemoteDescription(
                        new RTCSessionDescription(offer),
                    );
                    const answer =
                        await peerConnectionRef.current.createAnswer();
                    socket.emit('rtc-client-answer', answer);
                    await peerConnectionRef.current.setLocalDescription(
                        new RTCSessionDescription(answer),
                    );
                } catch (err) {
                    console.log(peerConnectionRef.current.connectionState);
                }
                console.log(
                    'creating remote sdp with answer',
                    offer,
                    peerConnectionRef.current,
                );
            });

            socketRef.current.on('rtc-server-answer', async (answer) => {
                console.log('received offer', answer);
                if (
                    peerConnectionRef.current.connectionState !== 'stable' &&
                    peerConnectionRef.current.signalingState !== 'stable'
                ) {
                    try {
                        await peerConnectionRef.current.setRemoteDescription(
                            new RTCSessionDescription(answer),
                        );
                        socketRef.current.emit('rtc-server-answer', answer);
                        console.log(
                            'creating remote sdp with answer',
                            answer,
                            peerConnectionRef.current,
                        );
                    } catch (err) {
                        console.log(peerConnectionRef.current.connectionState);
                    }
                }
            });

            socketRef.current.on('server-ice-candidate', async (candidate) => {
                console.log('ICE CANDIDATE', candidate);
                try {
                    await peerConnectionRef.current.addIceCandidate(candidate);
                } catch (err) {
                    console.error('ICE candidate error:', err);
                }
            });
        }
        return () => {
            peerConnectionRef.current?.close();
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Webcam Stream</h2>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                controls
                style={{ width: '100%', maxWidth: '600px' }}
            />
        </div>
    );
};

export default WebcamStream;
