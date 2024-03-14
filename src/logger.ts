const pino = require("pino")

export default pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})