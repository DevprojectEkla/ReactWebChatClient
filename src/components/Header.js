import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { emphasize, styled } from '@mui/material/styles';

import { useHeaderContext } from '../contexts/HeaderContext';
import { useScrollToTopContext } from '../contexts/ScrollToTop';
import { setSrcImg } from '../utils/helpers';
import { logger } from '../utils/logger';
import {
    createCookie,
    generateDefaultSessionData,
    getCookie,
} from '../utils/cookieUtils';
import {
    AVATAR_CACHE_KEY,
    THEME_COLOR,
    apiBaseUrl,
    isDevelopment,
} from '../config';
import {
    ProfileContainer,
    MenuItem,
    MenuContainer,
    ArrowIcon,
    MedallionImage,
    MedallionContainer,
    CustomButton,
    StyledHeader,
    HeaderContainer,
    Navbar,
    NavItem,
} from '../styles/HeaderStyles';
import { MyButton } from './Button';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = THEME_COLOR;
    //   theme.palette.mode === 'light'
    //     ? theme.palette.grey[100]
    //     : theme.palette.grey[800];
    return {
        backgroundColor,
        'height': theme.spacing(3),
        'color': 'white',
        'cursor': 'pointer',
        'fontWeight': theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.16),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const BackButton = ({ handleBackClick }) => (
    <Button
        variant='text'
        onClick={handleBackClick}
        fontSize='large'
        startIcon={<ArrowBackIosIcon style={{ color: 'white' }} />}
    ></Button>
);
const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState({});
    const [avatar, setAvatar] = useState('');
    const [isMenuVisible, setMenuVisible] = useState();
    const menuRef = useRef(null);

    const scrollPos = useScrollToTopContext();
    const { title: contextTitle } = useHeaderContext();
    const currentPageName = getPageNameFromLocation(location, contextTitle);

    const handleItemClick = (itemName) => {
        alert(`Selected option: ${itemName}`);
    };
    useEffect(() => {
        // Function to handle clicks outside the menu container
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        // Attach event listener when menu is visible
        if (isMenuVisible) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        // Remove event listener when menu is hidden
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isMenuVisible]);

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    function getPageNameFromLocation(location, contextTitle) {
        if (location.pathname.includes('articles/detail/')) {
            return contextTitle;
        } else {
            const urlPathParts = location.pathname.split('/');
            const label = urlPathParts[urlPathParts.length - 1];
            return label === '' ? 'Accueil' : label;
        }
    }
    const handleBackButtonClick = () => {
        navigate(-1);
    };

    const fetchAvatar = async (userData) => {
        const sessionData = await getCookie('session_data');
        logger.debug(sessionData);
        const avatarHash = sessionData.avatar.name;
        try {
            const cachedAvatar = sessionStorage.getItem(
                `${AVATAR_CACHE_KEY}_${avatarHash}`,
            );
            if (cachedAvatar && cachedAvatar.size > 0) {
                console.debug('Using cached avatar');

                setAvatar(cachedAvatar);
                return;
            }
        } catch (error) {
            console.error('Cannot use cached data for user avatar', error);
        }

        try {
            const response = await fetch(
                apiBaseUrl + `/api/avatars/${avatarHash}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Cookie': `session_data=${userData}`,
                    },
                    credentials: isDevelopment ? 'include' : 'same-origin', //this is cors related and is key to include cookies in request from different client servers (if the client is hosted on a different server than the backend), if the app uses a frontend and a backend server separately like in development of a react app
                },
            );

            // logger.debug("avatar : ", response);
            const data = await response.json();
            // logger.debug("data avatar:", data);
            const urlImg = setSrcImg(data.data);
            sessionStorage.setItem(`${AVATAR_CACHE_KEY}_${avatarHash}`, urlImg);

            setAvatar(urlImg);
        } catch (error) {
            console.error('Error fetching avatar:', error);
        }
    };
    const logout = async () => {
        const sessionData = await getCookie('session_data');
        await fetch(apiBaseUrl + '/api/logout', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Cookie': `session_data=${sessionData}`,
            },
        });
        setUserData({});
    };
    const getUserData = useCallback(async () => {
        try {
            let userData = await getCookie('session_data');
            if (!userData) {
                createCookie('session_data', generateDefaultSessionData(), 0.1);
                userData = await getCookie('session_data');
            }
            setUserData(userData);
            await fetchAvatar(userData);
        } catch (err) {
            logger.debug(
                'No Session Cookie available. Please try to login to get better user experience',
            );
            setUserData(null);
        }
    }, []);
    // const handleStorageChange = (event) => {
    //   if (event.key === "session_data") {
    //     GetUserName();
    //   }
    // };
    useEffect(() => {
        getUserData();
    }, [getUserData, location.pathname, userData.username]);

    const checkForSessionCookie = () => {
        const cookie = document.cookie;
        logger.debug('Session Cookie retrieved:', decodeURIComponent(cookie));
        if (cookie) {
            return true;
        } else {
            return false;
        }
    };
    return (
        <StyledHeader>
            <HeaderContainer>
                <Navbar>
                    <NavItem>
                        <BackButton handleBackClick={handleBackButtonClick} />
                    </NavItem>
                    <NavItem>
                        {userData?.admin ? (
                            <CustomButton>
                                <Link to={'/articles/create'}>
                                    {' '}
                                    Créer un Article{' '}
                                </Link>
                            </CustomButton>
                        ) : null}{' '}
                    </NavItem>
                    <Breadcrumbs aria-label='breadcrumb'>
                        <StyledBreadcrumb
                            component={Link}
                            to={'/'}
                            label='Accueil'
                            icon={<HomeIcon color='white' fontSize='small' />}
                        />
                        {currentPageName !== 'Accueil' && (
                            <StyledBreadcrumb
                                component='a'
                                href='#'
                                label={currentPageName}
                            />
                        )}
                        {/* <StyledBreadcrumb */}
                        {/*     label='Accessories' */}
                        {/*     deleteIcon={<ExpandMore />} */}
                        {/*     onDelete={handleClick} */}
                        {/* /> */}
                    </Breadcrumbs>

                    <NavItem></NavItem>
                </Navbar>
                <Navbar>
                    <NavItem>
                        {!userData ||
                        (userData?.username &&
                            userData.username
                                .toLowerCase()
                                .startsWith('anonymous')) ? (
                            <>
                                <MedallionContainer size={40}>
                                    <MedallionImage
                                        src={avatar}
                                        alt='Avatar Utilisateur'
                                    />
                                </MedallionContainer>

                                <label>{userData?.username}</label>

                                <MyButton
                                    label={<Link to='/login'>Login</Link>}
                                />
                            </>
                        ) : (
                            <>
                                {userData.username && (
                                    <>
                                        {userData.avatar && (
                                            <MedallionContainer size={50}>
                                                {isMenuVisible && (
                                                    <MenuContainer
                                                        ref={menuRef}
                                                    >
                                                        <MenuItem
                                                            onClick={() =>
                                                                handleItemClick(
                                                                    'Paramètre du compte',
                                                                )
                                                            }
                                                        >
                                                            Paramètre du compte
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() =>
                                                                handleItemClick(
                                                                    'Configuration',
                                                                )
                                                            }
                                                        >
                                                            Configuration
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={logout}
                                                        >
                                                            {' '}
                                                            <Link to='/'>
                                                                Logout
                                                            </Link>
                                                        </MenuItem>
                                                    </MenuContainer>
                                                )}

                                                <MedallionImage
                                                    src={avatar}
                                                    alt='Avatar Utilisateur'
                                                />
                                            </MedallionContainer>
                                        )}
                                        <ProfileContainer>
                                            <label>{userData.username}</label>

                                            <ArrowIcon onClick={toggleMenu} />
                                        </ProfileContainer>
                                    </>
                                )}
                            </>
                        )}
                    </NavItem>
                </Navbar>
            </HeaderContainer>
        </StyledHeader>
    );
};
export default Header;
