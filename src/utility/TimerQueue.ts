export class TimerQueue {

    constructor(private timeBetweenCalls: number,
                private callback: () => any) {}

    
}