import React, { useContext } from 'react';

import { Alert } from 'reactstrap';

import { AlertBoxContext } from './AlertBoxContext';

export default function AlertBox() {
  const [alert, setAlert] = useContext(AlertBoxContext);

  const onDismiss = () => {
    setAlert({ bootstrapColor: '', bootstrapMessage: '', visible: false });
  };

  return (
    <Alert className="mt-4" color={alert.bootstrapColor} isOpen={alert.visible} toggle={onDismiss}>
      {alert.bootstrapMessage}
    </Alert>
  );
}
