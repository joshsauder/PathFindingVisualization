import { node } from '../models/Graph'
import { processNeighborNodes } from './BFS'
import { findNeighborNodes } from './Utils'

/**
 * Depth-First Search Finder
 * 
 * @param start - the starting node
 * @param end - the ending node
 * @param grid - the grid of nodes 
 * @returns - a list of nodes that were visited
 */
export function DepthFirstSearch(start: node, end: node, grid: node[][]): node[]{
    //set start and end weights to 0
    let sNode = grid[start.y][start.x]
    sNode.closed = true

    let visitedNodes: node[] = []
    let queuedNodes: node[] = []
    queuedNodes.push(sNode)

    while(queuedNodes.length > 0){
        for(let i = 0; i < queuedNodes.length; i++){
            let currentNode = queuedNodes.shift()!
            visitedNodes.push(currentNode)

            if(currentNode.key === end.key){
                return visitedNodes
            }

            let neighborNodes = findNeighborNodes(currentNode, grid[0].length, grid.length, grid)
            //process same way as BFS
            processNeighborNodes(neighborNodes, currentNode)

            queuedNodes.push(...neighborNodes)
        }
    }

    return visitedNodes
}