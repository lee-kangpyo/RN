
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { HTTP } from '../util/http';
import { addComma } from './../util/utils';
import Loading from '../components/Loding';
import CustomBtn from './../components/CustomBtn';

export default function WageDetailScreen({navigation, route}) {
    const [loading, setisLoading] = useState(true)
    const [detailInfo, setDetailInfo] = useState([])
    const [salaryWeek, setSalaryWeek] = useState([])
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
                setSalaryWeek(res.data.slalryWeek);
                setTotal(res.data.salaryTotal);
                //console.log(res.data.salaryDetail);
                //console.log(res.data.slalryWeek);
                
                //console.log(res.data.salaryTotal);
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

    const detailList = (item) => {
        var time =  (item.dure == "-")?
                <><Text>{convertYMD(item.ymd)}</Text><Text>0시간</Text></>
            :
                <><Text>{convertYMD(item.ymd)}</Text><Text>{item.dure}시간</Text></>;
        return(
            <View style={styles.detailList}>
                <View style={{width:135, flexDirection:"row", justifyContent:"space-between"}}>
                    {time}
                </View>
                <View style={{flexDirection:"row"}}>
                    <Text>(급여 : {addComma(item.salary)}원)</Text>
                    <Text> {item.apvYn}</Text>
                </View>
            </View>
        )
    }
    const endOfWeek = (item) => {
        print(item.ymd)
        return(
            <>
                <View style={styles.endOfWeek}>
                    <Text style={{color:"red"}}>{convertYMD(item.YMDFR)} ~ {convertYMD(item.YMDTO)} - {item.WEEKDURE}시간</Text>
                    <Text style={{color:"red"}}> 주휴수당 : {addComma(item.WEEKWAGE)}원</Text>
                </View>
            </>
        )
    }

    const getDetailList= () => {
        const result = salaryWeek.map(weekItem => {
            const ymdfr = weekItem.YMDFR;
            const ymdto = weekItem.YMDTO;
            
            const matchingAItems = detailInfo.filter(info => {
                const ymd = info.ymd;
                return ymd >= ymdfr && ymd <= ymdto;
            });
            return {
                week:weekItem,
                items: matchingAItems,
            };
        });

        return result;

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
                            //detailInfo.sort((a, b) => a.ymd.localeCompare(b.ymd)).map((el, idx)=>{
                            getDetailList().map((el, idx) => {
                                const detail = el.items.map((item, idx) => {
                                    return detailList(item);
                                });
                                const week = endOfWeek(el.week)
                                //console.log(el.week);
                                //const week = <Text>sadf</Text>
                                
                                return (
                                    <View style={styles.weekCard}>
                                        {detail}
                                        {week}
                                    </View>
                                    );
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
    weekCard:{
        margin:10,
        borderWidth:1,
        borderRadius:5,
        padding:16,
    },
    detailList:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:4,
        paddingRight:4,
        marginBottom:8
    },
    endOfWeek:{
        flexDirection:'row',
        justifyContent:"center",
        marginBottzom:8,
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