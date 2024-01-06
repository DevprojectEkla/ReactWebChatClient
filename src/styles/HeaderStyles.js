import styled from 'styled-components'
import {THEME_COLOR} from 'config';

export const StyledHeader = styled.header`
  background-color: ${THEME_COLOR};
  color: #fff;
  text-align: center;
  padding: 10px;
  position: absolute;
  top: 0;
  width: 100%;
`;
export const HeaderContainer = styled.div`
display: flex;
justify-content: space-between;
`;

