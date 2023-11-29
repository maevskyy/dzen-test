import express, { Express } from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import http from 'http'
import dotenv, { DotenvConfigOutput } from 'dotenv'

import userRoutes from './routes/userRoute'
import commentRoutes from './routes/commentRoute'
import { Server, Socket } from 'socket.io';
import { multerErrorHandler, multerMiddleware } from './middlewares/multer';

class App {
    private app: Express;
    private dotenvConfig: DotenvConfigOutput;
    private server: http.Server;
    private io: Server;
    private port: number;

    constructor(port: number) {
        this.app = express()
        this.port = port
        this.dotenvConfig = dotenv.config()

        this.server = http.createServer(this.app);
        this.io = new Server(this.server);

        //check if env is alright
        if (this.dotenvConfig.error) {
            throw this.dotenvConfig.error;
        }

        this.config()
        this.rootRoutes()
        this.setupWebSocket();
        this.runServer();

    }
    private config() {
        this.app.use(bodyParser.json({ limit: '30mb' }))
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.text());

        this.app.use(cors({
            origin: '',
            credentials: true
        }))
    }

    private rootRoutes() {
        this.app.use('/users?', userRoutes, multerErrorHandler)
        this.app.use('/comments?', commentRoutes, multerErrorHandler)
    }

    private setupWebSocket() {
        // Обработка событий WebSocket
        this.io.on('connection', (socket: Socket) => {
            console.log('A user connected');

            // Пример обработки события от клиента
            socket.on('chat message', (msg: string) => {
                console.log(`message: ${msg}`);
                // Отправка сообщения всем подключенным клиентам
                this.io.emit('chat message', msg);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

    private runServer() {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }

}

new App(8888)