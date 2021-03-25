const UserModel = require('../models/UserModel');

const validateEmail = require('../utils/validations/register');

const UserController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const data = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Please fill in all fields.',
        });
      }

      if (!validateEmail(data)) {
        return res.status(400).json({ msg: 'Invalid email.' });
      }

      res.json({
        message: 'Register test',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = UserController;
