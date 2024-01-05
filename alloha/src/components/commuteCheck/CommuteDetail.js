
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { HTTP } from '../../util/http';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../util/color';
import CustomButton from '../common/CustomButton';
import { getReverseGeocodeAsync } from '../../util/reverseGeocode';

export default function CommuteDetail({day, onModifyBtnpressed}) {
    const userId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const [loading, setLoadin] = useState(true);
    const [jobDetailInfo, setJobDetailInfo] = useState([]);

    const dayJobSearch = async () => {
        await HTTP("GET", "/api/v1/commute/jobDetailInfo", {cls:"jobDetailInfo", userId:userId, cstCo:sCstCo, ymdFr:day, ymdTo:day})
        .then((res)=>{
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
            <ScrollView style={[styles.card, {flex:1}]}>
                <Text style={{color:"grey", marginBottom:8}}>근무 상세 내역</Text>
                <View>
                {
                    jobDetailInfo.map((el, idx)=>{
                        return <BottomItem key={idx} data={el} isLast={jobDetailInfo.length == idx + 1} />
                    })
                }
                </View>
            </ScrollView>
            <CustomButton onClick={onModifyBtnpressed} text={"근무기록변경"} style={styles.btn}/>
            </>
         }
         </>   
        
    )
}

const BottomItem = ({data, isLast}) => {
    const style = (isLast)?{backgroundColor:"rgba(0,0,0,0)"}:{}
    return(
        <View style={[styles.bItemContainer, styles.row]}>
            <View>
                <FontAwesome name="circle" size={30} color={theme.purple} style={{paddingRight:24, marginBottom:-10, zIndex:5}}/>
                <View style={[{backgroundColor:"lightgrey", height:"100%", width:5, marginLeft:10}, style]} />
            </View>
            <View>
                <Text>{data.evtTime}</Text>
                <View style={styles.row}>
                    <Text>{data.evtNa} </Text>
                    <Text>({data.jobType})</Text>
                </View>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.address}>{data.address}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    card:{
        borderWidth:1,
        borderRadius:5,
        width:"100%",
        marginBottom:15, 
        padding:15,
    },
    row:{ flexDirection:"row", },
    bItemContainer:{
        paddingHorizontal:15,
        paddingVertical:5,
        height:80,
    },
    btn:{alignSelf:"flex-end"},
    address:{
        color:"grey"
    }
});