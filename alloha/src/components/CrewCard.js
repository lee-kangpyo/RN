import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';

export default function CrewCard({crew, applyBtntxt, denyBtnTxt, retirementBtnTxt, onApplyButtonPressed, onDenyButtonPressed, onRetirementButtonPressed}) {
    console.log(crew);

    const statNa = (crew.RTCL == "R")?"요청중":(crew.RTCL == "N")?"재직":"퇴직";
    return (
        <>
            <View style={styles.card}>
                <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={styles.card_title}>이름 : {crew.USERNA}</Text>
                    <Text style={styles.card_title}>{statNa}</Text>
                </View>
                <Text style={styles.card_txt}>점포명 : {crew.CSTNA}</Text>
                <View style={{flex:1, flexDirection:"row", justifyContent:"flex-end"}}>
                    {
                        (crew.RTCL == "R")?
                        <>
                            <CustomBtn txt={applyBtntxt} onPress={()=>{onApplyButtonPressed(crew.CSTCO, crew.USERID)}} style={styles.btn} color='black' fSize={16}/>
                            <CustomBtn txt={denyBtnTxt} onPress={()=>{onDenyButtonPressed(crew.CSTCO, crew.USERID)}} style={{...styles.btn, ...styles.denyBtn}} color='white' fSize={16}/>    
                        </>
                        :
                        <CustomBtn txt={retirementBtnTxt} onPress={()=>{onRetirementButtonPressed(crew.CSTCO, crew.USERID)}} style={{...styles.btn, ...styles.retireBtn}} color='white' fSize={16}/>
                        
                    }
                    
                    
                </View>
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
        width:80,
        height:40,
    },
    retireBtn:{
        backgroundColor:theme.purple,
        marginLeft:8,
    },
    denyBtn:{
        backgroundColor:theme.red,
        marginLeft:8,
    }

  });
  