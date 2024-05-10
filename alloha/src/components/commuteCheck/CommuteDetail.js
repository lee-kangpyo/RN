
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { HTTP } from '../../util/http';
import { FontAwesome, Feather  } from '@expo/vector-icons';
import { theme } from '../../util/color';

export default function CommuteDetail({day}) {
    const userId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const [loading, setLoadin] = useState(true);
    const [jobDetailInfo, setJobDetailInfo] = useState([]);

    const dayJobSearch = async () => {
        await HTTP("GET", "/api/v1/commute/jobDetailInfo", {cls:"jobDetailInfo", userId:userId, cstCo:sCstCo, ymdFr:day, ymdTo:day})
        .then((res)=>{
            console.log(res.data.result)
            setJobDetailInfo(res.data.result);
            setLoadin(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        //setLoadin(true);
        dayJobSearch();
    }, [])
    return(
        <>
         {
            (loading || jobDetailInfo.length == 0)?
                null
            :
            <>
            <ScrollView contentContainerStyle={{paddingBottom:15}} style={[styles.card, {flex:1}]}>
                <View>
                {
                    jobDetailInfo.map((el, idx)=>{
                        return <BottomItem key={idx} data={el} isLast={jobDetailInfo.length == idx + 1} />
                    })
                }
                </View>
            </ScrollView>
            
            </>
         }
         </>   
        
    )
}

const BottomItem = ({data, isLast}) => {
    return(
        <View style={[styles.bItemContainer, styles.row, {alignItems:"flex-start"}]}>
            <View>
                <View style={{alignItems:"center", justifyContent:"center", zIndex:5}}>
                    <FontAwesome name="circle" size={30} color={theme.primary} style={{ zIndex:5}}/>
                    <Feather name="check" size={16} color="white" style={{position:"absolute",  zIndex:10,}} />
                </View>
                {
                    (!isLast)?<View style={[{height:"100%", width:0, borderWidth: 0.5,borderColor: "rgba(221, 221, 221, 1.0)", position:"absolute", top:15, left:12}]} />:null
                }
            </View>
            <View style={{marginLeft:12, marginTop:8}}>
                <View style={styles.row}>
                    <Text style={fonts.evtNa}>{data.evtNa} </Text>
                    <Text style={fonts.evtNa}>({data.jobType})</Text>
                    <View style={styles.sep}/>
                    <Text style={fonts.evtTime}>{data.evtTime}</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode='tail' style={fonts.address}>{data.address}</Text>
            </View>
        </View>
    )
}

const fonts = StyleSheet.create({
    evtNa:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 14,
        fontWeight: "600",
        color: "#333333"
    },
    evtTime:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        fontWeight: "500",
        color: "#777777"
    },
    address:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        fontWeight: "400",
        color: "#999999"
    }
})


const styles = StyleSheet.create({
    card:{
        width:"100%",
        padding:15,
        marginBottom:10,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.05)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1
            },
            android:{
                elevation :2,
            }
        })
    },
    row:{ flexDirection:"row", },
    bItemContainer:{
        paddingHorizontal:15,
        paddingVertical:5,
        height:80,
    },
    
    sep:{
        marginHorizontal:5,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    }
});