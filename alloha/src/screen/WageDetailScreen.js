
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { HTTP } from '../util/http';
import { addComma, headerLeftComponent, safeToLocaleString } from './../util/utils';
import Loading from '../components/Loding';
import { useAlert } from '../util/AlertProvider';
import { result } from 'lodash';
import { generateWeeklyRanges, isBetween, isBetweenDate } from '../util/moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

export default function WageDetailScreen({navigation, route}) {
    const isFocused = useIsFocused();
    const [loading, setisLoading] = useState(true)
    const [detailInfo, setDetailInfo] = useState([])
    const [salaryWeek, setSalaryWeek] = useState([])
    const [total, setTotal] = useState({})
    const [absentInfo, setAbsentInfo] = useState([])
    const userId = useSelector((state) => state.login.userId);
    const [jobType, setJobType] = useState("");

    const {target} = route.params

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
                setJobType(res.data.salaryTotal.jobType);
                setDetailInfo(res.data.salaryDetail);
                setSalaryWeek(res.data.slalryWeek);
                setTotal(res.data.salaryTotal);
                setAbsentInfo(res.data.absentInfo)
            }).finally(()=>{
                setisLoading(false);
            })
    }

    useEffect(()=>{
        navigation.setOptions({headerLeft:()=>headerLeftComponent(route.params.title), title:""})
    }, [navigation])

    useEffect(()=>{
        getSalaryDetail();
    }, [isFocused])


    const convertYMD = (ymd) => {
        const year = ymd.slice(0, 4);
        const month = ymd.slice(4, 6);
        const day = ymd.slice(6, 8);

        const date = new Date(`${year}-${month}-${day}`);
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

        const formattedDate = `${month}/${day} (${dayOfWeek})`;
        return formattedDate
    }
    const AbsentLine = ({item, jobType}) => {
        const { showConfirm } = useAlert();
        const delAbsent = () => {
            showConfirm("결근 취소", "결근을 취소하시겠습니까?", async () => {
                const param = {ymd:item.YMD, userId:item.USERID, cstCo:item.CSTCO, iUserId:userId, useYn:"N"};
                await HTTP("POST", "/api/v2/commute/absent", param)
                .then((res)=>{
                    getSalaryDetail();
                }).catch(function (error) {
                   console.log(error);
                })            
            });
        }
        return (
            <View style={styles.detailList}>
                <View style={{flexDirection:"row", flex:1}}>
                    <Text style={[fonts.date, {width:80}]}>{convertYMD(item.YMD)}</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", flex:1}}>
                        <Text style={fonts.time}>결근</Text>
                        <TouchableOpacity onPress={delAbsent} style={{borderWidth:1, borderColor:"#111",  borderRadius:5, justifyContent:"center", padding:1}}>
                            <Text style={[fonts.pillText, {color:"#111"}]}>결근 취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    const DetailList = ({item, jobType}) => {
        const {showAlert} = useAlert();
        const pillColor = ( ["승인", "자동승인"].includes(item.apvYn) )?"#3479EF":"#EEEEEE"
        const pillTextColor = ( ["승인", "자동승인"].includes(item.apvYn) )?"#FFF":"#999"
        const mssg1 = (item.jobCl == "대타")?"해당 근무는 대타입니다.\n":(item.schDure == "-")?"근무계획이 없습니다.\n":"근무계획 : "+item.schDure+"시간\n";
        const mssg2 = (item.dure == "-")?"근무시간 : 0":"근무시간 : "+item.dure+"시간";
        return(
            <>
                <View style={styles.detailList}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={[fonts.date, {width:80}]}>{convertYMD(item.ymd)}</Text>
                        <View onPress={()=>showAlert("설명", mssg1+mssg2)} style={{flexDirection:"row"}}>
                            {/* {
                                (item.jobCl == "대타")?<Text style={fonts.time}>대타</Text>:
                                (item.schDure == "-")?<Text style={fonts.time}>없음</Text>:
                                <Text style={fonts.time}>{item.schDure}</Text>
                            }
                            <Text style={fonts.time}> | </Text> */}
                            {
                                (item.jobType == "M")?
                                    <Text style={fonts.time}>{(item.dure == "-")?"0":item.dure}시간</Text>
                                :(item.jobType == "H")?
                                    <>
                                        <Text style={fonts.time}>(</Text>
                                        <Text style={fonts.time}>{(item.dure == "-")?"0":item.dure}시간</Text>
                                        <View style={{width:4}} />
                                        <Text style={fonts.time}>{(item.salary / item.dure).toLocaleString()}원</Text>
                                        <Text style={fonts.time}>)</Text>
                                    </>
                                :null
                            }
                            
                        </View>
                    </View>
                    <View style={{flex:1, alignItems:"flex-end"}}>
                        {
                            (jobType=="H")?
                                <Text style={fonts.wage}>{addComma(item.salary)}원</Text>
                            :
                                <Text style={fonts.wage}>-</Text>

                        }
                        
                    </View>
                    {/* <View style={{justifyContent:"flex-end", width:85}}>
                        <View style={[styles.pill, {backgroundColor:pillColor}]}>
                            <Text style={[fonts.pillText, {color:pillTextColor}]}>{item.apvYn}</Text>
                        </View>
                    </View> */}
                </View>
                <View style={styles.sepH}/>
            </>
        )
    }
    const DetailSum = ({items}) => {
        
        const sum = items.reduce((result, item) => {
            // console.log(result);
            // console.log(item.dure);
            result.dure += Number(item.dure);
            result.salary += Number(item.salary);
            return result;
        }, {"dure":0, "salary":0})

        return (
            <>
                <View style={styles.detailList}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={[fonts.date, {width:80}]}>합계</Text>
                        <View style={{flexDirection:"row"}}>
                            <Text style={fonts.time}>{sum.dure.toFixed(1)}시간</Text>
                        </View>
                    </View>
                    <View style={{flex:1, alignItems:"flex-end"}}>
                        <Text style={fonts.wage}>{sum.salary.toLocaleString()}원</Text>
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
                    <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"center"}}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Text style={fonts.endOfWeek_hours}>{convertYMD(item.YMDFR)}~{convertYMD(item.YMDTO)}</Text>
                            <Text style={fonts.time}>{item.WEEKDURE}시간</Text>
                        </View>
                        {
                            (item.isAbsent == "Y")?
                                <Text style={fonts.wage}>결근</Text>
                            :(item.isAbsent == "N")?
                                <Text style={fonts.wage}>{addComma(item.WEEKWAGE)}원</Text>
                            :
                            null
                        }
                        
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
    
    const TopComp = ({total, salaryWeek})=>{
        const weekWageYn = total.WEEKWAGEYN;
        const weekSum = salaryWeek.reduce((result, item) => {
            result += (item.isAbsent == "Y")?0:item.WEEKWAGE;
            return result;
        }, 0)
        return (
            <View style={{backgroundColor:"white", padding:24}}>
                <View style={{flexDirection:"row"}}>
                    <Text style={fonts.totalLabel}>총 급여</Text>
                    <Text style={{marginLeft:4}}>({(jobType == "H")?"시급":(jobType == "M")?"월급":""})</Text>
                </View>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"baseline"}}>
                    <Text style={fonts.totalSalary}>{(jobType == "H")?(weekWageYn=="Y")?addComma(total.salary + weekSum):addComma(total.salary):addComma(total.salary + total.mealAllowance)}원</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row", alignItems:"flex-end"}}>
                            <Text style={fonts.main}>[ </Text>
                            <View style={{alignItems:"center"}}>
                                <Text style={fonts.top}>일반</Text>
                                <Text style={fonts.main}>{addComma(total.salary)}</Text>
                            </View>
                            <Text> + </Text>
                            {
                                (jobType == "H")?
                                    <View style={{alignItems:"center"}}>
                                        <Text style={fonts.top}>주휴</Text>
                                        <Text style={fonts.main}>{(weekWageYn=="Y")?addComma(weekSum):"주휴없음"}</Text>
                                    </View>
                                :(jobType == "M")?
                                    <View style={{alignItems:"center"}}>
                                        <Text style={fonts.top}>식대</Text>
                                        <Text style={fonts.main}>{addComma(total.mealAllowance)}</Text>
                                    </View>
                                :
                                    null
                            }
                            <Text style={fonts.main}> ]</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    
    // // 스크롤 이동 추가 - 해당 기능을 제외 할려면 const {target} = route.params 이거 제외 후 스크롤 불럭 삭제
    const scrollRef = useRef(null);
    const refArray = useRef([]);
    
    // const initScrollTo = async () => {
    //     let idx = 0
    //     const measurePromises = refArray.current.map((item, index) => {
    //         if(target.firstDay == item.item.YMDFR || target.lastDay == item.item.YMDTO ){
    //             idx = index;
    //         }
    //         return new Promise((resolve) => {
    //             if (item.ref) {
    //                 item.ref.measure((x, y, width, height) => {
    //                     //console.log(`Element with value ${item.value} at index ${index} has height: ${height}`);
    //                     resolve(height);
    //                 });
    //             } else {
    //                 resolve(null);
    //             }
    //         });
    //     });
    //     const heights = await Promise.all(measurePromises);
    //     //console.log('All heights measured:', heights);

    //     const h = heights.reduce((result, next, i) => {
    //         if( i < idx ){
    //             return result + next;
    //         }else{
    //             return result;
    //         }
    //     }, 0)
    //     scrollRef.current.scrollTo({ x: 0, y: h, animated: true })
    // };

    // useEffect(()=>{
    //     if(refArray.current.length > 0) initScrollTo();
    // }, [loading])
    // // 스크롤 이동 추가
    const makeDetails = (start, end) => {
        const weeklyRanges = generateWeeklyRanges(start, end);
        // console.log(weeklyRanges);
        return weeklyRanges;
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
                    
                    <TopComp total={total} salaryWeek={salaryWeek} />
                    <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContentStyle} style={styles.scrollContainer}>
                        <View style={{paddingHorizontal:22, marginBottom:10}}>
                            <Text style={fonts.endOfWeek_date}>주휴 수당</Text>
                        </View>
                        <View style={[styles.weekCard, {paddingVertical:16}]} >
                        {
                            (jobType == "H" && total.WEEKWAGEYN == "Y")?
                                salaryWeek.map((el, idx) => {
                                    return (
                                        <View key={idx} style={{paddingVertical:8}}>
                                            <EndOfWeek item={el}/>
                                        </View>
                                    );
                                })
                            :
                                <Text>주휴 수당이 없습니다.</Text>
                        }
                        </View>
                        <View style={[{paddingVertical:24}]} >
                            <View style={{paddingHorizontal:22, marginBottom:10}}>
                                <Text style={fonts.endOfWeek_date}>상세 내역</Text>
                            </View>
                            {
                                makeDetails(route.params.ymdFr, route.params.ymdTo).map((item, idx)=>{
                                    const details = detailInfo.filter((it)=> isBetweenDate(it.ymd, item.start, item.end))
                                    const absents = absentInfo.filter((it)=> isBetweenDate(it.YMD, item.start, item.end))
                                    const sum = details.reduce((result, detail)=>{
                                        result += detail.salary;
                                        return result;
                                    }, 0)
                                    const merged = [...absents, ...details]
                                    merged.sort((a, b) => a.ymd.localeCompare(b.ymd));
                                    return (
                                        <>
                                        {
                                            (details.length > 0)?
                                                <View style={[styles.weekCard, {paddingVertical:24}]} >
                                                    <Text style={fonts.main}>{item.start} ~ {item.end}</Text>
                                                    {
                                                        merged.map((el, idx) => {
                                                            return (
                                                                <>
                                                                {
                                                                    (el.isAbsent)?

                                                                        <AbsentLine key={idx} item={el} jobType={jobType}/>
                                                                    :
                                                                        <DetailList key={idx} item={el} jobType={jobType}/>
                                                                }
                                                                </>
                                                            )
                                                        } )
                                                    }
                                                    <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:16}}>
                                                        <Text style={fonts.date}>합계</Text>
                                                        <Text style={fonts.wage}>{safeToLocaleString(sum, "-")}원</Text>
                                                    </View>
                                                    
                                                </View>
                                            :null
                                        }
                                        </>
                                    )
                                })
                                //detailInfo.map((item, idx) => <DetailList key={idx} item={item} jobType={jobType}/> )
                            }
                            {/* <DetailSum items={detailInfo} /> */}
                        </View>
                    </ScrollView>
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
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#555555"
    },
    endOfWeek_plus:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 13,
        color: "#111"
    },
    totalSalary:{
        fontFamily: "SUIT-Bold",
        fontSize: 24,
        color: "#111"
    },
    totalLabel:{
        fontFamily: "SUIT-Medium",
        fontSize: 16,
        color: "#555",
        marginBottom:10
    },
    totalWage:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#FFFFFF"
    },
    top:{
        marginBottom:-1,
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#111"
    },
    main:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        color: "#111"
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