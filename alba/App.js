import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/screen/Main';
import React, {useCallback, useRef, useState} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function App() {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  //const snapPoints = ["0%", "50%", "100%"]
  const snapPoints = ["40%"]

  return (
    
      <View style={styles.container}>
        <Text>asfd</Text>
        <GestureHandlerRootView style={{flex:1}}>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={()=>setIsOpen(false)}
        >
          <BottomSheetView>
            <Text>helo</Text>
          </BottomSheetView>
        </BottomSheet>
        </GestureHandlerRootView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

