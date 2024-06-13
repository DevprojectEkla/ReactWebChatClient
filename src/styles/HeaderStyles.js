import styled from "styled-components";
import { THEME_COLOR } from "../config";

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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
@media (max-width: 768px){
    display:flex;
    flex-direction:column;
    flex:1
    margin-bottom:10%;
}
`;

export const Navbar = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const NavItem = styled.div`
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CustomBackButton = styled.button`
  background-color: ${baseColor};
  color: #ecf0f1;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: #fff;
    border-color: #2980b9;
  }
`;
export const CustomButton = styled.button`
  background-color: ${baseColor};
  color: #ecf0f1;
  padding: 10px 20px;
  border: 2px solid #95a5a6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: #fff;
    border-color: #2980b9;
  }
`;

export const MedallionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  border-radius: 50%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
@media (max-width: 768px) {
    flex-direction:column;
}
`;

export const MedallionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
export const ArrowIcon = styled.div`
  position: absolute;
  width: 1;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid aliceblue;

  cursor: pointer;
  opacity: 0.2;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;
export const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;
export const MenuContainer = styled.div`
  position: absolute;
  top: 60px; /* Adjust this value based on the header height */
  right: 10px;
  width: 150px;
  background-color: ${baseColor};
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-y: auto;
  max-height: 200px;
&::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 12px;
    border-width: 0 5px 5px;
    border-style: solid;
    border-color: transparent transparent #ccc;
`;

export const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${baseColor};
  }
`;

// TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

// Additional styles as needed
