const mongoose = require('mongoose')

mongoose.set('strictQuery', true);   //allow latest version of mongoose
mongoose.connect(process.env.MONGODB_URL
    , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => { console.log("Connected to MongoDB!!") })
    .catch((error) => { console.log(error.message); })

module.exports = mongoose