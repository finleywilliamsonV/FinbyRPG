import logger = require('winston')

export type MasterLogger = {
    log: (text: string) => void
}

export const ML: MasterLogger = ((): MasterLogger => {

    let logger: Logger

    const initLogger = (): void => {
        logger = new Logger()
    }

    return {

        log(text: string): void {
            if (!logger) {
                initLogger()
            }
            logger.log(text)
        }
     }
})()


// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const TIME_BETWEEN_MESSAGES_MS: number = 1000

class Logger {

    private timeBeforeNextMessage: number = 0
    private messageAllowed: boolean = true
    private messageQueue: string[] = []
    
    constructor() {

        // get command line arguments
        const myArgs: string[] = process.argv.slice(2)
        console.log('myArgs: ', myArgs)

        // Configure logger settings
        logger.remove(logger.transports.Console)
        // logger.add(new logger.transports.Console, {
        //     colorize: true
        // })
        
        logger.add(new logger.transports.Console)

        logger.level = 'debug'
    }

    public log(text: string): void {

        logger.info(text)

        this.messageQueue.push(text)

        if (this.messageAllowed) {
            this.startMessageQueue()
        }
    }

    private startMessageQueue(): void {

        if (this.messageQueue.length <= 0) {
            throw new Error('Trying to start message queue with empty queue')
        }
        
        logger.info(this.messageQueue.shift())
        this.messageAllowed = false

        setTimeout(() => {
            this.messageAllowed = true
            if (this.messageQueue.length > 0) {
                this.startMessageQueue()
            }
        }, TIME_BETWEEN_MESSAGES_MS)
    }
}