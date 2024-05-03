import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';
import crewReq from '../../assets/icons/crew_req.png'
import crewAbsent from '../../assets/icons/crew_absent.png'
import crewBan from '../../assets/icons/crew_ban.png'

export default function CrewCard({crew, applyBtntxt, denyBtnTxt, retirementBtnTxt, modifyBtnTxt, onApplyButtonPressed, onDenyButtonPressed, onRetirementButtonPressed, onModifyButtonPressed}) {
    const statNa = (crew.RTCL == "R")?"요청중":(crew.RTCL == "N")?"재직":"퇴직";
    const statColor = (crew.RTCL == "R")?fonts.statNa_req:(crew.RTCL == "N")?fonts.statNa_absent:fonts.statNa_ban;
    const imgsrc = (crew.RTCL == "R")?crewReq:(crew.RTCL == "N")?crewAbsent:crewBan;
    return (
        <>
            <View style={styles.card}>
                <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={fonts.userNa}>{crew.USERNA}</Text>
                    <View style={styles.row}>
                        <Image source={imgsrc} style={styles.statIcon} />
                        <Text style={statColor}>{statNa}</Text>
                    </View>
                </View>
                <Text style={fonts.cstNa}>{crew.CSTNA}</Text>
                <View style={{flex:1, flexDirection:"row", marginTop:16}}>
                    {
                        (crew.RTCL == "R")?
                        <>
                            <CustomBtn txt={denyBtnTxt} onPress={()=>{onDenyButtonPressed(crew.CSTCO, crew.USERID)}} style={{...styles.btn, ...styles.denyBtn}} textStyle={fonts.btnStyle}/>    
                            <CustomBtn txt={applyBtntxt} onPress={()=>{onApplyButtonPressed(crew.CSTCO, crew.USERID)}} style={{...styles.btn, backgroundColor:"#3479EF", marginLeft:7}} textStyle={fonts.btnStyle}/>
                        </>
                        :
                        <>
                            <CustomBtn txt={modifyBtnTxt} onPress={()=>{onModifyButtonPressed(crew.CSTCO, crew.USERID, crew.USERNA)}} style={{...styles.btn, ...styles.retireBtn}} textStyle={{...fonts.btnStyle, color: "#999999"}}/>
                            <CustomBtn txt={retirementBtnTxt} onPress={()=>{onRetirementButtonPressed(crew.CSTCO, crew.USERID)}} style={{...styles.btn, ...styles.retireBtn, borderColor: "rgba(85, 85, 85, 1.0)"}} textStyle={{...fonts.btnStyle, color: "#555555"}}/>
                        </>
                    }
                </View>
            </View>
        </>
    );
}

const fonts = StyleSheet.create({
    userNa:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111111"
    },
    cstNa:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#999999"
    },
    statNa_absent:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#3479EF"
    },
    statNa_req:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#999999"
    },
    statNa_ban:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#777777"
    },
    btnStyle:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        color: "#FFFFFF"
    }
})

const styles = StyleSheet.create({
    card: {
        marginBottom:12,
        padding:20,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1,
            },
            android:{
                elevation :2,
            }
        })
    },
    card_title:{
        fontSize:20
    },
    card_txt:{
        fontSize:16,
        color:theme.darkGrey
    },
    btn:{
        borderRadius: 8,
        width:"50%",
        height:36,
    },
    retireBtn:{
        backgroundColor:"#fff",
        marginLeft:8,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"

    },
    denyBtn:{
        backgroundColor: "#555555"
    },
    statIcon:{
        width:16,
        height:16,
        marginRight:5
    },
    row:{flexDirection:"row"}

  });
  