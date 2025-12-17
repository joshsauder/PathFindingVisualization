import { Button, ButtonText } from '@/components/ui/button';
import React from "react";
import { View } from 'react-native';
import Styles from '../../styles/TopNav';

interface props {
    onSubmit: () => void
    onReset: () => void
    step: number
}

export default function BottomNav({onSubmit, onReset, step}: props){

    return (
        <View style={Styles.buttonMargin}>
            <View style={Styles.buttonMargin}>
                <Button variant="solid" size="md" onPress={onSubmit} isDisabled={step !== 3}><ButtonText>Find Path</ButtonText></Button>
            </View>
            <View>
                <Button variant="solid" size="md" onPress={onReset} isDisabled={step === 5}><ButtonText>Reset</ButtonText></Button>
            </View>
        </View>
    )
}