import styled from "styled-components";
import Button from "@mui/material/Button";
import { HOVER_EFFECT, THEME_COLOR } from "../config";
import { make_rgba } from "./colors" 
const colors = require("./colors");

export const ChatRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

export const WebCamContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

export const LeftContainer = styled.div`
  margin: 10px;
  @media (min-width: 768px) {
    margin-right: 20px;
  }
`;

export const RightContainer = styled.div`
  margin: 10px;
  @media (min-width: 768px) {
    margin-left: 20px;
  }
`;

export const ChatContainer = styled.div`
  width: 90%;
  border: 1px solid ${colors.GBLUE_2_1};
  border-radius: 8px;
  overflow-y: auto;
  background-color: ${make_rgba(colors.GBLUE_1_2,".6")};
  transition: background-color 0.3s ease;
  margin: 10px;
  flex-shrink: 0;

  &:hover {
      color:${colors.GBLUE_4};
      border: 2px solid ${make_rgba(colors.GBLUE_1_3,".8")};
    background-color:  ${make_rgba(colors.GBLUE_0,".8")} ;
  }

  @media (min-width: 768px) {
    width: 400px;
  }
`;

export const ChatHeader = styled.h2`
  color: inherit;
  padding: 5px;
  text-align: center;
`;

export const ChatMessages = styled.div`
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
  scroll-behavior: smooth;

  @media (min-width: 768px) {
    max-height: 300px;
  }
`;
export const TextMessage = styled.span`
  margin-top: 5px; /* Adjust margin as needed */
`;
export const Message = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  word-wrap: break-word;
  max-width: 75%;

  ${(props) =>
    props.$issender === "true"
      ? `
      
    align-self: flex-end;
      color:rgba(230, 240, 255, 1);
    background-color: rgba(230, 240, 255, 0.2);
    margin-left: 20%;
      padding:auto ;
    font-size:auto ;
    width: auto;
  `
      : `
    align-self: flex-start;
    background-color: rgba(210,220,250,.7);
    color: rgba(0,0,55,.9);
    margin-right: auto; /* Pushes the receiver's message to the left */
    padding: 10px; /* Default padding for receiver's message */
    font-size: 16px; /* Default font size for receiver's message */
    width: auto; /* Adjust the width to make it slightly wider */
  `}

  &:hover {
    background-color: rgba(
      210,
      230,
      255,
      0.5
    ); /* Adjust hover color for sender's message */
  }
`;
export const SenderName = styled.span`
  color: rgb(0,15,40);
  font-weight: bold;
  margin-right: 8px;

`;

export const ChatInput = styled.input`
  background-color: ${make_rgba( colors.GBLUE_2,".4")};
color:white;
  width: auto;
  padding: 10px;
  border: none;
  border-top: 1px solid #ccc;
  ${HOVER_EFFECT("rgba(255,255,250,.9)","black")};
::placeholder {
    color:white;
}
`;

export const SendButton = styled.div`
  background: url(/assets/send.png) no-repeat center center;
  background-size: 50%;
  border: 2px solid #95a5a6;
  border-radius: 4px;
  height: 40px;
  width: 60px;
  padding: 10px;
  color: white;
  cursor: pointer;
  vertical-align: middle;
  ${HOVER_EFFECT};
`;

export const EmojiButton = styled(Button)`
  border-radius: 4px;
  border: 2px solid #95a5a6;
  height: 40px;
  width: 60px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  vertical-align: middle;
  cursor: pointer;
  ${HOVER_EFFECT};
`;
