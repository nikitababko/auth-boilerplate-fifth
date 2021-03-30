import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Login, Register } from 'pages/Auth';
import { ActivationEmail } from 'components';

const Body = () => {
  return (
    <section>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
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
