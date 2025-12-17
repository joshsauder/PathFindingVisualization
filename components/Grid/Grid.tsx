import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { AStar, TwoWayAStar } from '../../algorithms/AStar';
import { BreadthFirstSearch } from '../../algorithms/BFS';
import { DepthFirstSearch } from '../../algorithms/DFS';
import { Dijkstras, TwoWayDijkstra } from '../../algorithms/Dijkstra';
import { getPathInOrder } from '../../algorithms/Utils';
import { createNode, node } from '../../models/Graph';
import Style from '../../styles/Grid';
import Item from "./Item";

interface State {
    numCols: number,
    start: node | undefined,
    end: node | undefined,
    graph: node[][],
}

interface Props {
    algorithm: string
    setStep: (step: number) => void
    step: number
}

export default class Grid extends Component<Props, State> {
    itemRefs: any;
    wallRefs: any;

    constructor(props: Props){
        super(props)
        this.state = {
            numCols: 20,
            start: undefined,
            end: undefined,
            graph: []
        }

        this.itemRefs = {}
        this.wallRefs = {}
    }

    componentDidMount(){
        this.setupGrid()
    }

    componentDidUpdate(prevProps: Props, prevState: State){
        if(this.props.step === 4 && prevProps.step !== this.props.step){
            this.determinePath()
        }
        else if(this.props.step === 1 && prevProps.step !== this.props.step){
            //reset button pushed
            this.resetToInit()
        }
    }

    setupGrid = () => {
        //500 nodes in total
        this.setState(state => {
            for(let r = 0; r < 25; r++){
                let row: node[] = []
                for(let c = 0; c < this.state.numCols; c++){
                    row.push(createNode(`${c},${r}`, c, r))
                }
                state.graph.push(row)
            }

            return state
        })
    }

    resetToInit = () => {
        //callback needed to reset grid
        this.setState({start: undefined, end: undefined, graph: []}, () => {
            this.setupGrid()
        })
    }

    determinePath = () => {
        let {start, end, graph} = this.state
        let visitedNodes: node[]

        //prevent reset of submission
        this.props.setStep(5)

        switch(this.props.algorithm){
            case "Dijkstra":
                visitedNodes = Dijkstras(start!, end!, graph)
                this.processUnidirectional(visitedNodes, end!)
                break;

            case "BiD":
                visitedNodes = TwoWayDijkstra(start!, end!, graph)
                this.processBidirectional(visitedNodes)
                break;
            
            case "BFS":
                visitedNodes = BreadthFirstSearch(start!, end!, graph)
                this.processUnidirectional(visitedNodes, end!)
                break;
            
            case "A*":
                visitedNodes = AStar(start!, end!, graph)
                this.processUnidirectional(visitedNodes, end!)
                break;
            
            case "BA*":
                visitedNodes = TwoWayAStar(start!, end!, graph)
                this.processBidirectional(visitedNodes)
                break;

            case "DFS":
                visitedNodes = DepthFirstSearch(start!, end!, graph)
                this.processUnidirectional(visitedNodes, end!)
                break;
        }
    }

    processUnidirectional = (visitedNodes: node[], end: node) => {
        if(visitedNodes.length > 0){
            //check if path was found
            let path = visitedNodes[visitedNodes.length-1].key === end.key ? getPathInOrder(visitedNodes.pop()!) : []
            this.highLightGrid(path, visitedNodes)
        }else {this.props.setStep(6)}
    }

    processBidirectional = (visitedNodes: node[]) => {
        if(visitedNodes.length > 0){
            let start = visitedNodes[visitedNodes.length -2]
            let end = visitedNodes[visitedNodes.length -1]
            //check if path was found
            if(start.key === end.key || (start.previous && start.previous.key === end.key)){
                let endpath = getPathInOrder(visitedNodes.pop()!)
                let startpath = getPathInOrder(visitedNodes.pop()!)
                this.highLightGrid([...startpath, ...endpath], visitedNodes)
            }else {
                this.highLightGrid([], visitedNodes)
            }
        }else {this.props.setStep(6)}
    }

    highLightGrid = (path: node[], visitiedNodes: node[]) => {
        //change background color by reference. See setReference() for reason why this is done.
        //after completion setStep to 4 and allow reset and submission
        visitiedNodes.forEach((node, index) => {
            setTimeout(() => {
                this.itemRefs[node.key](-1)
                if(path.length === 0) {this.props.setStep(6)}
            }, 70*index)
        })

        path.forEach((node, index) => {
            setTimeout(() => {
                this.itemRefs[node.key](1)
                //reenable submit and reset buttons
                if(index === path.length-1) {this.props.setStep(6)}
            }, 70*(index + visitiedNodes.length))
        })
    }

    itemSelected = (id: string) => {
        if(this.props.step === 4) return;

        let {start, end, graph } = this.state
        let coordinates = id.split(',')
        let selectedNode = createNode(id, parseInt(coordinates[0]), parseInt(coordinates[1]))

        //need to check if start or end is added and if node clicked is the current start and ending node.
        if(start && end && start.key !== id && end.key !== id){
            this.itemRefs[id](2)
            selectedNode.wall = true
            graph[selectedNode.y][selectedNode.x] = selectedNode
        }else {
            if(start === undefined){
                this.setState({start: {...selectedNode}})
                this.props.setStep(2)
            }else if(start.key === id){
                this.setState({start: undefined})
                this.props.setStep(1)
            }else if(end === undefined){
                this.setState({end: {...selectedNode}})
                this.props.setStep(3)
            }else {
                //case where selected node is the end node
                this.setState({end: undefined})
                this.props.setStep(2)
            }
        }
    }

    renderData = (): node[] => {
        let nodes: node[] = []
        this.state.graph.forEach(row => {
            nodes = nodes.concat(row)
        })

        return nodes
    }

    setReference = (item: (value: number) => void, id: string): void =>{
        //this.setState is not optimal for changing the background color one-by-one of many nodes.
        //changing by reference is much more optimal
        this.itemRefs[id] = item
    }

    render(){
        let {start, end} = this.state
        return (
                <FlatList
                style={Style.MainContainer}
                data= {this.renderData()}
                scrollEnabled = {false}
                renderItem={({item}) =>
                    <Item id={item.key}
                        onSelect={this.itemSelected}
                        selected={!!((start && start.key === item.key) || (end && end.key === item.key))}
                        forwardRef={(c: (value: number) => void) => {this.setReference(c, item.key)}}
                        />}
                numColumns={this.state.numCols}
                extraData={this.state}
                keyExtractor={(item) => item.key}
                />
        )
    }
}