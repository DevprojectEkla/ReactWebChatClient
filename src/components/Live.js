import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { apiBaseUrl } from '../config';
import { useSocketServer } from '../hooks/useSocketServer';
import { RemoteVideo } from '../styles/WebCamStyles';

const WebcamStream = () => {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [turnConf, setTurnConf] = useState(null);

    const { socket, currentUserData } = useSocketServer();

    const getTurnConfig = useCallback(async () => {
        const response = await fetch(`${apiBaseUrl}/api/getTurnConfig`);
        const data = await response.json();
        setTurnConf(data);
        return data;
    }, []);

    const setupPeerConnection = useCallback(() => {
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
                console.log(
                    'log senders',
                    peerConnectionRef.current.getSenders().map((s) => s),
                );
                peerConnectionRef.current.ontrack = (event) => {
                    console.log(
                        'Track received via addEventListener:',
                        event.track,
                    );
                    videoRef.current.srcObject = new MediaStream([event.track]);
                };
            }
        }
    }, [turnConf]);

    const setupSocketListeners = useCallback(() => {
        socketRef.current = socket;
        if (socketRef.current) {
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
    }, [socket]);

    useEffect(
        () => {
            // Initialize socket connection
            if (turnConf === null) {
                getTurnConfig();
            }

            if (turnConf) {
                setupPeerConnection(); // Setup WebRTC peer connection
                setupSocketListeners(); // Setup socket event listeners
            }
            // Cleanup on component unmount
            return () => {
                // Clean up the peer connection and socket on component unmount
                if (peerConnectionRef.current) {
                    peerConnectionRef.current.close();
                }
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }, // eslint-disable-next-line
        [turnConf],
    );

    return (
        <div>
            <h2>Webcam Stream</h2>
            <RemoteVideo ref={videoRef} autoPlay playsInline />
        </div>
    );
};

export default WebcamStream;
