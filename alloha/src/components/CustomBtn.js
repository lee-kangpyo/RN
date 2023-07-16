import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function CustomBtn({onPress, txt, style, fSize=24, color="#fff"}) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={{...styles.button, ...style}} onPress={onPress}>
        <Text style={{color:color, fontSize:fSize}}>{txt}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
   button: {
      height: 50,
      borderRadius:5,
      backgroundColor: "#fe5746",
      justifyContent: "center",
      alignItems: "center",
    },
  });
  