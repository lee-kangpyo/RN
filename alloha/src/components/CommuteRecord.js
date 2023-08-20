import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';

export default function CommuteRecord({record, btntxt, onButtonPressed}) {
    const jobClNa = (record.jobCl === "G")?"일반":(record.jobCl === "S")?"특근":"야근"
    const name = (record.stat === "I")?"출근":"퇴근"
    const color = (record.stat === "I")?theme.primary:theme.error
    return (
        <>
            <View style={styles.card}>
                <Text style={{...styles.card_txt, color:color}}>{name}</Text>
                <View style={{flexDirection:"row"}}>
                    <Text style={{...styles.card_txt, color:color, marginRight:8}}>{jobClNa}</Text>
                    <Text style={{...styles.card_txt, color:color}}>{record.chkTime}</Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",
        padding:4,
        marginBottom:4,
        borderColor:theme.grey,
        borderWidth:1,
        borderRadius:5,
    },
    card_title:{
        fontSize:20
    },
    card_txt:{
        fontSize:16,
        color:theme.black,
    },
    btn:{
        alignSelf:"flex-end",
        backgroundColor:"white",
        width:120,
        height:40
    }
  });
  