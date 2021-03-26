const bcrypt = require('bcrypt');

const User = require('../models/User');
const sendMail = require('./SendMail');

const validateEmail = require('../utils/validations/register');
const { createActivationToken } = require('../utils/token');
const generateHashPassword = require('../utils/generateHashPassword');

const { CLIENT_URL } = process.env;

const UserController = {
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

      await User.findOne({ email }).exec(async (err, user) => {
        if (user) {
          return res.status(400).json({
            errorMessage: 'An account with this email already exists.',
          });
        } else {
          // Hash the password
          // const salt = await bcrypt.genSalt();
          // const passwordHash = await bcrypt.hash(password, salt);

          // const newUser = new User({
          //   name,
          //   email,
          //   password,
          // });

          const newUser = {
            name,
            email,
            password,
          };

          // bcrypt.genSalt(10, (err, salt) => {
          //   bcrypt.hash(newUser.password, salt, (err, hash) => {
          //     if (err) throw err;
          //     newUser.password = hash;
          //     try {
          //       newUser.save();
          //     } catch (error) {
          //       console.error(error);
          //     }
          //   });
          // });

          // Account activation
          const activationToken = createActivationToken(newUser);
          const url = `${CLIENT_URL}/user/activate/${activationToken}`;

          sendMail(email, url);

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
};

module.exports = UserController;
