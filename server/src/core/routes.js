const UserController = require('../controllers/UserController');

const createRoutes = (app) => {
  app.post('/user/register', UserController.register);
};

module.exports = createRoutes;
