const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI, {
        useNewUrlParser: true,
         useCreateIndex: true,
         useFindAndModify:false}
         )
         console.log("Connected to Mongo")
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    try {
    await mongoose.connection.close()
    console.log('Disconnected from Mongo')
    await mongoose.disconnect()
    console.log('Disconnected from Mongoose')
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = { connectDB, disconnectDB }