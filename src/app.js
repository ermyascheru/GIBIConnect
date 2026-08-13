const express = require('express');
const env = require('./config/env');

const app = express();

app.listen(env.PORT, function(){
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
})