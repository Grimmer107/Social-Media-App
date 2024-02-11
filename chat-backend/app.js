// importing third-party packages
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

// importing files
const AuthRoutes = require('./router/auth');
const UserRoutes = require('./router/users');
const MessageRoutes = require('./router/message');


// configurations
dotenv.config();
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


// setting middleware
app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('profilePic'));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'attachmentFile', maxCount: 1 },
  { name: 'content', maxCount: 1 }
]));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public', 'uploads')));

// this gives access to our server
app.use('/', express.static(path.join(__dirname, '/')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(AuthRoutes);
app.use(UserRoutes);
app.use(MessageRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
app.use((req, res, next) => {
  res.status(404).send("<h1>404 Not Found!</h1>")
});


// starting server
mongoose.connect(process.env.MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err)
  });
