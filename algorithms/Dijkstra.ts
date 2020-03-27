import Heap from 'heap'
import {node} from '../models/Graph'

export default class Dijkstra {
    
    findShortestPath(start: node, end: node, grid: node[][]): node[]{

        //sort by weight
        let queuedNodes = new Heap<node>(function(a, b){
            return a.weight - b.weight;
        })
        
        let visitedNodes: node[] = []

        //set starting node weight to 0
        start.weight = 0
        queuedNodes.push(start)



        while(queuedNodes.size() > 0){
            let openNode = queuedNodes.pop()

            if(openNode === end){return visitedNodes}

            let neighborNodes = this.findNeighborNodes(openNode, grid.length, grid[0].length, grid);

            neighborNodes.forEach(neighbor => {
                if(!neighbor.closed){
                    let weight = openNode.weight + 1
                    neighbor.weight = weight

                    queuedNodes.push(neighbor)
                }
            })

            openNode.closed = true
            visitedNodes.push(openNode)
        }

        return []
    }


    findNeighborNodes(node: node, width: number, height: number, allNodes: node[][]): node[]{
        let neighbors: node[] = []

        if(node.x + 1 < width){
            neighbors.push(allNodes[node.y][node.x+1])
        }

        if(node.x - 1 > -1){
            neighbors.push(allNodes[node.y][node.x-1])
        }

        if(node.y + 1 < height){
            neighbors.push(allNodes[node.y+1][node.x])
        }

        if(node.y - 1 > -1){
            neighbors.push(allNodes[node.y-1][node.x])
        }

        return neighbors.filter(node => node.closed == false)
    }

}