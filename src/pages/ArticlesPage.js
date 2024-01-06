import {Link} from "react-router-dom"
import ArticlesList from "../components/ArticlesList"
import {Button} from "../components/Button"
const ArticlesPage = () => {return (
    <div>
    <div>
    <ArticlesList/>
    </div>
    <div><Button> <Link to="/">Retour</Link></Button></div>
    </div>

)}

export default ArticlesPage
