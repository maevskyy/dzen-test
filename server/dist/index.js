"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const socket_io_1 = require("socket.io");
const multer_1 = require("./middlewares/multer");
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.dotenvConfig = dotenv_1.default.config();
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
        //check if env is alright
        if (this.dotenvConfig.error) {
            throw this.dotenvConfig.error;
        }
        this.config();
        this.rootRoutes();
        this.setupWebSocket();
        this.runServer();
    }
    config() {
        this.app.use(body_parser_1.default.json({ limit: '30mb' }));
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.text());
        this.app.use((0, cors_1.default)({
            origin: '',
            credentials: true
        }));
    }
    rootRoutes() {
        this.app.use('/comments?', commentRoute_1.default, multer_1.multerErrorHandler);
    }
    setupWebSocket() {
        // Обработка событий WebSocket
        this.io.on('connection', (socket) => {
            console.log('A user connected');
            // Пример обработки события от клиента
            socket.on('chat message', (msg) => {
                console.log(`message: ${msg}`);
                // Отправка сообщения всем подключенным клиентам
                this.io.emit('chat message', msg);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
    runServer() {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }
}
new App(8888);
