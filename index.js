
const http = require('http');
const app = require('./app');




const server = http.createServer(app);


server.on('listening', () => {

    console.log('Listening on' + ' 3000')
})

server.listen(3000)