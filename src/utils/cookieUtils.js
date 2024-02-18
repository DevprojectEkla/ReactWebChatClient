import {DEFAULT_AVATAR_HASH_NAME} from "config"

export const generateUniqueId = () => {const timestamp = Date.now()
const randomNumber = generateRandomNumber(1000)
    return `id_${timestamp}_${randomNumber}`
}
const generateRandomNumber =  (range) => {return Math.floor(Math.random() * range)}
export const generateDefaultName = (range) => {return `Anonymous${generateRandomNumber(range)}`}

export const generateDefaultSessionData = () => {
    return JSON.stringify({sessionId: generateUniqueId(),username: generateDefaultName(1000),avatar:{name: DEFAULT_AVATAR_HASH_NAME,type:"png"}})
}

export const getCookie = async (cookieName) => {
          const cookies = document.cookie.split(';');
          for (const cookie of cookies){
              const [name,value] = cookie.trim().split('=');
              if (name === cookieName) {
      const decodedValue = decodeURIComponent(value);
      try {
        // Attempt to parse the cookie value as JSON
        const parsedData = JSON.parse(decodedValue);
        return parsedData;
      } catch (error) {
        // If parsing fails, return the raw value
        return decodedValue;
      }
    }
  }
  return null;      };

export const getUserName = async () => {const cookie = await getCookie("session_data");
    if (cookie){return cookie.username}
    else{
             const sessionId = generateUniqueId() 
        const defaultUserName = generateDefaultName(1000)
             console.log("the user is anonymous. creating anonymous session",sessionId)
            createCookie("session_data",generateDefaultSessionData(),.1)
        return defaultUserName 

         }

    }


export const createCookie = (name, value, hours) => {
  let expires = "";
  if (hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; Secure; SameSite=None; path=/";
};

