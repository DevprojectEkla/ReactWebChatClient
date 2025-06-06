import { Link } from "react-router-dom";
import { MyButton, clickCallBack } from "./Button";
import { useScrollToTopContext } from "../contexts/ScrollToTop";
import {H1,H2, TextContainer, StyledBodyContainer, MainButtonContainer, StyledDiv } from "../styles/BodyStyles";
import { APP_TITLE, SUB_TITLE } from "../config";
import SEO from "./SEO";

const Body = () => {
  const scrollerPosition = useScrollToTopContext();
  return (
    <StyledBodyContainer>
      <SEO />
      <StyledDiv>
      <h1>{APP_TITLE}</h1>
      <h2>{SUB_TITLE}</h2>
      </StyledDiv>
      <MainButtonContainer>
        <MyButton label={<Link to="/articles">News</Link>}/>
        <MyButton label={<Link to="/bevy">Bevy Wasm</Link>}/>
        <MyButton label={<Link to="/chatRoom">Chat</Link>}/>
        <MyButton label={<Link to="/live">Live</Link>}/>
        <MyButton label={<Link to="/Contact">Contact Me</Link>}/>
      </MainButtonContainer>
      <TextContainer>
        <h3>Ce site est en construction</h3>
      </TextContainer>
    </StyledBodyContainer>
  );
};

export default Body;
