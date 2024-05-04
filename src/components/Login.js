import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./Button";
import { apiBaseUrl } from "config";
import PopUp from "./PopUp";
import {FormContainer,H1,
  InputLabelContainer,
    SubLink,
  Label,
  Input,
  TextArea,
  FileInput,
GoogleLoginButton} from "../styles/FormStyles";
import { logger } from "../utils/logger"
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popUpType, setPopUpType] = useState("success");
  const [popUpMessage, setPopUpMessage] = useState("");


    const googleAuthCallBack = async () => {
        const response = await fetch(apiBaseUrl + '/auth/google',{method: 'GET'})
        const data = await response.json()
        const redirectUri = data.redirect
        logger.debug("redirect url :",redirectUri)
window.location.href =  redirectUri

    }
  const popUpConfig = (showPopUp, type, message) => {
    setPopupOpen(showPopUp);
    setPopUpType(type);
    setPopUpMessage(message);
  };
  const navigate = useNavigate();
  const closePopup = () => {
    logger.debug("closed with popUp type => ", popUpType);
    setPopupOpen(false);
    if (popUpType === "success") {
      navigate("/");
    }
  };

  const onClick = async () => {
    setEmailError("");
    setPasswordError("");

    if ("" === email) {
      setEmailError("Please enter your username or email");
      return;
    }

    // if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    // {
    //     setEmailError("Please enter a valid email address")
    //     return
    // }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }
    if (password.length < 7) {
      setPasswordError("The password must be 8 characters minimum");
      return;
    }
    logger.debug(email, password);
    let data = {
      email: email,
      password: password,
    };
    let response = await fetch(apiBaseUrl + "/api/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    });
    logger.debug(response);
    if (response.status === 404 || response.status === 500) {
      popUpConfig(true, "failure", "invalid username/email or password");
    } else {
      popUpConfig(true, "success", "login successful !");
    }
  };

  return (
        <FormContainer onKeyPress={(ev) => ev.key === 'Enter' && onClick()}
>
      <H1>Login</H1>
      <GoogleLoginButton onClick={googleAuthCallBack}>Se connecter avec Google</GoogleLoginButton>

      <form encType="application/json">
        <InputLabelContainer>

      <Label>{emailError}
          <Input
            className="inputBox"
            value={email}
            placeholder="enter your username or email"
            onChange={(ev) => setEmail(ev.target.value)}
          />
          </Label>
      </InputLabelContainer>
      <InputLabelContainer><Label>{passwordError}
          <Input
            type="password"
            className="inputBox"
            value={password}
            placeholder="enter your password"
            onChange={(ev) => setPassword(ev.target.value)}
                />
          </Label>
        </InputLabelContainer>
        <div>
          <Button type="submit" onClick={onClick}>
            login
          </Button>
      <SubLink ><Link to={"/subscribe"}>Sign in</Link></SubLink>
        </div>
      </form>
      {isPopupOpen && (
        <PopUp
          type={"success"}
          isOpen={isPopupOpen}
          onClose={closePopup}
          message={popUpMessage}
        />
      )}
    </FormContainer>
  );
};

export default Login;
