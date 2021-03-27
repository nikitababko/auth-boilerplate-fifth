const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel');
const sendMail = require('./SendMail');

const validateEmail = require('../utils/validations/register');
const {
  createActivationToken,
  createRefreshToken,
  createAccessToken,
} = require('../utils/token');
const generateHashPassword = require('../utils/generateHashPassword');

const { CLIENT_URL } = process.env;

const UserController = {
  // Register
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Please fill in all fields.',
        });
      }

      if (!validateEmail(req.body)) {
        return res.status(400).json({
          msg: 'Invalid email.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters.',
        });
      }

      // if (password !== passwordVerify) {
      //   return res.status(400).json({
      //     errorMessage: 'Please enter the same password twice.',
      //   });
      // }

      UserModel.findOne({ email }).exec(async (err, user) => {
        if (user) {
          return res.status(400).json({
            errorMessage: 'An account with this email already exists.',
          });
        } else {
          // Hash the password
          const passwordHash = await bcrypt.hash(password, 12);

          const newUser = {
            name,
            email,
            password: passwordHash,
          };

          // Account activation
          const activation_token = createActivationToken(newUser);
          const url = `${CLIENT_URL}/user/activate/${activation_token}`;

          sendMail(email, url, 'Verify your email address');

          res.json({
            message: 'Register success! Please activate your email to start.',
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  // Activate account
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);

      console.log(user);

      const { name, email, password } = user;

      UserModel.findOne({ email }).exec(async (err, user) => {
        if (user) {
          return res.status(400).json({
            msg: 'This email already exists.',
          });
        } else {
          const newUser = new UserModel({
            name,
            email,
            password,
          });

          await newUser.save();

          res.json({ msg: 'Account has been activated!' });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      UserModel.findOne({ email }).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({ msg: 'This email does not exist.' });
        } else {
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({ msg: 'Password is incorrect.' });
            } else {
              const refresh_token = createRefreshToken({ id: user._id });
              res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });

              res.json({ msg: 'Login success!' });
            }
          });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Get access token
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      console.log(rf_token);
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: 'Please login now!' });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'This email does not exist.' });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendMail(email, url, 'Reset your password');
      res.json({ msg: 'Re-send the password, please check your email.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);

      await UserModel.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: 'Password successfully changed!' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = UserController;
