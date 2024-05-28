import styled from "styled-components";
import { HOVER_EFFECT, THEME_COLOR } from "../config"
export const LeftContainer = styled.div`
  margin-right: 20px;
`;

export const WebCamContainer = styled.div`
  display: flex;
  flex-align: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
export const ChatRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
export const ChatContainer = styled.div`
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  background-color: rgba(0, 0, 255, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(70, 80, 250, 0.5);
  }
`;

export const ChatHeader = styled.h2`
  color: #fff;
  padding: 5px;
  text-align: center;
`;

export const ChatMessages = styled.div`
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const Message = styled.div`
  color: white;
  margin-bottom: 8px;
  padding: 8px;
  background-color: rgb(100, 180, 255, 0.4);
  border-radius: 4px;
  transition: background-color 0.3s ease;
  word-wrap: break-word;

  ${(props) =>
    props.$issender === "true"
      ? `
    margin-left:65%;
    width:120px;
        background-color: rgb(230,80,15,.2);
        text-align: right;
        color: white;
      `
      : `
        width:120px;
        background-color: #d3ffd3;
        text-align: left;
        color: green;
      `}

  &:hover {
    background-color: rgb(230, 80, 15, 0.5);
  }
`;

export const SenderName = styled.span`
  color: black;
  font-weight: bold;
  margin-right: 8px;
`;

export const ChatInput = styled.input`
  width: 90%;
  padding: 10px;
  border: none;
  border-top: 1px solid #ccc;
  background-color: ;
  ${HOVER_EFFECT};
`;

export const SendButton = styled.button`
background: url(/assets/send.png) no-repeat center center;
background-size: 50%;
border: 2px, solid, #95a5a6;
  border-radius: 4px;
height: 40px;
  width: 60px;
  padding: 10px;
  color: white;
  cursor: pointer;
vertical-align:middle;
${HOVER_EFFECT}  }

`;

export const EmojiButton = styled.button`
  border-radius: 4px;
  border: 2px, solid, #95a5a6;
  height: 40px;
  width: 60px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0);
  color: white;
  vertical-align: middle;
  cursor: pointer;
  ${HOVER_EFFECT}
`;

