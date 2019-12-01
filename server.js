const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
const port = process.env.PORT || 5000;



const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://amr:yrxF7L4FwXlhxast@cluster0-htajx.mongodb.net/test?retryWrites=true&w=majority"|| 'mongodb://localhost/exercise-track' )

const connection = mongoose.connection;

connection.once('open' , () => {
    console.log('MongoDB database connection established successfully')
})

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware


const exercisesRouter = require('./routes/exercise');
app.use('/api/exercise' ,exercisesRouter);

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
