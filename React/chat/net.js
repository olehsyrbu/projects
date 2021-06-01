// curl localhost:8000

const server = require('net').createServer();
let count = 0;
let sockets = {};

server.on('connection', socket => {
  console.log('Client connected!');
  socket.id = count++;
  sockets[socket.id] = socket;

  socket.write('Welcome!\n');

  socket.on('data', (data) => {
    console.log('data!', data);
    console.log('sockets!', sockets.id);

    Object.entries(sockets).forEach(([,cs]) => {
      // console.log('cs!', cs);
        cs.write(`${socket.id}:`);
        cs.write(data);
    });
  });

socket.on('error', (err)=>{
  console.log('ERROR!!', err);
});

  socket.on('end', ()=>{
    delete sockets[socket.id];
    console.log('User is disconected!');
  });

});

server.listen(8000, ()=>{ console.log('Server run on 8000')});
