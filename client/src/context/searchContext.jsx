import { createContext, useContext, useState } from 'react';

const SearchTextContext = createContext();

export const SearchTextProvider = ({ children }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResultType, setSearchResultType] = useState('name');
  const [userType, setUserType] = useState('admin');
  const [isProjectLead, setIsProjectLead] = useState(false);
  
  return (
    <SearchTextContext.Provider value={{ 
      searchText, setSearchText, 
      searchResultType, setSearchResultType,
      userType, setUserType,
      isProjectLead, setIsProjectLead
    }}>
      {children}
    </SearchTextContext.Provider>
  );
};

export const useSearchText = () => useContext(SearchTextContext);