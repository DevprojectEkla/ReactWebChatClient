import styled from "styled-components";
import { THEME_COLOR } from "../config";

export const FooterContainer = styled.footer`
  background-color: ${THEME_COLOR};
  width: 100%;
  max-width: 100vw;
  color: #fff;
  padding: 20px;
  bottom: 0;
  left: 0;
  margin-top: 5%;
  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
      margin-top: 10%;
  }
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: justify;
  width: 100%; 
  max-width: 100vw; 
  margin: 0 ;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }
`;

export const FooterSection = styled.div`
  flex: 1;
  margin-right: 20px;
`;

export const SectionTitle = styled.h4`
  font-size: 1.2rem;
`;

export const SectionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SectionListItem = styled.li`
  margin-bottom: 8px;
`;

export const SectionLink = styled.a`
  text-decoration: none;
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`;

export const FooterBottom = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export const CopyrightText = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

// Add additional styled components as needed
