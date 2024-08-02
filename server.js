const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const hootsRouter = require('./controllers/hoots.js')

const path = require('path');
const url = require('url');

const importMetaUrl = url.pathToFileURL(__filename).href

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());

// Routes go here
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/hoots', hootsRouter);

// ** New lines **
app.use(express.static(path.join(importMetaUrl, 'client', 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(importMetaUrl, 'client', 'dist', 'index.html'))
})

app.listen(3000, () => {
  console.log('The express app is ready!');
});