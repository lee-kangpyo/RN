
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../util/color';

export default function CustomStandardBtn ({text, onPress, disabled = false}) {
    return (
        <TouchableOpacity onPress={()=> onPress()} style={[styles.sendBtn, (disabled)?{backgroundColor:"#e1e1e1"}:{}]} disabled={disabled}>
            <Text style={fonts.sendBtnText}>{text}</Text>
        </TouchableOpacity>
    )
} 



const fonts = StyleSheet.create({
    sendBtnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#FFFFFF"
    },
})


const styles = StyleSheet.create({
    sendBtn:{
        alignItems:"center",
        padding:16,
        borderRadius: 10,
        backgroundColor: "#3479EF",
        marginBottom:16,
    },
   
})