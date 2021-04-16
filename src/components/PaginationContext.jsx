/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { useState, createContext } from 'react';

export const PaginationContext = createContext();

export const PaginationProvider = (props) => {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <PaginationContext.Provider value={[pageNumber, setPageNumber]}>
      {props.children}
    </PaginationContext.Provider>
  );
};
