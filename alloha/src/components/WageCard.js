import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { theme } from '../util/color';
import CustomBtn from './CustomBtn';
import { useNavigation } from '@react-navigation/native';
import { addComma } from './../util/utils';

export default function WageCard({item, userType, onPress}) {
    const navigation = useNavigation();
    const title = (userType == "crew")?item.cstNa:item.userNa;
    const rtCl = item.rtCl;
    const statNa = (rtCl == "N")?"재직중":(rtCl == "Y")?"퇴직중":(rtCl == "R")?"입사요청중":""
    return (
        <>
            <TouchableOpacity onPress={()=>onPress({title:title, cstCo:item.cstCo, userId:item.userId})}>
                <View style={styles.card}>
                    <View style={styles.card_block_space_between}>
                        <View style={styles.card_block}>
                            <Text style={styles.card_title}>{title} </Text>
                            <Text style={styles.card_txt}>{item.jobType} ({item.jobTraget}시간)</Text>
                        </View>
                        <StatusBox statNa={statNa} />
                    </View>
                    <View style={styles.card_block}>
                        <Text style={styles.card_txt}>시간당 수당 : </Text>
                        <Text style={styles.card_txt}>{addComma(item.wage)}원</Text>
                    </View>
                    <View style={styles.card_block}>
                        <Text style={styles.card_txt}>근무시간 : </Text>
                        <Text style={styles.card_txt}>{item.jobDure} - {addComma(item.jobWage)}원</Text>
                    </View>

                    <View style={styles.card_block}>
                        <Text style={styles.card_txt}>특근시간 : </Text>
                        <Text style={styles.card_txt}>{item.spcDure} - {addComma(item.spcWage)}원</Text>
                    </View>

                    <View style={styles.card_block}>
                        <Text style={styles.card_txt}>주휴수당 : </Text>
                        <Text style={styles.card_txt}>{addComma(item.weekWage)}원</Text>
                    </View>

                    <View style={styles.card_block}>
                        <Text style={styles.card_txt}>총급여 : </Text>
                        <Text style={styles.card_txt}>{addComma(item.salary)}원(추가수당 : {addComma(item.incentive)}원)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
        </>
    );
}

function StatusBox ({statNa}){
    const color = (statNa == "재직중")?theme.primary:(statNa=="퇴직중")?theme.error:(statNa=="입사요청중")?theme.grey:theme.purple
    return(
        <View style={{padding:2, borderColor:theme.grey, borderWidth:1, borderRadius:8, }}>
            <Text style={{fontSize:10, color:color}}>{statNa}</Text>
        </View>
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
    card_block:{
        flexDirection:"row", 
        justifyContent:"flex-start",
        verticalAlign:'bottom'
    },
    card_block_space_between:{
        flexDirection:"row", 
        justifyContent:"space-between"
    },
    card_title:{
        fontSize:20,
        color:theme.black,
        lineHeight:20,
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
    }

  });
  