
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import React, {useState, useEffect} from 'react';
import { HTTP } from '../util/http';
import { addComma, headerLeftComponent } from './../util/utils';
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
            }).finally(()=>{
                setisLoading(false);
            })
            
    }

    useEffect(()=>{
        navigation.setOptions({headerLeft:()=>headerLeftComponent(route.params.title), title:""})
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

    const DetailList = ({item}) => {
        const pillColor = ( ["승인", "자동승인"].includes(item.apvYn) )?"#3479EF":"#EEEEEE"
        const pillTextColor = ( ["승인", "자동승인"].includes(item.apvYn) )?"#FFF":"#999"
        return(
            <>
                <View style={styles.detailList}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={[fonts.date, {width:80}]}>{convertYMD(item.ymd)}</Text>
                        <Text style={fonts.time}>{(item.dure == "-")?"0":item.dure}시간</Text>
                    </View>
                    <View style={{flex:1, alignItems:"flex-end"}}>
                        <Text style={fonts.wage}>{addComma(item.salary)}원</Text>
                    </View>
                    <View style={{justifyContent:"flex-end", width:85}}>
                        <View style={[styles.pill, {backgroundColor:pillColor}]}>
                            <Text style={[fonts.pillText, {color:pillTextColor}]}>{item.apvYn}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.sepH}/>
            </>
        )
    }
    const SumLine = ({items}) => {
        const sum = items.filter(el => ["승인", "자동승인"].includes(el.apvYn) ).reduce((result, next) => {
            result.dure += Number(next.dure);
            result.salary += Number(next.salary);
            return result;
        }, {dure:0, salary:0});
        return(
            <>
            <View style={styles.detailList}>
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <Text style={[fonts.date, {width:80}]}>합계</Text>
                    <Text style={fonts.time}>{sum.dure}시간</Text>
                </View>
                <View style={{flex:1, alignItems:"flex-end"}}>
                    <Text style={fonts.wage}>{sum.salary.toLocaleString()}원</Text>
                </View>
                <View style={{justifyContent:"flex-end", width:85,}}>
                    {/* <View style={[styles.pill, {backgroundColor:"red"}]}>
                        <Text style={[fonts.pillText, {color:"white"}]}>asf</Text>
                    </View> */}
                </View>
            </View>
            <View style={styles.sepH}/>
            </>
        )
    }
    const EndOfWeek = ({item}) => {
        return(
            <>
                <View style={styles.endOfWeek}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={fonts.endOfWeek_hours}>{item.WEEKDURE}시간</Text>
                        <Text style={fonts.endOfWeek_hours}>|</Text>
                        <Text style={fonts.endOfWeek_plus}> 주휴수당 : {addComma(item.WEEKWAGE)}원</Text>
                    </View>
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
                    <ScrollView contentContainerStyle={styles.scrollContentStyle} style={styles.scrollContainer}>
                        {
                            getDetailList().map((el, idx) => {
                                return (
                                    <View key={idx} style={styles.weekCard}>
                                        <View style={{paddingTop:24, paddingHorizontal:22}}>
                                            <Text style={fonts.endOfWeek_date}>{convertYMD(el.week.YMDFR)} ~ {convertYMD(el.week.YMDTO)}</Text>
                                        </View>
                                        {
                                            el.items.map((item, idx) => <DetailList key={idx} item={item}/> )
                                        }
                                        <SumLine items = {el.items} />
                                        <EndOfWeek item={el.week}/>
                                    </View>
                                    );
                            })
                        }
                    </ScrollView>
                    <View style={{backgroundColor:"#F6F6F8", paddingHorizontal:16, paddingBottom:14}}>
                        <View style={styles.totalSalary}>
                            <View style={[styles.rowLine, {marginBottom:8}]}>
                                <View style={styles.row}>
                                    <Text style={fonts.totalSalary}>근무시간</Text>
                                    <View style={[styles.whitePill, {marginLeft:5}]}>
                                        <Text style={fonts.totalSalary}>{total.aDure}/{total.nDure}시간</Text>
                                    </View>
                                </View>
                                <Text style={fonts.totalSalary}>{addComma(total.gSalary)}원</Text>
                            </View>
                            <View style={[styles.rowLine, {marginBottom:18}]}>
                                <Text style={fonts.totalSalary}>주휴시간</Text>
                                <Text style={fonts.totalSalary}>{addComma(total.sSalary)}원</Text>
                            </View>
                            <View style={styles.rowLine}>
                                <Text style={fonts.totalWage}>총급여</Text>
                                <Text style={fonts.totalWage}>{addComma(total.salary)}원</Text>
                            </View>
                        </View>
                    </View>
                </>
            }
        </>
    );

    
}

const fonts = StyleSheet.create({
    date:{
        width:80,
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#555555"
    },
    time:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 13,
        color: "#999999"
    },
    wage:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 13,
        color: "#111111"
    },
    pillText:{
        fontFamily: "SUIT-Medium",
        fontSize: 12,
        color: "#FFFFFF"
    },
    endOfWeek_date:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#555"
    },
    endOfWeek_hours:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 13,
        color: "#FF6A6A"
    },
    endOfWeek_plus:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 13,
        color: "#FF6A6A"
    },
    totalSalary:{
        fontFamily: "SUIT-Regular",
        fontSize: 14,
        color: "#FFFFFF"
    },
    totalWage:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#FFFFFF"
    }
})

      
const styles = StyleSheet.create({
        
    scrollContentStyle:{paddingHorizontal:16, paddingVertical:20, },
    scrollContainer:{
        flex:1,
        backgroundColor:"#F6F6F8",
    },
    container:{ 
        flex:1,
        justifyContent:"center",
        alignItems:"center"
        
    },
    weekCard:{
        paddingHorizontal:16,
        marginBottom:10,
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
    detailList:{
        paddingVertical:16,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:4,
        paddingRight:4,
    },
    endOfWeek:{
        flexDirection:'row',
        justifyContent:"flex-end",
        paddingVertical:16,
        paddingHorizontal:22
    },
    totalSalary:{
        borderRadius: 15,
        backgroundColor: "#333333",
        paddingVertical:20,
        paddingHorizontal:16,
    },
    whitePill:{
        paddingHorizontal:6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 1.0)"
    },
    pill:{
        alignSelf:"flex-end",
        paddingHorizontal:8,
        paddingVertical:2,
        borderRadius: 20,
    },
    sepH:{
        
        borderWidth:0.5,
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    row:{flexDirection:"row"},
    rowLine:{flexDirection:"row", justifyContent:"space-between"}

});