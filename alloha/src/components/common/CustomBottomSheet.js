import React, { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';

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