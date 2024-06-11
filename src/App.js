import "./App.css";
import styled from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import ArticlesPage from "./pages/ArticlesPage";
import Header from "./components/Header";
import Body from "./components/Body";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import SingleArticlePage from "./pages/SingleArticlePage";
import { HeaderProvider } from "./contexts/HeaderContext";
import { useScrollToTopContext } from "./contexts/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import CreateArticlePage from "./pages/CreateArticlePage";
import CreateAccountPage from "./pages/CreateAccountPage";
import UpdateArticlePage from "./pages/UpdateArticlePage";
import { MainContent, StyledGlobal } from "./styles/BodyStyles";
import ContactPage from "./pages/ContactPage";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
`;

function App() {
  const scrollPosition = useScrollToTopContext();
  // console.log("rerender")

  return (
    <HelmetProvider>
      <BrowserRouter basename="/">
        <HeaderProvider>
          <StyledGlobal />

          <Header />
          <MainContent>
            <Routes>
              <Route path={"/"} exact element={<Body />}></Route>
              <Route path={"login"} element={<Login />}></Route>
              <Route path={"subscribe"} element={<CreateAccountPage />}></Route>
              <Route
                path={"articles/create"}
                element={<CreateArticlePage />}
              ></Route>
              <Route
                path={"articles/update/:id"}
                element={<UpdateArticlePage />}
              ></Route>

              <Route path={"articles"} element={<ArticlesPage />}></Route>
              <Route
                path={"articles/detail/:id"}
                element={<SingleArticlePage />}
              ></Route>
              <Route path={"chatRoom/"} element={<ChatRoom />}></Route>
              <Route path={"Contact/"} element={<ContactPage />}></Route>
            </Routes>
          </MainContent>
          <Footer />
        </HeaderProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
