import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { apiBaseUrl } from '../config';

const WebcamStream = () => {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const peerConnectionRef = useRef(null);

    const turnConf = useMemo(async () => {
        const response = await fetch(`${apiBaseUrl}/api/getTurnConfig`);
        const data =  await response.json();
    console.log(data);
        return data;
    }, []);
    
    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(apiBaseUrl);

        // WebRTC configuration
        const configuration = {
            iceServers: [{ urls: turnConf.urls }],
        };

        peerConnectionRef.current = new RTCPeerConnection(configuration);

        peerConnectionRef.current.ontrack = (event) => {
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('server-ice-candidate', event.candidate);
            }
        };

        // Handle offer/answer exchange
        socketRef.current.on('connect', async () => {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socketRef.current.emit('server-offer', offer);
        });

        socketRef.current.on('rtc-server-answer', async (answer) => {
            await peerConnectionRef.current.setRemoteDescription(answer);
        });

        socketRef.current.on('server-ice-candidate', async (candidate) => {
            try {
                await peerConnectionRef.current.addIceCandidate(candidate);
            } catch (err) {
                console.error('ICE candidate error:', err);
            }
        });

        // Cleanup on component unmount
        return () => {
            peerConnectionRef.current.close();
            socketRef.current.disconnect();
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
