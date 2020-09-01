import { ML } from './Logger'
export class TimerQueue {

    private callAllowed: boolean = true
    private callQueue: unknown[][] = []

    constructor(private timeBetweenCalls_MS: number,
                private callback: (...args: unknown[]) => void) {}

    public queue = (...args: unknown[]): void => {
        
        this.callQueue.push(args)

        ML.log(`pushed to queue: ${args.join(', ')}`)

        ML.log(`this.callAllowed top: ${this.callAllowed}`)

        if (this.callAllowed) {
            ML.log('Call allowed, starting queue')
            this.startCallQueue()
        } else {
            ML.log('Call not allowed, pushing to queue')
        }
    }

    private startCallQueue = (): void => {
        
        ML.log('Starting Call Queue')
        ML.log(`Current Length: ${this.callQueue.length}`)
        this.callAllowed = false
        this.callback(...this.callQueue.shift())

        ML.log(`this.callAllowed outside: ${this.callAllowed}`)

        ML.log(`Setting timeout: ${this.timeBetweenCalls_MS}ms`)
        setTimeout(() => {
            ML.log(`Timeout reached! Current length: ${this.callQueue.length}`)
            this.callAllowed = true
            ML.log(`this.callAllowed inside: ${this.callAllowed}`)
            if (this.callQueue.length > 0) {
                this.startCallQueue()
            }
        }, this.timeBetweenCalls_MS)
    }
}