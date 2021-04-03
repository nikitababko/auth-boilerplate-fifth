const UploadController = require('../controllers/UploadController');
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');
const uploadImage = require('../middlewares/uploadImage');

const createRoutes = (app) => {
  app.post('/user/register', UserController.register);
  app.post('/user/activation', UserController.activateEmail);
  app.post('/user/login', UserController.login);
  app.get('/user/logout', UserController.logout);
  app.post('/user/refresh_token', UserController.getAccessToken);

  app.post('/user/google_login', UserController.googleLogin);
  app.post('/user/facebook_login', UserController.facebookLogin);

  app.post('/user/forgot', UserController.forgotPassword);
  app.post('/user/reset', auth, UserController.resetPassword);

  app.get('/user/info', auth, UserController.getUserInfo);
  app.get('/user/all_info', auth, authAdmin, UserController.getUsersAllInfo);

  app.patch('/user/update', auth, UserController.updateUser);
  app.post('/api/upload_avatar', uploadImage, auth, UploadController.uploadAvatar);
  app.patch('/user/update_role/:id', auth, authAdmin, UserController.updateUserRole);

  app.delete('/user/delete/:id', auth, authAdmin, UserController.deleteUser);
};

module.exports = createRoutes;
