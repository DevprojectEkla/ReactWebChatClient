import  { styled, createGlobalStyle } from "styled-components";
import { ASSETS, BACKGROUND } from "../config";

const StyledGlobal = createGlobalStyle`body {
    display: flex;
  flex-direction: column;
  margin: 0;
    padding-top: 10%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: url(${BACKGROUND}); 
  background-size: cover; /* Cover the entire viewport */
  background-attachment: fixed; 
    background-position: center;
  background-repeat: no-repeat; 
  width: 100%; 
  max-width: 100vw; 
  min-height: 100vh; 
    @media (max-height:768px){
        padding-top: 15vh;
        flex-direction:row;


    }@media (max-width:768px){
        padding-top: 15vh;
        flex-direction:row;


    }
}`;

export const StyledDiv = styled.div`
    padding-top: 10vh
  flex-direction: column;
  align-items: center;
  justify-content: center;
    width: 100%; 
  max-width: 100vw; 
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
`;
export const StyledBodyContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    width: 100%; 
  max-width: 100vw; 
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
`;
export const MainButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: space-around;
  }
`;


export const TextContainer = styled.div`

    display: flex;
    flex-direction: row;
    flex: 1;
    color: black;
    text-align: justify;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px; 
    margin: 20px; 
    border-radius: 10px; 
  `;

export default StyledGlobal;
