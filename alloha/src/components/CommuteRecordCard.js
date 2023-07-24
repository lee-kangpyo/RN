import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';

export default function CommuteRecordCard({record, btntxt, onButtonPressed}) {
    const name = (record.JOBYN === "Y")?"출근":"퇴근"
    return (
        <>
            <View style={styles.card}>
                <Text style={styles.card_title}>상태 : {name}</Text>
                <Text style={styles.card_txt}>시간 : {record.CHKTIME}</Text>
                <Text style={styles.card_txt}>승인여부{record.APVYN}</Text>
                <CustomBtn txt={btntxt} onPress={()=>{onButtonPressed()}} style={styles.btn} color='black' fSize={16}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        width:"100%",
        padding:8,
        marginBottom:8,
        borderColor:theme.grey,
        borderWidth:1,
        borderRadius:5,
    },
    card_title:{
        fontSize:20
    },
    card_txt:{
        fontSize:16,
        color:theme.darkGrey
    },
    btn:{
        alignSelf:"flex-end",
        backgroundColor:"white",
        width:120,
        height:40
    }
  });
  