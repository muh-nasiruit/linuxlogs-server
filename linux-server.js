const express = require('express');
const app = express();
const http = require("http");
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const spawn = require('child_process').spawn;
const { exec } = require('child_process');

const server = http.createServer(app);
const port = process.env.PORT || 4054;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log("Socket Connected");
  socket.on("linux-logs", (data) => {
    console.log("=== creating stream ===");
    fs.createReadStream('logs.txt')
    .on('data', (chunk) => {
      const lines = chunk.toString().split('\n').slice(-10);
      // console.log(lines)
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          console.log('Lines streamed: ', i+1);
          console.log('\n', lines[i])
          socket.emit('linux-logs', { lineData: lines[i], lineNum: i + 1});
        }, 1500);
      }
    });
  });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
});


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
    res.send("API SUCCESSFUL");
  });
})

app.listen(port, () => {
  console.log(`App started on port: ${port}`)
})

server.listen(port+10, () => {
  console.log(`Socket port: ${port+10}`)
})


