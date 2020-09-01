import { TimerQueue } from './TimerQueue'
import logger = require('winston')

export type MasterLogger = {
    log: (text: string) => void
}

export const ML: MasterLogger = ((): MasterLogger => {

    let logger: Logger
    let logQueue: TimerQueue

    const initLogger = (): void => {
        logger = new Logger()
        logQueue = new TimerQueue(250, (message: string): void => logger.log(message))
    }

    return {
        log(message: string): void {
            if (!logger) {
                initLogger()
            }
            logQueue.queue(message)
        }
     }
})()

class Logger {
    
    constructor() {

        // get command line arguments
        const myArgs: string[] = process.argv.slice(2)
        console.log('myArgs: ', myArgs)

        // Configure logger settings
        logger.remove(logger.transports.Console)
        
        logger.add(new logger.transports.Console)

        logger.level = 'debug'
    }

    public log(message: string): void {
        console.log(message)
    }

    public info(message: string): void {
        logger.info(message)
    }
}