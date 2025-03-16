import styled from 'styled-components';
import { THEME_COLOR } from '../config';

export const CustomButton = styled.button.attrs({ type: 'button' })`
    background-color: ${THEME_COLOR};
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;

    transition:
        background-color 0.3s ease,
        color 0.4s ease;

    &:hover {
        background-color: ${({ deleteitem }) =>
            deleteitem === 'true' ? '#d9534f' : 'rgba(70, 130, 180, 1)'};
    }
`;
