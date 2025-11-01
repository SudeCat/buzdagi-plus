import { createContext, useContext } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children, value }) {
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    return { searchQuery: "", setSearchQuery: () => {}, shouldExecuteSearch: false, setShouldExecuteSearch: () => {} };
  }
  return context;
}

