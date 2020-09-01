export class TimerQueue {

    private callAllowed: boolean = true
    private callQueue: unknown[][] = []

    constructor(private timeBetweenCalls_MS: number,
                private callback: (...args: unknown[]) => void) {}

    public queue = async (...args: unknown[]): Promise<void> => {
        
        this.callQueue.push(args)

        if (this.callAllowed) {
            await this.startCallQueue()
        }
    }

    private startCallQueue = async (): Promise<void> => {
        this.callAllowed = false
        this.callback(...this.callQueue.shift())

        return new Promise((resolve: () => void) => {
            setTimeout( async () => {
                this.callAllowed = true
                if (this.callQueue.length > 0) {
                    await this.startCallQueue()
                    resolve()
                }
            }, this.timeBetweenCalls_MS)
        })
    }
}