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
import { binaryStringToBytesArray, setSrcImg } from "../utils";
import { MyButton } from "./Button";
import DynamicImageComponent from "./DynamicImageComponent";

const SubscribeForm = ({ onSubmit }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [quote, setQuote] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [rawData, setRawData] = useState("");

  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dateError, setDateError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("a valid email is required");
    }
    if (!username) {
      setUserNameError("a pseudo is required");
      return;
    }

    if (!password) {
      setPasswordError("A password is required");
      return;
    }

    // Assuming onSubmit is a function passed as a prop to handle form submission
    onSubmit({ username, email, quote, password, file, content });
  };
  const handleEmailChanged = (e) => {
    setEmail(e.target.value);

    if (e.target.value.length > 100) {
      setEmailError("email must not exceed 100 characters");
    } else {
      setEmailError("");
    }
  };

  const handleUserNameChanged = (e) => {
    setUserName(e.target.value);

    if (e.target.value.length > 100) {
      setUserNameError("pseudo must not exceed 100 characters");
    } else {
      setUserNameError("");
    }
  };
  // let decoder = new TextDecoder("utf-8");
  const handleFileChange = (e) => {
    const fileInput = e.target.files[0];
    setFile(fileInput);
    setFileInput(fileInput);
    // console.log("Input File", fileInput);
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      // console.log("File Content", fileContent);
      // let decodedContent = decoder.decode(fileContent);
      // let        encoder = new TextEncoder()
      // let        encoded =encoder.encode(fileContent)
      setRawData(binaryStringToBytesArray(fileContent));
      let encoded = btoa(fileContent);
      // console.log("base64 encoding:", encoded);
      setContent(encoded);
    };
    reader.readAsBinaryString(fileInput);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (e.target.value.length > 50) {
      setPasswordError("Author name must not exceed 50 characters");
    } else {
      setPasswordError("");
    }
  };

  return (
    <FormContainer>
      <InputLabelContainer>
        <H1>Créer votre compte</H1>
      </InputLabelContainer>

      <form encType="application/json" onSubmit={handleSubmit}>
        <InputLabelContainer>
          <Label>
            Pseudo:
            <Input
              type="text"
              value={username}
              onChange={handleUserNameChanged}
              onBlur={handleUserNameChanged}
            />
            {userNameError && <ErrorMessage>{userNameError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Email:
            <Input
              type="text"
              value={email}
              onChange={handleEmailChanged}
              onBlur={handleEmailChanged}
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Mot de passe:
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordChange}
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Une citation:
            <TextArea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          <Label>
            Choisissez une image pour votre avatar:
            <FileInput
              id="file"
              type="file"
              onInput={handleFileChange}
              accept="image/*"
            /><BrowseButton htmlFor="file">Parcourir</BrowseButton>
          </Label>
        </InputLabelContainer>

        <InputLabelContainer>
          {fileInput && <Label>Votre avatar:</Label>}{" "}
          {fileInput && (
            <DynamicImageComponent
              src={setSrcImg(rawData, fileInput.type)}
              alt={`uploaded: ${fileInput.title}`}
            />
          )}
        </InputLabelContainer>

        <SubmitForm>
          <MyButton onClick={handleSubmit} type="submit">
            Créer mon compte
          </MyButton>
        </SubmitForm>
      </form>
    </FormContainer>
  );
};
export default SubscribeForm;
