import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiBaseUrl,isDevelopment } from "config";
import { styled } from "styled-components";
import { useHeaderContext } from "../contexts/HeaderContext";
import { useScrollToTopContext } from "../contexts/ScrollToTop";
import { setSrcImg } from "../utils";
import { Button } from "./Button";
import {
  MedallionImage,
  MedallionContainer,
  CustomButton,
  StyledHeader,
  HeaderContainer,
  Navbar,
  NavItem,
  NavLink,
} from "../styles/HeaderStyles";
import {
  createCookie,
  generateDefaultSessionData,
  getCookie,
  getUserName,
} from "../utils/cookieUtils";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState("");
  const scrollPos = useScrollToTopContext();
  const { title: contextTitle } = useHeaderContext();
  const currentPageName = getPageNameFromLocation(location, contextTitle);
  function getPageNameFromLocation(location, contextTitle) {
    if (location.pathname.includes("articles/detail/")) {
      return contextTitle;
    } else {
      const urlPathParts = location.pathname.split("/");
      const label = urlPathParts[urlPathParts.length - 1];
      return label === "" ? "Accueil" : label;
    }
  }
  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const fetchAvatar = async (userData) => {


    const sessionData = await getCookie("session_data");
      console.log(sessionData)
        const avatarHash = sessionData.avatar.name;
 const response = await fetch(apiBaseUrl + `/api/avatars/${avatarHash}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Cookie: `session_data=${userData}`,
      },
     credentials: isDevelopment?'include':'same-origin'//this is cors related and is key to include cookies in request from different client servers (if the client is hosted on a different server than the backend), if the app uses a frontend and a backend server separately like in development of a react app
    });

    // console.log("avatar : ", response);
    const data = await response.json();
    // console.log("data avatar:", data);
    const urlImg = setSrcImg(data.data);
    setAvatar(urlImg);


    
        };
  const logout = async () => {
    const sessionData = await getCookie("session_data");
    const response = await fetch(apiBaseUrl + "/api/logout", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Cookie: `session_data=${sessionData}`,
      },
    });
    setUserData({});
  };
  // const handleStorageChange = (event) => {
  //   if (event.key === "session_data") {
  //     GetUserName();
  //   }
  // };
    useEffect(() => {
    const GetUserData = async () => {
    try {
      let userData = await getCookie("session_data");
      if (!userData) {
        createCookie("session_data", generateDefaultSessionData(), 0.1);
        userData = await getCookie("session_data");
      }
      setUserData(userData);
      await fetchAvatar(userData);
    } catch (err) {
      console.log(
        "No Session Cookie available. Please try to login to get better user experience"
      );
      setUserData(null);
    }
  };

    GetUserData();
  }, [location.pathname,userData.username]);
  const displayLogout = () => {
      if(userData){
    if (userData.username) {
      if (!userData.username.toLowerCase().startsWith("anonymous")) {
        return true;
      }

    }
    } else {
      return false;
    
  }}
  const checkForSessionCookie = () => {
    const cookie = document.cookie;
    console.log("Session Cookie retrieved:", decodeURIComponent(cookie));
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
            <CustomButton onClick={handleBackButtonClick}>Retour</CustomButton>
          </NavItem>
          <NavItem>
            <CustomButton>
              <Link to={"/articles/create"}> Créer un Article </Link>
            </CustomButton>
          </NavItem>
          <NavItem>
            <Link to={"/"}>
              {" "}
              <h3>{currentPageName}</h3>
            </Link>
          </NavItem>
        </Navbar>
        <Navbar>
          <NavItem>
            

{!userData || (userData?.username && userData.username.toLowerCase().startsWith('anonymous')) ? (
    <>
    <MedallionContainer size={50}>
            <MedallionImage src={avatar} alt="Avatar Utilisateur" />
          </MedallionContainer>
        
        <label>{userData?.username}</label>

  <CustomButton>
    <Link to="/login">Login</Link>
    </CustomButton></>
) : (
  <>
    {userData.username && (
      <>
        {userData.avatar && (
          <MedallionContainer size={50}>
            <MedallionImage src={avatar} alt="Avatar Utilisateur" />
          </MedallionContainer>
        )}
        <label>{userData.username}</label>
      </>
    )}
    <CustomButton onClick={logout}>
      <Link to="/">Logout</Link>
    </CustomButton>
  </>
)}


          </NavItem>
        </Navbar>
      </HeaderContainer>
    </StyledHeader>
  );
};
export default Header;
