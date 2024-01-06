//if the react app is served on a different server in dev stage
//we need an absolute url to fetch stuff from our server api
//but once react client is merged we don't need an absolute but a relative url and we can set apiBaseUrl to an empty string
const isDevelopment = process.env.NODE_ENV === 'development';
const apiBaseUrl = isDevelopment?'http://localhost:8000':''
const APP_TITLE = "Isaïæ Vox"
const SUB_TITLE = "La plateforme de ta vocation"
const DESCRIPTION = "Tu as entendu l'appel du Seigneur et cherche à répondre à cet appel mais sans savoir par où commencer ? Cette app' est faite pour toi !"
const TYPE = "articles"
const CONCEPTEUR = "Ekla Development"



module.exports ={TYPE,DESCRIPTION,CONCEPTEUR,apiBaseUrl, isDevelopment,APP_TITLE,SUB_TITLE}

