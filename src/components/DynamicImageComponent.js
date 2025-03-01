import React, { useCallback, useEffect, useState } from "react";
import { ImageContainer, StyledImage } from "../styles/ImageStyles";
import Loader from "./Loader";

export const DynamicImageComponent = ({ src, alt }) => {
  return (
    <ImageContainer>
      <StyledImage src={src} alt={alt} />
    </ImageContainer>
  );
};

export const DynamicItemImageComponent = ({ apiUrl }) => {
    const [srcImg, setSrcImg] = useState(null);
    const [altLabel, setAltLabel] = useState(null);

    const fetchImages = useCallback( async () => {
        const res = await fetch(apiUrl);
        const data = await res.json();
      // this is a trick to convert a base64 encoded string into a blob
      // using the fetch API for local resources 
        const base64Response = await fetch(
        `data:${data.mimeType};base64,${data.content}`
        );
        const blob = await base64Response.blob();
        const dataURL = URL.createObjectURL(blob);
        setSrcImg(dataURL);
        setAltLabel(data.label)
    }
        , [apiUrl])

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);
  
    return (

        <ImageContainer>
            { srcImg ? (
                <StyledImage src={srcImg} alt={altLabel} />
            ) : (
                <Loader label={'Loading Image...'}/> 
            )}
        </ImageContainer>
    );
};
