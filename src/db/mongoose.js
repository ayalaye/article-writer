const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/article-writer-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})