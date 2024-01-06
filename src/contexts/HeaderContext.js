import { createContext, useContext,useState } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({children}) => {
    const [title,setTitle] = useState('Accueil');
    const setHeaderTitle = (newTitle) => {setTitle(newTitle)};
    return (
        <HeaderContext.Provider value={{title,setHeaderTitle}}>
        {children}
        </HeaderContext.Provider>
    );
};

export const useHeaderContext = () => {return useContext(HeaderContext)}
