import React, { useEffect, useState } from "react";
import { ImageContainer, StyledImage } from "../styles/ImageStyles";
import { ClipLoader } from "react-spinners";
import { apiBaseUrl, THEME_COLOR } from "../config";
import { logger } from "../utils/logger";

// Use the styled components in your React component
const DynamicImageComponent = ({ article }) => {
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
    // logger.debug(blob);
    // Create a data URL for the Blob
    const dataURL = URL.createObjectURL(blob);
    setSrcImg(dataURL);
  };
  useEffect(() => {
    if (article) {
      fetchImages(article);
    }
  }, [article]);
  return (
    <ImageContainer>
      {srcImg ? (
        <StyledImage src={srcImg} alt={article.title} />
      ) : (
        <div>
          Loading Image...
          <ClipLoader color={THEME_COLOR} />
        </div>
      )}
    </ImageContainer>
  );
};

export default DynamicImageComponent;
