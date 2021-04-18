import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const AlertBoxContext = createContext();

export const AlertBoxProvider = ({ children }) => {
  const [alert, setAlert] = useState({ bootstrapColor: '', bootstrapMessage: '', visible: false });

  return (
    <AlertBoxContext.Provider value={[alert, setAlert]}>
      {children}
    </AlertBoxContext.Provider>
  );
};

AlertBoxProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
