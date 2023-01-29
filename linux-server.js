const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/linux-logs', (req, res) => {
    res.send('LINUX MACHINE');
})

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})

