import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useHeaderContext } from "../contexts/HeaderContext";
import { useScrollToTopContext } from "../contexts/ScrollToTop";
import { Button } from "./Button";
import {StyledHeader, HeaderContainer} from '../styles/HeaderStyles'


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollPos = useScrollToTopContext();
  const { title: contextTitle } = useHeaderContext();
  const currentPageName = getPageNameFromLocation(location, contextTitle);
  function getPageNameFromLocation(location, contextTitle) {
    if (location.pathname.includes("articles/detail/")) {
      return contextTitle;
    } else {
      const urlPathParts = location.pathname.split("/");
      const label = urlPathParts[urlPathParts.length - 1].toUpperCase();
      return label === "" ? "Accueil".toUpperCase() : label;
    }
  }
  const handleBackButtonClick = () => {
    navigate(-1);
  };
  return (
    <StyledHeader>
        <div>
      <HeaderContainer>
      <div>
      <Button onClick={handleBackButtonClick}>Retour</Button></div>
      <div>
          <Button>
            <Link to={"/articles/create"}> Créer un Article </Link>
          </Button>
      </div>
      <div>
      <Link to={"/"}> <h3>{currentPageName}</h3></Link>
      </div>
      <div>
          <Button>
            <Link to="/login">Login</Link>
          </Button>
      </div>
      </HeaderContainer>
        </div>
    </StyledHeader>
  );
};

export default Header;
