import styled, { createGlobalStyle } from "styled-components";
import { ASSETS, BACKGROUND } from "config";

const StyledGlobal = createGlobalStyle`body {display: flex;
  flex-direction: column;
  margin: 0;
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
  width: 100vw; 
  min-height: 100vh; 
}`;

export default StyledGlobal;
