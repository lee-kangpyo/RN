
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { HTTP } from '../util/http';
import { addComma } from './../util/utils';
import Loading from '../components/Loding';

export default function WageDetailScreen({navigation, route}) {
    const [loading, setisLoading] = useState(true)
    const [detailInfo, setDetailInfo] = useState([])
    const [totalWorkHours, setTotalWorkHours] = useState(0)
    const [totalSalary, setTotalSalary] = useState(0)
    
    


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

    useEffect(()=>{

        let totalWorkHours = 0;
        let totalSalary = 0;

        // 배열 순회하면서 합산
        detailInfo.forEach(item => {
        totalWorkHours += item["jobDure"];
        totalSalary += item["jobWage"];
        });

        setTotalWorkHours(totalWorkHours);
        setTotalSalary(totalSalary);

    }, [detailInfo])

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
                    <View>
                        <Text>총 근무 시간 : {totalWorkHours}시간</Text>
                        <Text>총 급여 : {addComma(totalSalary)}원</Text>
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
    }
});