import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`0%{ transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
export const StyledSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
export const StyledSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db; /* Change color as needed */
  width: 40px;
  height: 40px;
  animation: ${spinAnimation} 1s linear infinite;
`;
