
import { StyleSheet, Text, View, Image, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import axios from 'axios';
import { theme } from '../util/color';
import SearchBar from '../components/SearchBar';

import { URL } from "@env";
import { HTTP } from '../util/http';
import Loading from '../components/Loding';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomStandardBtn from '../components/common/CustomStandardBtn';
import solo from '../../assets/images/solo.jpeg'
import double from '../../assets/images/double.jpeg'

export default function MyStoreScreen({}) {
    const isFocused = useIsFocused();
    const userId = useSelector((state) => state.login.userId);
    const [storeList, setStoreList] = useState([]);
    const navigation = useNavigation();
    const [searchWrd, setsearchWrd] = useState("");

    // 생성할 파라메터
    const [wageType, setWageType] = useState(0);                                                // 급여형태
    const [wage, setWage] = useState(9860);                                                     // 시급
    const [wage2, setWage2] = useState(2000000);                                                // 월급
    const [foodWage, setFoodWage] = useState(0);                                                // 식대
    const [isWeekWage, setIsWeekWage] = useState(true)                                          // 주휴수당 여부
    const [isSch, setIsSch] = useState(false)                                                   // 고정 근무 시간 여부
    const [weeks, setWeeks] = useState({0:[], 1:[], 2:[], 3:[], 4:[], 5:[],6:[],});             // 선택된 요일
    
    const [loading, setLoading] = useState(true);
    const [sotres, setStores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);                                                // 점포 생성 모달 열기
    const searchAlbaWork = async () => {
        await HTTP("GET", "/api/v2/manageCrew/searchAlbaWorkByAlba", {cstCo:"", userId})
        .then((res)=>{
            if(res.data.resultCode == "00"){//저장된 정보있음
                const storeInfo = res.data.storeInfo;
                setStores(res.data.storeInfo);
            }else if(res.data.resultCode == "01"){
                console.log("저장된 정보 없음");
            }
        }).catch(function (error) {
            console.log(error);
        }).finally(function (){
            setLoading(false);
        })
    } 
    useEffect(()=>{
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setIsModalOpen(true) }
                    style={{alignItems:"center"}}
                >
                    <MaterialCommunityIcons name="store-plus" size={24} color="black" />
                    <Text style={{fontSize:9, textAlign:"center"}}>점포추가</Text>
                </TouchableOpacity>
            ),
        })
        searchAlbaWork();
    }, [])

    useEffect(()=>{
        searchAlbaWork()
        setIsModalOpen(false);
    }, [isFocused])
    return (
        <View style={styles.main}>
        {
            (isModalOpen)?
                <ModalView />
            : null
        }
        {
            (loading)?
                <Loading />
            :(sotres.length == 0)?
                <View style={styles.container}>
                    <Text>내 점포가 없습니다. 우측 상단의 점포를 검색해주세요.</Text>
                </View>
            :
                <View style={{flex:1, backgroundColor:"white"}}>
                    <ScrollView contentContainerStyle={[styles.container2, {paddingTop:20, justifyContent:"flex-start"}]}>
                        <View style={{width:"100%"}}>
                        {
                            sotres.map((el, idx)=><StoreCard key={idx} info={el}/>)
                        } 
                        </View>
                    </ScrollView>
                </View>
        }
        </View>
    );
}

const ModalView = () => {
    const navigation = useNavigation();
    const [type, setType] = useState(0);
    const next = () => {
        if(type == 1){
            navigation.push("manageStore");
        }else if(type == 0){
            navigation.push("createCrewStore", {mode:"create"});
        }
    }
    return (
        <View style={{zIndex:5, position:"absolute", backgroundColor:"white", height:"100%", width:"100%", justifyContent:"center"}}>
            <View style={{padding:10, margin:10, flexDirection:"row", justifyContent:"center",}}>
                <View style={[styles.btn, {borderColor:(type == 0)?theme.primary:"#ddd"}]}>
                    <TouchableOpacity activeOpacity={1} onPress={()=>setType(0)} style={{alignItems:"center"}}>
                        <Text style={fonts.keyPoint}>혼자</Text>
                        <Image source={solo} style={styles.img} />
                        <View style={{height:8}}/>
                        <Text style={fonts.detail}>점주님 없이</Text>
                        <Text style={fonts.detail}>나 혼자 사용</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width:10}} />
                <View style={[styles.btn, {borderColor:(type == 1)?theme.primary:"#ddd"}]}>
                    <TouchableOpacity activeOpacity={1} onPress={()=>{setType(1)}}  style={{alignItems:"center"}}>
                        <Text style={fonts.keyPoint}>연동</Text>
                        <Image source={double} style={styles.img} />
                        <View style={{height:8}}/>
                        <Text style={fonts.detail}>점주님이 등록한</Text>
                        <Text style={fonts.detail}>점포 검색하기</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
            <View style={{padding:20,}}>
                <CustomStandardBtn text={"다음"} onPress={next}/>
            </View>
        </View>
    )
}

