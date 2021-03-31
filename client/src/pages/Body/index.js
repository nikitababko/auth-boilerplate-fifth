import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Login, Register } from 'pages/Auth';
import { ActivationEmail, ForgotPassword, NotFound } from 'components';

const Body = () => {
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;

  return (
    <section>
      <Switch>
        <Route exact path="/login" component={isLogged ? NotFound : Login} />
        <Route exact path="/register" component={isLogged ? NotFound : Register} />
        <Route
          exact
          path="/forgot_password"
          component={isLogged ? NotFound : ForgotPassword}
        />
        <Route
          exact
          path="/user/activate/:activation_token"
          component={ActivationEmail}
        />
      </Switch>
    </section>
  );
};

export default Body;
