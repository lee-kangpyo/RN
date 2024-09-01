import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';
import { useNavigation } from '@react-navigation/native';
import { addComma } from './../util/utils';
import { AntDesign } from '@expo/vector-icons';

export default function WageCard({item, salaryWeek, userType, onPress}) {
    const getWeekWage = () => {
        return salaryWeek.reduce((result, next) => {
            if(next.isAbsent == "N"){
                result += next.WEEKWAGE;
            }
            return result;
        }, 0)
    }
    const navigation = useNavigation();
    const title = (userType == "crew")?item.cstNa:item.userNa;
    const rtCl = item.rtCl;
    const statNa = (rtCl == "N")?"재직중":(rtCl == "Y")?"퇴직중":(rtCl == "R")?"입사요청중":""
    return (
        <>
            <TouchableOpacity onPress={()=>onPress(item)}>
                <View style={styles.card}>
                    <View style={[styles.row, {paddingHorizontal:15, paddingVertical:10}]}>
                        <View style={[styles.cardTitle_block, {marginRight:8}]}>
                            <Text style={fonts.card_title}>{title} </Text>
                            {/* <Text style={styles.card_txt}>{item.jobType} ({item.jobTraget}시간)</Text> */}
                        </View>
                        <StatusBox statNa={statNa} />
                    </View>
                    <View style={styles.sepH} />
                    <View style={styles.contentBox}>
                        <View style={[styles.card_block, styles.mb12]}>
                            <Text style={fonts.content}>기본급</Text>
                            <View style={{flexDirection:"row"}}>
                                <Text style={fonts.content2}>{(item.JOBTYPE == "H")?"시급":"월급"}</Text>
                                <View style={{width:4}} />
                                <Text style={fonts.content2}>{addComma(item.BASICWAGE)}원</Text>

                            </View>
                        </View>
                        <View style={[styles.card_block, styles.mb12]}>
                            <Text style={fonts.content}>근무</Text>
                            <Text style={fonts.content2}>{item.jobDure}시간 - {addComma(item.jobWage)}원</Text>
                        </View>

                        <View style={[styles.card_block, styles.mb12]}>
                            <Text style={fonts.content}>대타</Text>
                            <Text style={fonts.content2}>{item.spcDure}시간 - {addComma(item.spcWage)}원</Text>
                        </View>
                        {
                            (item.JOBTYPE == "H" && item.WEEKWAGEYN == 'Y')?
                                <View style={[styles.card_block, styles.mb12]}>
                                    <Text style={fonts.content}>주휴수당</Text>
                                    <Text style={fonts.content2}>{addComma(getWeekWage())}원</Text>
                                </View>
                            :(item.JOBTYPE == "M")?
                                <View style={[styles.card_block, styles.mb12]}>
                                    <Text style={fonts.content}>식대</Text>
                                    <Text style={fonts.content2}>{addComma(item.MEALALLOWANCE)}원</Text>
                                </View>
                            :null
                        }
                        {
                            (item.JOBTYPE == "H" && item.WEEKWAGEYN == 'Y')?
                                <View style={styles.card_block}>
                                    <Text style={fonts.content}>총급여</Text>
                                    <Text style={fonts.content2}>{addComma(item.jobWage + item.spcWage + getWeekWage())}원</Text>
                                </View>
                            :(item.JOBTYPE == "H" && item.WEEKWAGEYN == 'N')?
                                <View style={styles.card_block}>
                                    <Text style={fonts.content}>총급여</Text>
                                    <Text style={fonts.content2}>{addComma(item.jobWage + item.spcWage)}원</Text>
                                </View>
                            :(item.JOBTYPE == "M")?
                                <View style={styles.card_block}>
                                    <Text style={fonts.content}>총급여</Text>
                                    <Text style={fonts.content2}>{addComma(item.BASICWAGE + item.MEALALLOWANCE)}원</Text>
                                </View>
                            :null
                        }
                        
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
}

function StatusBox ({statNa}){
    const color = (statNa == "재직중")?'#3479EF':(statNa=="퇴직중")?theme.error:(statNa=="입사요청중")?theme.grey:theme.purple
    return(
        <View style={{flexDirection:"row", alignItems:"center"}}>
            <AntDesign name="checkcircle" size={16} color={color} style={[styles.circle, {marginRight:4}]}/>
            <Text style={[fonts.statusText, {color:color}]}>{statNa}</Text>
        </View>
    );
}

const fonts = StyleSheet.create({
    card_title:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111111"
    },
    statusText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
    },
    content:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#777777"
    },
    content2:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#111111"
    }
})
const styles = StyleSheet.create({
    card: {
        marginBottom:13,
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
                elevation :1,
            }
        })
    },
    cardTitle_block:{
        flexDirection:"row", 
        justifyContent:"flex-start",
        verticalAlign:'bottom'
    },
    card_block:{
        flexDirection:"row", 
        justifyContent:"space-between",
        verticalAlign:'bottom'
    },
    card_block_space_between:{
        flexDirection:"row", 
        justifyContent:"space-between"
    },
    
    card_txt:{
        fontSize:16,
        color:theme.blurblack,
        lineHeight:18,
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
    },
    row:{
        flexDirection:"row"
    },
    contentBox:{
        paddingVertical:20,
        paddingHorizontal:15,
    },
    sepH:{
        borderWidth:0.3,
        borderColor:"#EEE"
    },
    mb12:{
        marginBottom:12
    }

  });
  