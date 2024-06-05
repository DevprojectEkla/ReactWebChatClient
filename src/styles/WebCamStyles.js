import styled from "styled-components";
import { make_rgba } from "../styles/colors" 
const colors = require("../styles/colors");


export const RemoteVideo = styled.video`
  width: 100%;
  max-width: 400px; /* Adjust the maximum width as needed */
  max-height: 300px;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease; /* Smooth transition for border color */

  /* Cool effects on hover */
  &:hover {
    border-color:${colors.GBLUE_5} ; 
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.5); /* Add shadow effect on hover */
  }
`;
export const RemoteVideoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
export const LocalVideo = styled.video`
  width: 100%;
  max-width: 200px; /* Adjust the maximum width as needed */
  border: 2px solid ${colors.GBLUE_5};

  border-radius: 8px;
  transition: border-color 0.3s ease; /* Smooth transition for border color */

  /* Cool effects on hover */
  &:hover {
    border-color: ${colors.GBLUE_1}; /* Change border color on hover */
    box-shadow: 0 0 10px ${colors.GBLUE_2_1}; /* Add shadow effect on hover */
  }
`;

