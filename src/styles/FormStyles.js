import styled from 'styled-components';
import { THEME_COLOR, SUCCESS_COLOR, FAILURE_COLOR } from '../config';

const baseColor = THEME_COLOR;

export const FormContainer = styled.div`
  background-color: ${baseColor};
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 400px;
  margin: auto;
  margin-top: 50px;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    background-color: #2c3e50; 
  }
@media (max-width: 768px){
    width:60vw;
    margin-top: 20%;
    margin-bottom:10%;
}
`;
export const SubLink = styled.a`
text-decoration: none;
    &:hover {text-decoration: underline;}
`

export const H1 = styled.h1`
  color: #ecf0f1; `;

export const InputLabelContainer = styled.div`
  margin-bottom: 15px;
@media (max-width: 768px){
    width:60vw;
    margin:2%;
}

`;

export const Label = styled.label`
  color: #ecf0f1;
  display: block;
  margin-bottom: 5px;
@media (max-width: 768px){
    width:60vw;
    margin:auto;
}
`;

export const Input = styled.input`
  width: calc(100% - 22px);
max-width: 90%;
  padding: 10px;
  border: 1px solid #95a5a6; /* Light gray border color */
  border-radius: 6px;
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &:hover {
    background-color: #3498db; /* Lighter blue on hover */
  }

  &:focus {
    border-color: #ecf0f1;
    background-color: #2980b9; /* Darker blue on focus */
  }
@media (max-width: 768px){
    width:60vw;
    margin:auto;
    
}
`;

export const TextArea = styled.textarea`
  width: calc(100% - 22px);
max-width: 90%;
  padding: 10px;
  border: 1px solid #95a5a6;
  border-radius: 6px;
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &:hover {
    background-color: #3498db;
  }

  &:focus {
    border-color: #ecf0f1;
    background-color: #2980b9;
  }
`;

export const FileInputContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  width: 100%;
`;

export const FileInput = styled.input`
  visibility: hidden;
  position: absolute;
`;
export const SubmitForm = styled.div`
  margin-top: 20px;
`;

export const ErrorMessage = styled.span`
  color: ${FAILURE_COLOR};
  margin-top: 5px;
  display: block;
`;

export const SuccessMessage = styled.span`
  color: ${SUCCESS_COLOR};
  margin-top: 5px;
  display: block;
`;
export const BrowseButton = styled.div`
  background-color: ${baseColor};
  color: #ecf0f1;
  padding: 10px 15px;
  border: 1px solid #95a5a6;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3498db; /* Lighter blue on hover */
  }
`;
export const GoogleLoginButton = styled(BrowseButton)`
background-color: rgba(0,0,0,0);
max-width: 90%;
margin-bottom: 10px;
background-image: url('/assets/Googlelogo.svg');
  background-size: 20px; 
background-repeat: no-repeat;
background-position: 17% center; 
padding-left: 5em; 
@media (max-width: 768px){
max-width: 90%;
    min-width:70%;
padding-left: 15%; 
}`
