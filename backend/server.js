require('dotenv').config()
const express = require('express')
const userRouter = require('./routes/userRouter')

//express app
const app = express()

/**
 * * app.use(express.json()) -> this is used for when we make request from client side
 * *we have to gather those data using req method in controller
 * !req.body -> without following middleware we cant access the object
 * !and cannot access the data which is user sent
 */

//middleware
app.use(cors())
app.use(express.json())

//routes
app.use('/users', userRouter)
//app.get('/', (req, res) => res.send('Hello'))

// Connect to MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, (err) => {
    if (err) throw err
    console.log('Connected to MongoDB')
})

//port defining
const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server up and running on ${port} 👻`)
})
