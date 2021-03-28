require('dotenv').config({
  path: 'src/config/keys.env',
});

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const connectDB = require('./core/db');
const createRoutes = require('./core/routes');

// App init
const app = express();

// Setup app
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Register routes
createRoutes(app);

// Connect to DB
connectDB();

// Setup server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  try {
    console.log(`Server up and running on port: ${PORT}`);
  } catch (error) {
    console.error(error);
  }
});
