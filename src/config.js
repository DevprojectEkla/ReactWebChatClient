//if the react app is served on a different server in dev stage
//we need an absolute url to fetch stuff from our server api
//but once react client is merged we don't need an absolute but a relative url and we can set apiBaseUrl to an empty string
const isDevelopment = process.env.NODE_ENV === "development";
const apiBaseUrl = isDevelopment === "development" ? "https://visio.devekla.com" : "";
const APP_TITLE = "The DevEkla Project";
const SUB_TITLE = "Mortal engineering";
const WIDTH = "width=device-width, initial-scale=1.0"
const DESCRIPTION =
  "Tu as entendu l'appel du Seigneur et cherches à répondre à cet appel mais sans savoir par où commencer ? Cette app' est faite pour toi !";
const TYPE = "articles";
const CONCEPTEUR = "Ekla Development";

const ASSETS = "";
const BACKGROUND = "/assets/background.jpg";

const THEME_COLOR = "rgba(70, 130, 180, 0.8)";
const HOVER_BACKGROUND_COLOR = "rgb(255,250,255,.7)";
const HOVER_EFFECT = (end_color,text_color="inherit") => {return `&:hover {color:${text_color};
    background-color: ${end_color};
transition: background-color 0.3s ease,color 0.3s ease,border-color 0.3s ease;`}
const AVATAR_CACHE_KEY= "avatar_cache"
const ARTICLE_IMG_CACHE_KEY= "article_image_cache"
const FAILURE_COLOR='#e74c3c'
const SUCCESS_COLOR = "rgba(192, 130,140,0.8)";
const MUTLIPART_BOUNDARY =
  "boundaryParsingDataWithEklaDevelopmentCompany12345678901234567890123467890";
const DEFAULT_AVATAR_HASH_NAME = '2f6ef1ab218b73b662d2ef359aba36ce8ca9086a6aca2f5e7748a8d0fed58aca'

module.exports = {
    WIDTH,
    DEFAULT_AVATAR_HASH_NAME,
    HOVER_EFFECT,
  ASSETS,
  BACKGROUND,
  TYPE,
  DESCRIPTION,
  CONCEPTEUR,
  apiBaseUrl,
  isDevelopment, 
    AVATAR_CACHE_KEY,
    ARTICLE_IMG_CACHE_KEY,
    HOVER_BACKGROUND_COLOR,
  APP_TITLE,
  SUB_TITLE,
  THEME_COLOR,
  SUCCESS_COLOR,
    FAILURE_COLOR,
  MUTLIPART_BOUNDARY,
};

