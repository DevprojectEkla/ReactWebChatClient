import BevyCanvas from '../components/BevyCanvas';
import {ListArticleContainer} from '../styles/ArticlesStyles';

export default function BevyPage() {
    return (
        <ListArticleContainer>
            <h1>Bevy 3D in React</h1>
            <BevyCanvas />
        </ListArticleContainer>
    );
}
