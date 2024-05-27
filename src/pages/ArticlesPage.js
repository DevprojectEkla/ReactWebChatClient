import {Link} from "react-router-dom"
import ArticlesList from "../components/ArticlesList"
import {MyButton} from "../components/Button"
const ArticlesPage = () => {

    return (
    <div>
    <div>
    <ArticlesList/>
    </div>
    <div><MyButton> <Link to="/">Retour</Link></MyButton></div>
    </div>

)}

export default ArticlesPage
