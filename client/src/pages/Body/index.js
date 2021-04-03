import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Login, Register } from 'pages/Auth';
import { ActivationEmail, ForgotPassword, NotFound, ResetPassword } from 'components';
import { EditProfile, EditUser } from 'pages/Profile';
import Home from 'pages/Home';

const Body = () => {
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin } = auth;

  return (
    <section>
      <Switch>
        {/* 
          // TODO Create conditional for redirect to /home...
        */}

        <Route exact path="/" component={Home} />

        <Route exact path="/login" component={isLogged ? NotFound : Login} />
        <Route exact path="/register" component={isLogged ? NotFound : Register} />
        <Route
          exact
          path="/user/activate/:activation_token"
          component={ActivationEmail}
        />
        <Route exact path="/profile" component={isLogged ? EditProfile : NotFound} />
        <Route exact path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} />

        <Route
          exact
          path="/forgot_password"
          component={isLogged ? NotFound : ForgotPassword}
        />
        <Route
          exact
          path="/user/reset/:token"
          component={isLogged ? NotFound : ResetPassword}
        />
      </Switch>
    </section>
  );
};

export default Body;
