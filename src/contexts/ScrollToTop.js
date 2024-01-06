import React, { createContext, useEffect ,useContext} from 'react';

const ScrollToTopContext = createContext();

export const ScrollToTopProvider = ({children})=> {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

      return <ScrollToTopContext.Provider value={null}>{children}</ScrollToTopContext.Provider>
  }


export const useScrollToTopContext = () => {return useContext(ScrollToTopContext)}
