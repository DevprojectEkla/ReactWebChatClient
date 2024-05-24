import styled from 'styled-components'
import {THEME_COLOR,SUCCESS_COLOR, FAILURE_COLOR} from '../config'
import {CustomButton} from './Button'

const StyledPopupOverlay = styled.div`position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${THEME_COLOR};
  display: flex;
    flex-direction: column;
  justify-content: center;
  align-items: center;`;
const StyledPopupButton = styled(CustomButton)`transition: background-color .8s ease; 

  &:hover {
      background-color: ${({ hoverColor} ) => hoverColor || '#2ecc71'};}`;

const StyledPopup = styled.div`background: ${({ type }) => ( type === 'failure'? FAILURE_COLOR: SUCCESS_COLOR ) } ;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;`

const StyledSpan = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;`



const PopUp = ({isOpen, onClose,message, type, hoverColor}) => {
    return (
            <StyledPopupOverlay>
        <StyledPopup type={type}> {message}<StyledSpan onClick={onClose}>
            &times;
          </StyledSpan>
        <StyledPopupButton onClick={onClose} hoverColor={hoverColor} children="Ok"/>
        </StyledPopup>
        </StyledPopupOverlay>
    )
}

export default PopUp
