
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { HTTP } from '../util/http';
import { addComma } from './../util/utils';
import Loading from '../components/Loding';

export default function WageDetailScreen({navigation, route}) {
    const [loading, setisLoading] = useState(true)
    const [detailInfo, setDetailInfo] = useState([])
    const [total, setTotal] = useState({})
    
    
    

    const getSalaryDetail = async () => {
        setisLoading(true);
        const params = {
            "userId":route.params.userId, 
            "cstCo":route.params.cstCo,
            "ymdFr":route.params.ymdFr,
            "ymdTo":route.params.ymdTo,
        };
        
        await HTTP("GET", "/api/v1/getSalaryDetail", params)
            .then((res)=>{
                setDetailInfo(res.data.salaryDetail);
                setTotal(res.data.salaryTotal);
                console.log(res.data.salaryTotal);
            }).finally(()=>{
                setisLoading(false);
            })
            
    }

    useEffect(()=>{
        navigation.setOptions({title:route.params.title})
    }, [navigation])

    useEffect(()=>{
        getSalaryDetail();
    }, [])


    const convertYMD = (ymd) => {
        const year = ymd.slice(0, 4);
        const month = ymd.slice(4, 6);
        const day = ymd.slice(6, 8);

        const date = new Date(`${year}-${month}-${day}`);
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

        const formattedDate = `${month}/${day} (${dayOfWeek})`;
        return formattedDate
    }

    return (
        <>
            {
                (loading)?
                    <Loading />
                :
                (detailInfo.length == 0)?
                    <View style={styles.container}>
                        <Text>급여 정보가 없습니다.</Text>
                    </View>
                :
                <>
                    <ScrollView>
                    {
                        detailInfo.sort((a, b) => a.ymd.localeCompare(b.ymd)).map((el, idx)=>{
                        return(
                                <View style={styles.detailList}>
                                    <Text>{convertYMD(el.ymd)} - {el.jobDure}시간</Text>
                                    <Text>급여 : {addComma(el.jobWage)}원</Text>
                                    <Text>상태 코드 : {el.stat}</Text>
                                </View>
                            )
                        })
                    }
                    </ScrollView>
                    <View style={styles.totalSalary}>
                        <Text>근무시간 : {total.aDure} / {total.nDure} - {addComma(total.gSalary)}원</Text>
                        <Text>특근시간 : {addComma(total.sSalary)}원</Text>
                        <Text>총급여 : {addComma(total.salary)}원</Text>
                    </View>
                </>
            }
        </>
    );
}
      
const styles = StyleSheet.create({
    container:{ 
        flex:1,
        justifyContent:"center",
        alignItems:"center"
        
    },
    detailList:{
        marginBottom:8,
        padding:8,
    },
    totalSalary:{
        padding:8,
        borderStyle: 'solid',  
        borderWidth: 1 ,
        borderRadius:8,
        margin:10,
    }
});