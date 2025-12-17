import React from "react";
import { View } from 'react-native';

import Styles from '../../styles/TopNav';
import AlgorithmPicker from "./AlgorithmPicker";
import SetupPoints from "./SetupPoints";

interface props {
    algorithm: string
    setAlgorithm: (value: string) => void
    step: number,
}

export default function Nav({algorithm, setAlgorithm, step}: props){

    return (
        <View style={Styles.container}>
            <View style={{flex:1}} className="mr-3">
                <AlgorithmPicker algorithm={algorithm} setAlgorithm={setAlgorithm}/>
            </View>
            <View style={{flex:1}}>
                <SetupPoints step={step} />
            </View>
        </View>
    )
}