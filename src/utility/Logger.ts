const logger = require('winston')

export class Logger {

    constructor() {
        // get command line arguments
        const myArgs: string[] = process.argv.slice(2);
        console.log('myArgs: ', myArgs);

        // Configure logger settings
        logger.remove(logger.transports.Console);
        logger.add(new logger.transports.Console, {
            colorize: true
        });

        logger.level = 'debug'
    }

    public log(text: string): void {
        logger.info(text)
    }

}