import React, { useState, createContext } from 'react';

import PropTypes from 'prop-types';

export const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <PaginationContext.Provider value={[pageNumber, setPageNumber]}>
      {children}
    </PaginationContext.Provider>
  );
};

PaginationProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
