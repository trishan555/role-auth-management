const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/userModel')
const Note = require('./models/noteModel')

const URI = process.env.MONGODB_URL
mongoose.connect(URI, (err) => {
    if (err) throw err
    console.log('Connected to MongoDB')
})

const users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@gmail.com',
        password:
            '$2b$10$LQdE0EbL7o9JIdtw98C0vevLn2VPCYYSJw6xMuTMnMLgBgE8zrEYS', // Password='admin123'
        accountType: 'admin',
        status: true,
        phone: '0415618594',
        dateOfBirth: new Date(),
    },

    {
        firstName: 'John',
        lastName: 'Wick',
        email: 'student@gmail.com',
        password:
            '$2b$10$mp/dge6YSpw9KPEZQI6QHuYk.P4zpr/fVPy.f2np8hM1SoBHfEBXK', // Password='student123'
        accountType: 'student',
        status: true,
        phone: '071752545',
        dateOfBirth: new Date(),
    },
]

const seedDatabase = async () => {
    await User.deleteMany({})
    await Note.deleteMany({})
    await User.insertMany(users)
}
console.log('Seeds added successfully!')

seedDatabase().then(() => {
    mongoose.connection.close()
})
