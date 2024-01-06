import React from 'react';
import { ImageContainer, StyledImage } from '../styles/ImageStyles';

// Use the styled components in your React component
const DynamicImageComponent = ({ src, alt }) => {
  return (
    <ImageContainer>
      <StyledImage src={src} alt={alt} />
    </ImageContainer>
  );
};

export default DynamicImageComponent;
