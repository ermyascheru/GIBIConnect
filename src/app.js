const express = require('express');
const app = express();

const PORT = 5000;

app.listen(PORT, function(){
    console.log(`Server running on port ${PORT}`);
})