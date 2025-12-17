import React, { useState } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import ButtonView from './components/BottomNav/ButtonView';
import Grid from './components/Grid/Grid';
import Nav from './components/TopNav/Nav';

import Style from './styles/App';


export default function App() {

  const [algorithm, setAlgorithm] = useState('Dijkstra')
  const [step, setStep] = useState(1)

  return (
    <SafeAreaView style={Style.background}>
      <View style={[Style.header, {width: Dimensions.get('window').width - 10 }]}>
        <Nav algorithm={algorithm} setAlgorithm={(value: string) => setAlgorithm(value)} step={step} />
        <Grid algorithm={algorithm} setStep={(step: number) => setStep(step)} step={step} />
        <ButtonView onSubmit={() => setStep(4)} onReset={() => setStep(1)} step={step}/>
      </View>
    </SafeAreaView>
  );
}
