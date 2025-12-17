export type node = {
    key: string
    x: number
    y: number
    previous: node | null
    heuristic: number
    g: number
    f: () => number
    wall: boolean
    open: boolean
    closed: boolean
}

/**
 * Creates a node given the key, x, and y values.
 *
 * @param key - the Nodes key
 * @param x - x value
 * @param y y value
 */
export function createNode(key: string, x: number, y :number): node{
    return {
        key: key,
        x: x,
        y: y,
        previous:null,
        closed: false,
        open: false,
        wall: false,
        heuristic: Infinity,
        g: Infinity,
        f: getF
    }
}

//Calculation F value for A*
function getF(): number {
    return this.heuristic + this.g
}