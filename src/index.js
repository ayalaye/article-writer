const express = require('express')
require('./db/mongoose')
routers = require('./routers/routes.js');

const app = express()
const port =  3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', routers);




const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});
