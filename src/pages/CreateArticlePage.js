// Your main component using ArticleForm
import React, { useState } from "react";
import ArticleForm from "../components/ArticleForm";
import PopUp from "../components/PopUp";
import { usePopup } from "../utils";
import { apiBaseUrl, MUTLIPART_BOUNDARY } from "config";
import { useNavigate } from "react-router-dom";
import { logger } from '../utils/logger'

const CreateArticlePage = () => {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isPopupOpen, popUpType, popUpMessage, configurePopup } = usePopup();

  const navigate = useNavigate();
  const closePopup = () => {
    configurePopup(false, "", "");
    if (popUpType === "success") {
      navigate("/");
    }
  };

  const handleFormSubmit = async (formData) => {
    logger.debug("FORMDATA:", formData);

    // Make an HTTP request to your server to create a new article using formData
    // You can use libraries like axios or fetch for making HTTP requests
    try {
      const fileData = new FormData();

      fileData.append("title", formData.title);
      fileData.append("author", formData.author);
      fileData.append("body", formData.body);
      fileData.append("filename", formData.filename);
      fileData.append("type", formData.type);
      fileData.append("content", formData.content);

      logger.debug("FILEDATA", fileData);
      const response = await fetch(apiBaseUrl + "/api/articles/create", {
        method: "POST",
        body: fileData,
        headers: {
          "Content-Type": `multipart/form-data; boundary="${MUTLIPART_BOUNDARY}"`,
        },
      });
      // .then(response => response.json().then(data => logger.debug(data)).catch(error => console.error("Error: ",error)))
      if (response.ok) {
        // Handle successful article creation
        logger.debug("Article created successfully");

        setSuccess(true);

        configurePopup(
          true,
          "success",
          `L'article '${formData.title}'  a bien été créé`
        );
      } else {
        // Handle error
        logger.debug(response)
        configurePopup(
          true,
          "failure",
            `L'article '${formData.title}' n'a pas pu être créé\n Error: ${await response.json()}`
        );
        console.error("Error creating article");
      }
    } catch (error) {
      // Handle network error
      console.error("Server Error:", error);
    }
  };

  return (
    <div>
      <ArticleForm
        formTitle="Créer un article"
        onSubmit={handleFormSubmit}
        setFile={setFile}
        action="Créer"
      />
      {isPopupOpen && (
        <PopUp
          isOpen={isPopupOpen}
          type={popUpType}
          onClose={closePopup}
          message={popUpMessage}
        />
      )}
    </div>
  );
};

export default CreateArticlePage;
