import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native'
import Style from '../../styles/Grid'

interface props {
    id: string
    onSelect: (id: string) => void
    selected: boolean
    forwardRef: any 
}

export default function Item(props: props){

    const [color] = useState(new Animated.Value(0))
    const [rotate] = useState(new Animated.Value(0))

    useEffect(() => {
        //if selected switch, else if unselected need to switch back
        if(props.selected){
            Animated.timing(
                color,
                { toValue: -2, duration: 410, useNativeDriver: true }
            ).start()
        }else if(!props.selected && (color as any)._value === -2){
            Animated.timing(
                color,
                { toValue: 0, duration: 410, useNativeDriver: true }
            ).start()
        }
    }, [props.selected])

    //add reference to each node in graph
    props.forwardRef((value: number) => animateColor(value))
    
    //color changing animations
    var bgColor = color.interpolate({
        inputRange: [ -2,-1,0, 1, 2],
        outputRange: ['#FFCA28','#F06292' ,'#9575CD', 'white', '#210B2C']
    })

    //rotation animation
    var bgRotate = rotate.interpolate({
        inputRange: [0, 100],
        outputRange: ['0deg', '360deg']
    })

    //change color and rotate at once.
    function animateColor(value: number){
        if(!props.selected){
            Animated.parallel([
                Animated.timing(
                    color,
                    { toValue: value, duration: 500, useNativeDriver: true}
                ),
                Animated.timing(
                    rotate,
                    { toValue: 100, duration: 500, useNativeDriver: true } 
                )
            ]).start()
        }
    }

    return (
        <TouchableOpacity 
        onPress={() => props.onSelect(props.id)}
        style={[Style.Item, {height: Dimensions.get('window').height / 42}]}>
            <View style={Style.View} >
                <Animated.View 
                    style={[Style.View, 
                        {backgroundColor: bgColor, 
                        transform: [{ rotate: bgRotate  }]}]} 
                    />
            </View>
        </TouchableOpacity>
    )
}
