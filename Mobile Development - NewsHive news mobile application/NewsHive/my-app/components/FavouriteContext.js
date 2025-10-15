// import libraries and dependencies
import { createContext, useContext, useState } from 'react';

// declare variables
const FavouritesContext = createContext();

// FavouritesProvide function
export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState({});

  const toggleFavourite = (article) => {
    setFavourites((prev) => {
      if (prev[article.url]) {

        // remove selected article from favourites
        const updated = { ...prev };
        delete updated[article.url];
        return updated;
      } else {

        // add selected article to favourites
        return { ...prev, [article.url]: article };
      }
    });
  };

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};
// export Favoruites function to be utilized in the app
export const useFavourites = () => useContext(FavouritesContext);
