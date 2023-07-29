import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';

export default function CommuteRecord({record, btntxt, onButtonPressed}) {
    const name = (record.JOBYN === "Y")?"출근":"퇴근"
    const color = (record.JOBYN === "Y")?theme.primary:theme.error
    return (
        <>
            <View style={styles.card}>
                <Text style={{...styles.card_txt, color:color}}>{name}</Text>
                <Text style={{...styles.card_txt, color:color}}>{record.CHKTIME}</Text>
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
  