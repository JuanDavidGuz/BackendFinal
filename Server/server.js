const express = require('express')
require('dotenv').config()
const { dbConnection } = require('../database/config')
const cors = require('cors')

class Server {
    constructor(){
        this.header = {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            }
        }
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.paths = {
            auth: '/api/auth',
            post: '/api/post'
        }

        this.dbConnection();
        this.addmiddlewares();
        this.setroutes();
        this.sockets();
    }

    async dbConnection(){
        await dbConnection();
}

    addmiddlewares(){
        this.app.use(cors(this.header))
        this.app.use(express.static('public'))
       this.app.use(express.json());
    }

    sockets(){
        this.io.on('connection', socket =>{
            console.log('Cliente conectado', socket.id);
            socket.on('mensaje-de-cliente', (payload,callback) => {
                console.log(payload);

                callback('mensaje recibido')

                payload.from = 'desde el server'
                this.io.emit('mensaje-de-server', payload)
            })
            
            socket.on('disconnect', () => {
                console.log('Cliente desconectado', socket.id);
            })
        })
    }

    setroutes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.post, require('../routes/Post'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server listening on', this.port)
        })
    }

}

module.exports = Server;