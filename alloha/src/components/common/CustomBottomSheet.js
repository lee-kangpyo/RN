import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, Dimensions, Text, Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';

export function EasyBottomSheet({isOpen, onClose, content, style = {}}){
  const windowHeight = Dimensions.get('window').height;
  const snapPointList = [windowHeight*0.40];

  // //바텀시트ref
  const sheetRef = useRef(null);
  // // 바터시트 움직이는거
  const handleSnapPress = useCallback((index) => {
      sheetRef.current.snapToIndex(index);
      Keyboard.dismiss();
  }, []);

  useEffect(()=>{
    console.log("easyBottomSheet")
    console.log(isOpen)
    if(isOpen){
      handleSnapPress(0);
    }else{
      handleSnapPress(-1);
    }
  }, [isOpen])

  return(
    <CustomBottomSheetNotClose 
      style={style}
      sheetRef={sheetRef} 
      snapPointList={snapPointList} 
      isBackdrop={true} 
      onBottomSheetChanged={()=>console.log("onBottomSheetChanged")}
      onClose={onClose}
      Content={content}
  />
  )
}

export function NumberBottomSheet({sheetRef, onBottomSheetChanged, onClose, Content, style}){
  const windowHeight = Dimensions.get('window').height;

  //const [bottomSheetIndex, setBottomSeetIndex] = useState(-1)
  //const sheetRef = useRef(null);
  return(
    <CustomBottomSheet 
      style={style}
      sheetRef={sheetRef} 
      snapPointList={[windowHeight*0.40]} 
      isBackdrop={false} 
      onBottomSheetChanged={onBottomSheetChanged}
      onClose={onClose}
      Content={Content}
    />
  )
}

export function ScheduleBottomSheet({sheetRef, onBottomSheetChanged, onClose, Content, style}){
  const windowHeight = Dimensions.get('window').height;
  return(
    <CustomBottomSheet 
      style={style}
      sheetRef={sheetRef} 
      snapPointList={[windowHeight*0.22]} 
      isBackdrop={false} 
      onBottomSheetChanged={onBottomSheetChanged}
      onClose={onClose}
      Content={Content}
    />
  )
}

export function CustomBottomSheetNotClose({sheetRef, snapPointList, isBackdrop = true, Content, onBottomSheetChanged, onClose, style={}}) {
  const snapPoints = useMemo(() => snapPointList, []);
  const backdropComponent = useCallback(
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
    <>
      <BottomSheet
        style={style}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        onClose={onClose}
        index={-1}
        onChange={onBottomSheetChanged}
        backdropComponent={(isBackdrop)?backdropComponent:null}
      >
        <BottomSheetView style={{flex:1}}>
          {Content}     
        </BottomSheetView>
      </BottomSheet>
    </>
  )
};

export default function CustomBottomSheet({sheetRef, snapPointList, isBackdrop = true, Content, onBottomSheetChanged, onClose, style={}}) {
  const snapPoints = useMemo(() => snapPointList, []);
  const backdropComponent = useCallback(
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
    <>
      <BottomSheet
        style={style}
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={onClose}
        index={-1}
        onChange={onBottomSheetChanged}
        backdropComponent={(isBackdrop)?backdropComponent:null}
        
      >
        <BottomSheetView style={{flex:1}}>
          {Content}     
        </BottomSheetView>
      </BottomSheet>
    </>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });