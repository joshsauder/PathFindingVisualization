import { node } from '../models/Graph'
import { findNeighborNodes } from './Utils'


/**
 * Breadth-First Search Finder
 * 
 * @param start - the starting node
 * @param end - the ending node
 * @param grid - the grid of nodes 
 * @returns - a list of nodes that were visited
 */
export function BreadthFirstSearch(start: node, end: node, grid: node[][]): node[]{
    //set up a queue
    //push to enqueue, and shift to dequeue
    let queuedNodes: node[] = []
    let visitedNodes: node[] = []

    //set start and end weights to 0
    let sNode = grid[start.y][start.x]
    sNode.closed = true
    
    queuedNodes.push(sNode)

    while(queuedNodes.length > 0){
        let currentNode = queuedNodes.shift()!
        visitedNodes.push(currentNode)

        if(currentNode.key === end.key){
            return visitedNodes
        }

        const neighborNodes = findNeighborNodes(currentNode, grid[0].length, grid.length, grid)
        processNeighborNodes(neighborNodes, currentNode)
        queuedNodes.push(...neighborNodes)

    }

    return visitedNodes
}

/**
 * >>> Used for BFS and DFS ONLY <<<
 * >>> A* and Dijkstra's processNeighborNode function can be found in the AStar.ts file <<<
 * Prevents each neighbor node from being processed again 
 * Sets the previous node to the current node
 * 
 * @param neighborNodes - Array of neighbor nodes to the current node
 * @param currentNode - the current node that is opened
 */
export function processNeighborNodes(neighborNodes: node[], currentNode: node){
    neighborNodes.forEach(node => {
        node.closed = true
        node.previous = currentNode
    })
}