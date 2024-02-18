
import styled from 'styled-components';
import { THEME_COLOR } from 'config';

const baseColor = THEME_COLOR;

export const StyledHeader = styled.header`
  background-color: ${baseColor};
  padding: 10px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
`;

export const NavItem = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

export const CustomButton = styled.button`
  background-color: ${baseColor};
  color: #ecf0f1;
  padding: 10px 20px;
  border: 2px solid #95a5a6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: #fff;
    border-color: #2980b9;
  }
`;


export const MedallionContainer = styled.div`
  width: ${props => `${props.size}px`};
  height: ${props => `${props.size}px`};
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MedallionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Additional styles as needed

