const express = require('express');
const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');

const app = express();
app.use(express.json());
app.use('/api/health', healthRoutes);

app.listen(env.PORT, function(){
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
})