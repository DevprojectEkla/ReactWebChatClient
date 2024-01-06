import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterSection,
  SectionTitle,
  SectionList,
  SectionListItem,
  SectionLink,
  FooterBottom,
  CopyrightText,
} from '../styles/FooterStyles'; // Adjust the path as needed

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>À propos:</SectionTitle>
          <p>
           Ekla Development est une entreprise de developpement web full-stack pour des projets sur mesure, utilisant les meilleurs technologies du Web selon vos besoins.  
          </p>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Liens</SectionTitle>
          <SectionList>
            <SectionListItem>
              <SectionLink href="#home">Accueil</SectionLink>
            </SectionListItem>
            <SectionListItem>
              <SectionLink href="#portfolio">Portfolio</SectionLink>
            </SectionListItem>
            <SectionListItem>
              <SectionLink href="#contact">Contact</SectionLink>
            </SectionListItem>
          </SectionList>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Contactez-Moi</SectionTitle>
          <p>Email: EklaDev@gmail.com</p>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <CopyrightText>&copy; 2024 Ekla Development. All rights reserved.</CopyrightText>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;

