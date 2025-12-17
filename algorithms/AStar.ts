import Heap from 'heap'
import { node } from '../models/Graph'
import { findNeighborNodes } from './Utils'

/**
 * A* Path Finder
 * 
 * @param start - the starting node
 * @param end - the ending node
 * @param grid - the grid of nodes 
 * @returns - a list of nodes that were visited
 */
export function AStar(start: node, end: node, grid: node[][], heuristic?: (currentNode: node, start: node, end: node) => number): node[]{
    //sort based on f value
    let queuedNodes = new Heap<node>(function(a: node, b: node){
        return a.f() - b.f()
    })

    let visitedNodes: node[] = []

    //set start node weight to 0
    let sNode = grid[start.y][start.x]
    sNode.g = 0
    sNode.heuristic = 0
    
    queuedNodes.push(sNode)

    while(queuedNodes.size() > 0){
        let current = queuedNodes.pop()!
        current.closed = true
        visitedNodes.push(current)

        if(current.key === end.key){
            return visitedNodes
        }

        var neighborNodes: node[] = findNeighborNodes(current, grid[0].length, grid.length, grid)
        processNeighborNodes(neighborNodes, queuedNodes, current, start, end, heuristic)
    }

    return visitedNodes  
}

export function TwoWayAStar(start: node, end: node, grid: node[][], heuristic?: (currentNode: node, start: node, end: node) => number): node[] {
    let queuedNodes = new Heap<node>(function (a: node, b: node) {
        return a.f() - b.f();
    })

    let reverseQueuedNodes = new Heap<node>(function (a: node, b: node) {
        return (a.heuristic + a.g) - (b.heuristic + b.g);
    })

    let reverseGrid = JSON.parse(JSON.stringify(grid))

    let visitedNodes: node[] = []
    //allows for constant time lookup
    let visitedKeys: { [key: string]: node } = {}

    //set start and end weights to 0
    let sNode = grid[start.y][start.x]
    sNode.g = 0
    sNode.heuristic = 0

    let eNode: node = reverseGrid[end.y][end.x]
    eNode.g = 0
    eNode.heuristic = 0

    //push start and end
    queuedNodes.push(sNode)
    reverseQueuedNodes.push(eNode)

    while (queuedNodes.size() > 0 && reverseQueuedNodes.size() > 0) {
        let startNode = queuedNodes.pop()!
        let reverseNode = reverseQueuedNodes.pop()!

        startNode.closed = true
        reverseNode.closed = true

        //check if node keys are in keys object
        if(visitedKeys[startNode.key] || visitedKeys[reverseNode.key]){
            //push applicable nodes and return
            visitedKeys[startNode.key] ? visitedNodes.push(startNode, visitedKeys[startNode.key]) : visitedNodes.push(reverseNode, visitedKeys[reverseNode.key])
            return visitedNodes
        }

        //find neighbor nodes for both the start and reverse nodes and process
        const neighborNodes = findNeighborNodes(startNode, grid[0].length, grid.length, grid);
        processNeighborNodes(neighborNodes, queuedNodes, startNode, start, end, heuristic)

        const reverseNeighborNodes = findNeighborNodes(reverseNode, reverseGrid[0].length, reverseGrid.length, reverseGrid);
        processNeighborNodes(reverseNeighborNodes, reverseQueuedNodes, reverseNode, end, start, heuristic)

        //add visitied nodes
        visitedNodes.push(startNode, reverseNode)
        visitedKeys[startNode.key] = startNode
        visitedKeys[reverseNode.key] = reverseNode

    }

    return visitedNodes
}

/**
 * Sets each Neighbor nodes previous node to the current node
 * Calculates the G and Hueristic values
 * Then pushes to Heap
 * 
 * @param neighborNodes - Array of neighbor nodes to the currentNode
 * @param queuedNodes - Min-Heap containing the queued nodes
 * @param currentNode - The current node 
 * @param start - Starting node
 * @param end - Ending node
 */
function processNeighborNodes(neighborNodes: node[], queuedNodes: Heap<node>, currentNode: node, start: node, end: node, heuristic?: (currentNode: node, start: node, end: node) => number){
    neighborNodes.forEach(node => {
        let nodeG = currentNode.g + 1
        
        if(!node.open || node.g > nodeG){
            node.previous = currentNode
            node.g = nodeG
            node.heuristic = heuristic ? heuristic(node, start, end) : getHueristic(node, start, end)

            // If it has not been opened, sets the open value to true and places node in the Heap. 
            // Else, it will update the node in the Heap.
            if(!node.open){
                node.open = true
                queuedNodes.push(node)
            }else {
                queuedNodes.updateItem(node)
            }
            
        }
    })
}

/**
 * Calculates the Hueristic using a tie breaker that gives preference to a path along a straight path from start to end
 * 
 * @param currentNode - The current node
 * @param start - The starting node
 * @param end - The ending node
 */
function getHueristic(currentNode: node, start: node, end: node){
    //get the Manhattan distance
    let dx = Math.abs(currentNode.x - end.x) 
    let dy = Math.abs(currentNode.y - end.y)

    //tie bracker that prefers straight lines
    //http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#breaking-ties
    let dx2 = Math.abs(currentNode.x- start.x)
    let dy2 = Math.abs(currentNode.y- start.y)
    let cross = Math.abs(dx*dy2 - dx2*dy)

    return dx + dy + cross*0.001
}
