import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Dimensions, TouchableOpacity } from 'react-native';
import CustomBtn from '../components/CustomBtn';

import React, {useCallback, useRef, useState, useMemo} from 'react';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Agreement from '../components/login/Agreement';

const windowWidth = Dimensions.get('window').width;

export default function Main() {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const snapPoints = useMemo(() => ["45%"], []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current.snapToIndex(index);
    setIsOpen(true)
  }, []);

  const closesheet = useCallback(() => {
    sheetRef.current.close();
    setIsOpen(false)
  });

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        pressBehavior={'none'}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.titleArea}>
            <Text style={styles.title}>알바관리</Text>
            <Text>Ver 0.01</Text>
        </View>
        <View style={styles.btnGrp}>
            <CustomBtn txt="알바 로그인" onPress={()=>{}} style={styles.btn} color='black'/>
            <CustomBtn txt="구글 로그인" onPress={()=>{Alert.alert("알림", "준비중입니다.")}} style={styles.btn} color='black'/>
            <TouchableOpacity onPress={() => handleSnapPress(0)}>
              <Text style={styles.createAcc}>계정 만들기</Text>
            </TouchableOpacity>
        </View>
        
        <BotSheet 
          sheetRef={sheetRef} 
          snapPoints={snapPoints} 
          renderBackdrop={renderBackdrop} 
          setIsOpen={setIsOpen}
          Content={<Agreement closesheet={closesheet}/>}
        />
      </View>
    </GestureHandlerRootView>
  );
}

// 바텀 시트
const BotSheet = ({sheetRef, snapPoints, renderBackdrop, setIsOpen, Content}) => {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={()=>setIsOpen(false)}
      index={-1}
      backdropComponent={renderBackdrop}
    >
    <BottomSheetView>
      {Content}     
    </BottomSheetView>
  </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    width:windowWidth,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea:{
    flex:2,
    alignItems:"center",
    justifyContent:"center",
  },
  title:{
    fontSize:40,
    fontWeight:"400"
  },
  btnGrp:{
    flex:1,
  },
  btn:{
    width: 175,
    height: 43,
    backgroundColor: "#D9D9D9",
    marginBottom:16,
  },
  createAcc:{
    textDecorationLine:'underline',
    color:"grey",
    fontSize:16,
    textAlign:"center"
  }
});
