import {Helmet} from 'react-helmet-async';
import { DESCRIPTION,TYPE,CONCEPTEUR, APP_TITLE,SUB_TITLE } from '../config';
const SEO = () => {
    return (
<Helmet>
{ /* Standard metadata tags */ }
<title>{APP_TITLE}</title>
<meta name='description' content={DESCRIPTION} />
{ /* End standard metadata tags */ }
{ /* Facebook tags */ }
<meta property="og:type" content={TYPE} />
<meta property="og:title" content={APP_TITLE} />
<meta property="og:description" content={DESCRIPTION} />
{ /* End Facebook tags */ }
{ /* Twitter tags */ }
<meta name="twitter:creator" content={CONCEPTEUR} />
<meta name="twitter:card" content={TYPE} />
<meta name="twitter:title" content={APP_TITLE} />
<meta name="twitter:description" content={DESCRIPTION} />
{ /* End Twitter tags */ }
</Helmet>
    )
}


export default SEO