const StoreCard = ({info}) => {
    const navigation = useNavigation();
    const statNa = (info.RTCL == "N")?"근무중":(info.RTCL == "R")?"요청중":(info.RTCL == "Y")?"퇴직":(info.RTCL == "D")?"거절됨":"";
    const jobType = info.JOBTYPE || "H";
    return (
        <View style={styles.card}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
                <Text style={fonts.title}>{info.CSTNA}</Text>
                {
                    (info.CSTCL == "crew")?
                        <TouchableOpacity onPress={()=>navigation.push("createCrewStore", {mode:"update", data:info})}>
                            <Text>수정하기</Text>
                        </TouchableOpacity>
                    :
                        null
                }
                
                <View style={styles.pill}>
                    <Text style={fonts.pillText}>{statNa}</Text>
                </View>
            </View>
            <CardContent label={"주소"} content={info.ZIPADDR} />
            {
                (info.RTCL == "N")?
                    <>
                        <CardContent label={"근무형태"} content={(jobType == "H")?"시급":(jobType == "M")?"월급":""} />
                        <CardContent label={"급여"} content={(info.BASICWAGE)?info.BASICWAGE.toLocaleString()+"원":"9,860원"} />
                        {
                            (jobType == "H")?
                                <CardContent label={"주휴수당여부"} content={(info.WEEKWAGEYN == "N")?"N":"Y"} />
                            :(jobType == "M")?
                                <CardContent label={"식대"} content={info.MEALALLOWANCE.toLocaleString()+"원"} />
                            :
                                null
                        }
                    </>
                :null
            }
            <View style={{borderBottomWidth:1, marginVertical:8, borderColor:"#d5d5d5"}} />
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                {
                    (info.RTCL == "R")?
                        <Text style={fonts.label}>근무 요청중인 점포입니다.</Text>
                    :(info.RTCL == "N" && info.ISSCHYN == "Y")?
                        //    
                        [0,1,2,3,4,5,6].map((el, idx) => <DayInfo key={idx} idx={el} item={info.weeks[el]} />)
                    :
                        <Text style={fonts.label}>근무시간 없음</Text>
                }
            </View>
        </View>
    )
}


const CardContent = ({label, content}) => {
    return (
        <View style={{flexDirection:"row", marginBottom:8,}}>
            <View style={{width:85}}>
                <Text style={fonts.label}>{label}</Text>
            </View>
            <Text style={[fonts.content, {flex:1}]}>{content}</Text>
        </View>
    )
}

const DayInfo = ({idx, item}) => {
    const mappingDay = {0:"일", 1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토"}
    const isWorkDay = (item.length > 0)?"#efefef":"#fff"
    return(
        <View style={{alignItems:"center"}}>
            <View style={[styles.circle, {backgroundColor:isWorkDay, borderRadius:50,}]}>
                <Text style={fonts.circleText}>{mappingDay[idx]}</Text>
            </View>
            <Text style={[fonts.circleText, {fontSize:10}]}>{item[0]}</Text>
            <Text style={[fonts.circleText, {fontSize:10}]}>{item[1]}</Text>
        </View>
    )
}

const fonts = StyleSheet.create({
    keyPoint:{
        fontFamily: "SUIT-Bold",
        fontSize: 18,
        color: "#111",
        marginBottom:8
    },
    detail:{
        fontFamily: "SUIT-Regular",
        fontSize: 14,
        color: "#333",
        marginBottom:8

    },
    title:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        color: "#333"
    },
    pillText:{
        fontFamily: "SUIT-Regular",
        fontSize: 10,
        color: "#6a6a6a"
    },
    content:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#666"
    },
    label:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#a2a2a2"
    },
    circleText:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#646464"
    },
    link:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#595959",
        textDecorationLine:"underline"
    }
})
const styles = StyleSheet.create({
    main:{flex: 1},
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal:16, backgroundColor:"white",},
    container2:{ justifyContent: 'center', alignItems: 'center', paddingHorizontal:16, backgroundColor:"white"},
    sampleImage:{width:"100%", height:"100%"}, 
    scrollArea:{
        width:"100%"
    },
    totText:{
        marginHorizontal:16,
        marginVertical:12,
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#555"
    },
    card: {
        marginBottom:12,
        padding:20,
        borderRadius: 10,
        backgroundColor: "#fff",
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
    box:{
        borderRadius:5,
        borderWidth:1,
        borderColor:"#ddd",
        padding:8,
    },
    circle:{
        width:35,
        height:35,
        
        padding:8,
        alignItems:"center", 
        justifyContent:"center"
    },
    pill:{
        justifyContent:"center",
        paddingVertical:3,
        paddingHorizontal:5,
        borderWidth:1,
        borderRadius:2,
        borderColor:"#C0C0C0"
    },
    btn:{
        alignItems:"center",
        flex:1,
        borderRadius:5,
        borderWidth:1,
        padding:30,
        flexDirection:"row", 
        justifyContent:"space-evenly"
        
    },
    img:{
        width:150,
        height:150,
    }
});