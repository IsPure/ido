const express = require('express');
const app = express();
const { PORT } = require('./constants') 
const cookieParser = require('cookie-parser')

//initialize middlewares
app.use(express.json())
app.use(cookieParser())

//import routes
const authRoutes = require('./routes/auth')

//initialize routes
app.use ('/api', authRoutes)

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`App listening/running on port ${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

appStart()