// Your main component using ArticleForm
import React, { useState } from "react";
import ContactForm from "../components/ContactForm";
import PopUp from "../components/PopUp";
import { usePopup,headers, setRequest } from "../utils/helpers";
import { apiBaseUrl } from "../config";
import { useNavigate } from "react-router-dom";
import { logger } from '../utils/logger'

const ContactPage = () => {
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
      try{
    console.warn("Creating FormData")
        const mail = new FormData();
        mail.append("mailFrom", formData.mailFrom)
        mail.append("subject", formData.subject)
        mail.append("message", formData.message)
        console.log("formed mail data to send:",mail)
        const type = headers.multipart
        const request = setRequest("POST",mail,type)

            const response = await fetch(
                apiBaseUrl + '/api/sendMail',
                request)
        if (response.ok) {
        logger.debug("mail sent successfully");

        setSuccess(true);

        configurePopup(
          true,
          "success",
            `Your mail has been sent to: '${formData.mailTo}'`
        );
      } else {
        // Handle error
        logger.debug(response)
        configurePopup(
          true,
          "failure",
            `Le message '${formData.message}' n'a pas pu être envoyé\n Error: ${JSON.stringify(await response.json()) }`
        );
        console.error("Error sending message");
      }
    } catch (error) {
      // Handle network error
      console.error("Server Error:", error);
    }
  };

  return (
    <div>
      <ContactForm
        formTitle="Send an email"
        onSubmit={handleFormSubmit}
        setFile={setFile}
        action="Send"
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

export default ContactPage;
        
