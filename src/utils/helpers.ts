const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms))

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

export { wait, easeOutQuart }
