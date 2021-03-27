const UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');

const createRoutes = (app) => {
  app.post('/user/register', UserController.register);
  app.post('/user/activation', UserController.activateEmail);
  app.post('/user/login', UserController.login);
  app.post('/user/refresh_token', UserController.getAccessToken);
  app.post('/user/forgot', UserController.forgotPassword);
  app.post('/user/reset', auth, UserController.resetPassword);
  app.get('/user/info', auth, UserController.getUserInfo);
};

module.exports = createRoutes;
