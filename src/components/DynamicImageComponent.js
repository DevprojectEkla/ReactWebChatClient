import React, { useEffect, useState } from "react";
import { ImageContainer, StyledImage } from "../styles/ImageStyles";
import { ClipLoader } from "react-spinners";
import { apiBaseUrl, THEME_COLOR } from "../config";
import { logger } from "../utils/logger";

export const DynamicImageComponent = ({ src, alt }) => {
  return (
    <ImageContainer>
      <StyledImage src={src} alt={alt} />
    </ImageContainer>
  );
};

export const DynamicArticleImageComponent = ({ article }) => {
  const [srcImg, setSrcImg] = useState([]);
  const fetchImages = async (article) => {
    // article is an object containing the image data
    const id = await article._id;
    // console.warn("ID of the article", id);
    const res = await fetch(apiBaseUrl + "api/articleImage/" + id);
    const data = await res.json();
    const base64Response = await fetch(
      `data:${data.file.mimeType};base64,${data.file.content}`
    );
    const blob = await base64Response.blob();
    logger.debug(JSON.stringify(blob));
    // Create a data URL for the Blob
    const dataURL = URL.createObjectURL(blob);
    article.imageSrc = dataURL;
    setSrcImg(dataURL);
  };
  useEffect(() => {
    if (article) {
      fetchImages(article);
    }
  }, [article]);
  return (
    <ImageContainer>
      {article && article.imageSrc ? (
        <StyledImage src={article.imageSrc} alt={article.title} />
      ) : (
        <div>
          Loading Image...
          <ClipLoader color={THEME_COLOR} />
        </div>
      )}
    </ImageContainer>
  );
};
