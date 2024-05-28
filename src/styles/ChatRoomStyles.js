import styled from "styled-components";
import { HOVER_EFFECT, THEME_COLOR } from "../config";

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  background-color: rgba(0, 0, 255, 0.2);
  transition: background-color 0.3s ease;
  margin: 10px;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(70, 80, 250, 0.5);
  }

  @media (min-width: 768px) {
    width: 400px;
  }
`;

export const ChatHeader = styled.h2`
  color: #fff;
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

    background-color: rgba(230, 80, 15, 0.2);
    color: white;
    margin-left: auto;
      padding:auto ;
    font-size:auto ;
    width: 40%;
  `
      : `
    align-self: flex-start;
    background-color: #d3ffd3;
    color: green;
    margin-right: auto; /* Pushes the receiver's message to the left */
    padding: 10px; /* Default padding for receiver's message */
    font-size: 16px; /* Default font size for receiver's message */
    width: 50%; /* Adjust the width to make it slightly wider */
  `}

  &:hover {
    background-color: rgba(
      230,
      80,
      15,
      0.5
    ); /* Adjust hover color for sender's message */
  }
`;
export const SenderName = styled.span`
  color: black;
  font-weight: bold;
  margin-right: 8px;
`;

export const ChatInput = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  border: none;
  border-top: 1px solid #ccc;
  ${HOVER_EFFECT};
`;

export const SendButton = styled.button`
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

export const EmojiButton = styled.button`
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
