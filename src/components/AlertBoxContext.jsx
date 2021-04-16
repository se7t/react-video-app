/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, createContext } from 'react';

export const AlertBoxContext = createContext();

export const AlertBoxProvider = (props) => {
  const [alert, setAlert] = useState({ bootstrapColor: '', bootstrapMessage: '', visible: false });

  return (
    <AlertBoxContext.Provider value={[alert, setAlert]}>
      {props.children}
    </AlertBoxContext.Provider>
  );
};
