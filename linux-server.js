const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const spawn = require('child_process').spawn;
const { exec } = require('child_process');


const port = process.env.PORT || 4054;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/linux-logs', (req, res) => {
  // const tail = spawn('tail', ['-n 5', '/var/log/syslog']);
	// tail.stdout.pipe(res);
  const command = 'cat /var/log/syslog';
  const filePath = '/home/servers/linuxlogs-server/logs.txt';
  
  exec(`${command} > ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    // console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
    console.log("Saving log");
    res.writeHead(200, {'Content-Type': 'text/plain'});
    const readStream = fs.createReadStream('logs.txt', 'utf8');
    let data = '';
    const timeInterval = 1000;  // time interval in milliseconds
    let index = 0;
    readStream.on('data', function(chunk) {
        data += chunk;
    });
    readStream.on('end', function() {
        const lines = data.split("\n");
        const lastFewLines = lines.slice(-5);
        lastFewLines.forEach(function(line) {
          setTimeout(() => {
            if (index < lastFewLines.length) {
              res.write(line + '\n');
              index++;
            } else {
              res.end();
            }
          }, 1500);
        });
    });
    // res.send('Logs Saved');
  });
})

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})

