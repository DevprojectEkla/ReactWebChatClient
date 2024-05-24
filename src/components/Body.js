import { Link } from 'react-router-dom';
import {Button,clickCallBack} from './Button';
import {useScrollToTopContext} from '../contexts/ScrollToTop'
import { styled } from "styled-components"
import { APP_TITLE,SUB_TITLE } from '../config';
import SEO from './SEO'

const StyledBodyContainer = styled.div `display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Body = () => {
    const scrollerPosition = useScrollToTopContext()
    return(
        <StyledBodyContainer>
        <SEO/>
<h1>{APP_TITLE}</h1>
<h2>{SUB_TITLE}</h2>

       
        <div >
              <Button >< Link to="/articles">Consulter les articles</Link>
 </Button>
                      <Button onClick={clickCallBack}>Rejoindre le Forum</Button>
                      <Button>< Link to="/chatRoom">Rejoindre le chat</Link></Button>
              <Button onClick={clickCallBack}> Contact</Button>
      
      </div>
        <div className='textContainer'>
        <h3>Ce site est en construction</h3>
        
        </div>


        </StyledBodyContainer>
    )
}


export default Body
