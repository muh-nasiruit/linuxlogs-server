const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const spawn = require('child_process').spawn;
const port = process.env.PORT || 4054;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/linux-logs', (req, res) => {
    	const tail = spawn('tail', ['-n 5', '/var/log/syslog']);
	console.log("Sending log");
	tail.stdout.pipe(res);

})

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})

