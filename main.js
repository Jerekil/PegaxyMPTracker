//http server
const express = require('express');
const app = express();
const http = require('http').Server(app);

//socket server
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
const cors = require('cors');
const cron = require('node-cron');

const {getPegaList} = require('./index.js');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});


//socket listener
io.on('connection', function(socket) {
    console.log('A user connected');
 
    //disconnect
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
 });

//  cron.schedule
const task = cron.schedule('*/10 * * * * *', async () =>  {
    const pegaList = await getPegaList(500);
  io.emit("pega", pegaList);
}, {
  scheduled: false
});

task.start();

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
 });