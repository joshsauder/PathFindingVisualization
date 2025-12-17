import { ChevronDownIcon } from '@/components/ui/icon';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectScrollView, SelectTrigger } from '@/components/ui/select';
import React from "react";

interface props {
    algorithm: string
    setAlgorithm: (value: string) => void
}

export default function AlgorithmPicker(props: props){

    return (
    <Select
        selectedValue={props.algorithm}
        onValueChange={(value: string) => props.setAlgorithm(value)}
    >
      <SelectTrigger variant="outline" size="md" className='justify-between'>
        <SelectInput placeholder="Select option" />
        <SelectIcon as={ChevronDownIcon} className='mr-1'/>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
            <SelectScrollView>
            <SelectItem label="Dijkstra" value="Dijkstra"/>
            <SelectItem label="Bidirectional Dijkstra" value="BiD" />
            <SelectItem label="A* (A Star)" value="A*" />
            <SelectItem label="Bidirectional A* (A Star)" value="BA*" />
            <SelectItem label="Breadth-First Search" value="BFS"/>
            <SelectItem label="Depth-First Search" value="DFS" />
            </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
    )
}