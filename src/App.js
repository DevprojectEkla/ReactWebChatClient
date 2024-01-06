import './App.css';
import styled from 'styled-components'
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Footer from './components/Footer'
import ArticlesPage from './pages/ArticlesPage'
import Header from './components/Header';
import Body from './components/Body';
import SubscribeForm from './components/SubscribeForm';
import MyComponent from './components/Circle';
import Login from './components/Login';
import SingleArticlePage from './pages/SingleArticlePage';
import {HeaderProvider} from './contexts/HeaderContext';
import {useScrollToTopContext} from './contexts/ScrollToTop';
import {HelmetProvider} from 'react-helmet-async'
import CreateArticlePage from './pages/CreateArticlePage';
import UpdateArticlePage from './pages/UpdateArticlePage'
import StyledGlobal from './styles/BodyStyles';

const StyledApp = styled.div`
    display:flex;
    flex-direction: column;
    margin: auto;
    `


function App() {
    const scrollPosition = useScrollToTopContext()
    
  return (
      <HelmetProvider>
<BrowserRouter basename='/'>
      <HeaderProvider>
    <div className="App">
    <StyledGlobal/> 
    
      <div>
      <Header/>
      </div>
      <Routes>
      <Route  path={"/"} exact element={<Body/>}></Route>
      <Route path={"login"} element={<Login/>}></Route>
      <Route path={"subscribe"} element={<SubscribeForm/>}></Route>
      <Route path={"articles/create"} element={<CreateArticlePage/>}></Route>
      <Route path={"articles/update/:id"} element={<UpdateArticlePage/>}></Route>

      <Route path={"articles"} element={<ArticlesPage/>}></Route>
      <Route path={"articles/detail/:id"} element={<SingleArticlePage/>}></Route>
      </Routes>
      <div>
      <Footer/>
      </div>
                                    </div>
      </HeaderProvider>
          </BrowserRouter>
      </HelmetProvider>
  );
}

export default App;
