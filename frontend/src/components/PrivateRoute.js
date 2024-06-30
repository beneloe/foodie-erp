import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useContext(AuthContext);

  return user ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
