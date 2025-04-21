import io from 'socket.io-client';
import { apiBaseUrl, isDevelopment } from '../config';
import { getCookie } from '../utils/cookieUtils';
import { useEffect, useRef, useState } from 'react';
import { logger } from '../utils/logger';
export const useSocketServer = () => {
    const currentUserData = useRef('');
    const [socket, setSocket] = useState(null);
    const createIoDevClient = (userData) =>
        io(apiBaseUrl, {
            withCredentials: true,
            query: { userData: JSON.stringify(userData) },
        });
    const createIoProdClient = (userData) =>
        io(apiBaseUrl, { query: { userData: JSON.stringify(userData) } });
    useEffect(() => {
        const initializeSocket = async () => {
            const cookieData = await getCookie('session_data');
            // logger.debug(cookieData)

            // Initialize the socket
            if (socket === null) {
                const userData = cookieData;
                logger.debug('user data from cookie for socket io', userData);

                const socketInstance = isDevelopment
                    ? createIoDevClient(userData)
                    : createIoProdClient(userData);
                setSocket(socketInstance);
                currentUserData.current = userData;

                // logger.debug("socket created", socket);
            }
        };
        initializeSocket();

        // Cleanup when the component unmounts
        return () => {
            if (socket) {
                logger.debug('socket disconnection', socket);
                socket.disconnect();
            }
        };

        // Empty dependency array means this effect will run once when the component mounts
    }, [socket]);

    return { socket, currentUserData };
};
