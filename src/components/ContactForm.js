import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import {
  BrowseButton,
  FormContainer,
  H1,
  InputLabelContainer,
  Label,
  Input,
  TextArea,
  FileInput,
  SubmitForm,
  ErrorMessage,
  SuccessMessage,
} from "../styles/FormStyles";

import { useState } from "react";
import {
  binaryStringToBytesArray,
  headers,
  setRequest,
  setSrcImg,
} from "../utils";
import { MyButton } from "./Button";
import DynamicImageComponent from "./DynamicImageComponent";
import { apiBaseUrl } from "../config";

const ContactForm = ({ onSubmit }) => {
  const [mailFrom, setMailFrom] = useState("");
  const [mailTo, setMailTo] = useState("DevEklaCompany");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [mailFromError, setMailFromError] = useState("");
  const [mailToError, setMailToError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [subjectError, setSubjectError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mailTo) {
      setMailToError("A valid email is required");
    }
    if (!mailFrom) {
      setMailFromError("A name or at least a pseudo is required");
      return;
    }

    if (!message) {
      setMessageError("Please write something");
      return;
    }

    // Assuming onSubmit is a function passed as a prop to handle form submission
    onSubmit({ mailFrom, message });
  };
  const handleMailToChanged = (e) => {
    setMailTo(e.target.value);

    if (e.target.value.length > 100) {
      setMailToError("email must not exceed 100, characters");
    } else {
      setMailToError("");
    }
  };

  const handleMailFromChanged = (e) => {
    setMailFrom(e.target.value);

    if (e.target.value.length > 100) {
      setMailFromError("pseudo must not exceed 100 characters");
    } else {
      setMailFromError("");
    }
  };
    const handleSubjectChanged = (e) => {
    setSubject(e.target.value);

    if (e.target.value.length > 100) {
      setSubjectError("Subject must not exceed 100, characters");
    } else {
      setSubjectError("");
    }
  };
  // let decoder = new TextDecoder("utf-8");
  //const handleFileChange = (e) => {
  //  const fileInput = e.target.files[0];
  //  setFile(fileInput);
  //  setFileInput(fileInput);
  //  // console.log("Input File", fileInput);
  //  const reader = new FileReader();
  //  reader.onload = (event) => {
  //    const fileContent = event.target.result;
  //    // console.log("File Content", fileContent);
  //    // let decodedContent = decoder.decode(fileContent);
  //    // let        encoder = new TextEncoder()
  //    // let        encoded =encoder.encode(fileContent)
  //    setRawData(binaryStringToBytesArray(fileContent));
  //    let encoded = btoa(fileContent);
  //    // console.log("base64 encoding:", encoded);
  //    setContent(encoded);
  //  };
  //  reader.readAsBinaryString(fileInput);
  //};

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    if (e.target.value.length > 20000) {
      setMessageError("Message must not exceed 20000 characters");
    } else {
      setMessageError("");
    }
  };

  return (
    <FormContainer>
      <InputLabelContainer>
        <H1>Contact Me</H1>
      </InputLabelContainer>

      <form encType="application/json" onSubmit={handleSubmit}>
        <InputLabelContainer>
          <Label>
      From: 
            <Input
              type="text"
              value={mailFrom}
              onChange={handleMailFromChanged}
              onBlur={handleMailFromChanged}
            />
            {mailFromError && <ErrorMessage>{mailFromError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>

      
        <InputLabelContainer>
          <Label>
            To:
            <Input
              type="text"
              value={mailTo}
              readOnly
              onBlur={handleMailToChanged}
            />
            {mailToError && <ErrorMessage>{mailToError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>
<InputLabelContainer>
          <Label>
      Subject: 
            <Input
              type="text"
              value={subject}
              onChange={handleSubjectChanged}
              onBlur={handleSubjectChanged}
            />
            {subjectError && <ErrorMessage>{subjectError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>



        <InputLabelContainer>
          <Label>
            Mail:
            <TextArea
              id="mail"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={handleMessageChange}
              style={{ height: "20em" }}
            />
            {messageError && <ErrorMessage>{messageError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>

        {/*<InputLabelContainer>
          <Label>
            Choisissez une image pour votre avatar:
            <FileInput
              id="file"
              type="file"
              onInput={handleFileChange}
              accept="image/*"
            />
            <BrowseButton htmlFor="file">Parcourir</BrowseButton>
          </Label>
          </InputLabelContainer>*/}
        {/*<InputLabelContainer>
          {fileInput && <Label>Votre avatar:</Label>}{" "}
          {fileInput && (
            <DynamicImageComponent
              src={setSrcImg(rawData, fileInput.type)}
              alt={`uploaded: ${fileInput.title}`}
            />
          )}
              </InputLabelContainer>*/}
        <SubmitForm>
          <Button
            onClick={handleSubmit}
            variant="contained"
            type="submit"
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </SubmitForm>
      </form>
    </FormContainer>
  );
};
export default ContactForm;
