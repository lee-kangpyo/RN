import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';

export default function CrewCard({crew, btntxt, onButtonPressed}) {
    console.log(crew);

    const statNa = (crew.RTCL == "R")?"요청중":(crew.RTCL == "N")?"재직":"퇴직";
    return (
        <>
            <View style={styles.card}>
                <Text style={styles.card_title}>점포명 : {crew.CSTNA}</Text>
                <Text style={styles.card_txt}>이름 : {crew.USERNA}</Text>
                <Text style={styles.card_txt}>{statNa}</Text>
                <CustomBtn txt={btntxt} onPress={()=>{onButtonPressed(crew.CSTCO, crew.USERID)}} style={styles.btn} color='black' fSize={16}/>
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
  