import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Header } from './components';
import Body from './pages/Body';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Header />
        <Body />
      </Router>
    </div>
  );
};

export default App;
