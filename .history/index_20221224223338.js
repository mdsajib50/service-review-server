const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middel wares

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Service review site is runing')
});

app.listen(port, ()=>{
    console.log('message')
})