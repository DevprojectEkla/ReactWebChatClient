import styled from 'styled-components';
import { THEME_COLOR, SUCCESS_COLOR, FAILURE_COLOR } from '../config';
import { CustomButton } from './Button';
import { useCallback } from 'react';

const StyledPopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${THEME_COLOR};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const StyledPopupButton = styled(CustomButton)`
    transition: background-color 0.8s ease;
    margin-top: 2em;

    &:hover {
        background-color: ${({ hoverColor }) => hoverColor || '#2ecc71'};
    }
`;

const StyledPopup = styled.div`
    background: ${({ type }) =>
        type === 'failure' ? FAILURE_COLOR : SUCCESS_COLOR};
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    padding: 2rem;
`;

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
`;

const StyledSpan = styled.span`
    position: absolute;
    top: 0;
    right: 0.3em;
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
`;

const PopUp = ({
    isOpen,
    onClose,
    message,
    type,
    hoverColor,
    choice = false,
    setConfirm,
}) => {
    const handleConfirm = useCallback(() => {
        setConfirm(true);
        onClose();
    }, [setConfirm, onClose]);
    return (
        <StyledPopupOverlay>
            <StyledPopup type={type}>
                {' '}
                <StyledSpan onClick={onClose}>&times;</StyledSpan>
                {message}
                {choice ? (
                    <StyledButtonContainer>
                        <StyledPopupButton
                            onClick={handleConfirm}
                            hoverColor={hoverColor}
                            children='Oui'
                        />
                        <StyledPopupButton
                            onClick={onClose}
                            hoverColor={hoverColor}
                            children='Non'
                        />
                    </StyledButtonContainer>
                ) : (
                    <StyledPopupButton
                        onClick={onClose}
                        hoverColor={hoverColor}
                        children='Ok'
                    />
                )}
            </StyledPopup>
        </StyledPopupOverlay>
    );
};

export default PopUp;
