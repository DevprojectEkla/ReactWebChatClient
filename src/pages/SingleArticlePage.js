import {useLocation} from "react-router-dom";
import Article from "../components/Article"
const SingleArticlePage = () => {const location = useLocation();
    const { article,index } = location.state || {}
    return (


        <div className="bodyContainer">
        <Article article={article} index={index}/>
        </div>
    )
}

export default SingleArticlePage
