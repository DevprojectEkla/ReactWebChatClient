// Your main component using ArticleForm
import React, { useState } from "react";
import ArticleForm from "../components/ArticleForm";
import Success from "../components/Success";
import { apiBaseUrl, MUTLIPART_BOUNDARY } from "config";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateArticlePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { article } = location.state || {};

   const popUpMessage = "Article mis à jour avec succès"
  // console.log("ARTICLE:", article)
  const [success, setSuccess] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    navigate("/articles");
    setPopupOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    // console.log("FORMDATA:",formData)

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

      console.log("FILEDATA", fileData);
      const response = await fetch(
        apiBaseUrl + `/api/articles/update/${article._id}`,
        {
          method: "PUT",
          body: fileData,
          headers: {
            "Content-Type": `multipart/form-data; boundary="${MUTLIPART_BOUNDARY}"`,
          },
        }
      );
      // .then(response => response.json().then(data => console.log(data)).catch(error => console.error("Error: ",error)))
      if (response.ok) {
        // Handle successful article creation
        console.log("Article updated successfully");

        setSuccess(true);
        openPopup();
      } else {
        // Handle error
        console.error("Error creating article");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <h1>Editer l'article</h1>
      <ArticleForm
        article={article}
        formTitle="Editer l'article"
        onSubmit={handleFormSubmit}
        action="Editer"
      />
      {isPopupOpen && <Success isOpen={isPopupOpen} onClose={closePopup} message={popUpMessage} />}
    </div>
  );
};

export default UpdateArticlePage;
