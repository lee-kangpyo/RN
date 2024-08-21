import { Modal, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, TextInput, Dimensions } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import CrewCard from '../components/CrewCard';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { theme } from '../util/color';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { URL } from "@env";
import { Confirm } from '../util/confirm';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../components/CustomModal';
import { HTTP } from '../util/http';

export default function ManageCrewScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const [searchWrd, setsearchWrd] = useState("");
    const [filterWrd, setfilterWrd] = useState("");
    const [crewList, setCrewList] = useState([]);

    // 탭에서 사용하는 상태
    const [selectCstCo, setSelectCstCo] = useState(0); //0 이면 전체 나머지는 cstCo
    const [storeList, setStoreList] = useState([]);

//    const [storeList, setStoreList] = useState([]);

    const onApprov = async (userNa, cstCo, userId, hpNo) => {
        // -- 1. 해당 점포와 전화번호에 매칭되는 사용자 조회
        // exec PR_PLYM02_USERMNG 'searchChangeAlba', 1014, '', '', '01046072210', 'N'
        // -- 2. 점포코드와 사용자코드, 변경코드를 입력받아 계획, 근무, 급여 항목을 업데이트 한다.
        // exec PR_PLYM02_USERMNG 'changeAlbaUpdate', 1014, 'mangdee21_0357', '', '01046072210', 'N'
        
        console.log(cstCo, userId, userNa);
        navigation.push("ManageCrewUpdate", {cstCo, userId, userNa, mode:"create"});
        /*
        const check = await HTTP("GET", "/api/v1/searchChangeAlba", {hpNo:hpNo, cstCo:cstCo});

        Confirm("승인", `지원 하신${userNa}님을 승인하시겠습니까?`, "아니오", "네", async ()=>{
            // 승인처리
            await axios.post(URL+`/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"N"})
            .then((res)=>{
                if(res.data.result === 1){
                    Alert.alert("알림", "승인 하였습니다.")
                    searchCrewList();
                    // 병합체크
                    if(check.data.result.length ?? 0 > 0){
                        const tmpId = check.data.result[0].USERID // 점주가 생성한 아이디
                        Confirm("근무 병합", `승인된 [${userNa}]님과 동일한 전화 번호로 점주가 직접 생성한 아이디가 있습니다. 근무 기록을 병합 하시겠습니까?`, "아니오", "네", async ()=>{
                            await axios.post(URL+`/api/v1/changeAlbaUpdate`, {hpNo:hpNo, cstCo:cstCo, userId:tmpId})
                            .then((res)=>{
                                if(res.data.resultCode === "00"){
                                    Alert.alert("알림", "병합되었습니다.")
                                    
                                }else{
                                    Alert.alert("알림", "근무 병합 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                                }
                            }).catch(function (error) {
                                console.log(error);
                                Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                            })
                        })
                    }else{
                        Alert.alert("알림", "승인 하였습니다.")
                        searchCrewList();
                    }
                }else{
                    Alert.alert("알림", "승인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
        */
    }

    const onRetirement = (userNa, cstCo, userId) => {
        Confirm("퇴사", `${userNa}님의 퇴사를 진행 하시겠습니까?`, "아니오", "네", async ()=>{
            await axios.post(URL+`/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"Y"})
            .then((res)=>{
                if(res.data.result === 1){
                    Alert.alert("알림", "[퇴사] 요청을 완료 하였습니다.")
                    searchCrewList();
                }else{
                    Alert.alert("알림", "퇴사 요청 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
    }

    const onDeny = (userNa, cstCo, userId) => {
        Confirm("거절", `지원하신 ${userNa}님을 거절 하시겠습니까?`, "아니오", "네", async ()=>{
            await axios.post(URL+`/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"D"})
            .then((res)=>{
                if(res.data.result === 1){
                    Alert.alert("알림", "[거절] 요청을 완료 하였습니다.")
                    searchCrewList();
                }else{
                    Alert.alert("알림", "거절 요청 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
    }
    
    const searchCrewList = async () => {
        const response = await axios.get(URL+'/api/v1/searchCrewList', {params:{userId:userId}});
        if(JSON.stringify(crewList) !=  JSON.stringify(response.data.result)) setCrewList(response.data.result);
        var initStore = response.data.result.reduce((acc, curr) => {
            if (!acc.some(item => item.CSTCO === curr.CSTCO)) {
              acc.push({ CSTCO: curr.CSTCO, CSTNA:curr.CSTNA });
            }
            return acc;
        }, [{CSTCO:"0", CSTNA:"전체"}])
        setStoreList(initStore);
    };


    useEffect(()=>{
        searchCrewList()
    }, [filterWrd])
    
    useFocusEffect(
        useCallback(() => {
            searchCrewList()
            
            return () => {};
        }, [])
    )
    
    const filterList = (filterWrd == "")?crewList.filter(el=>{
        if(selectCstCo == 0) return el;
        return el.CSTCO == selectCstCo
    }):crewList.filter((el)=>{
        if(selectCstCo == 0) return el.USERNA.includes(filterWrd);
        return el.USERNA.includes(filterWrd) && el.CSTCO == selectCstCo
    });
    
    // 이름 수정
    const[modifyUser, setModifyUser] = useState({});
    const[isShow, setIsShow] = useState(false);
    var changedName = "";
    const onNameChange = (name) => changedName = name;
    const ModalBody = ({user, onNameChange}) => {
        const[name, setName] = useState("");
        const onChange = (txt) => {
            setName(txt);
            onNameChange(txt);
        }
        return(
            <View style={styles.modalBody}>
                <Text>{user.name}</Text>
                <Text style={{paddingHorizontal:15}}>---&gt;</Text>
                <TextInput onChange={(e)=>onChange(e.nativeEvent.text)} value={name} style={styles.modalInput} />
            </View>
        )
    }
    const modifyName = async () => {
        await axios.post(URL+`/api/v1/changeCrewName`, {cstCo:modifyUser.cstCo, userId:modifyUser.userId, name:changedName})
        .then((res)=>{
            if(res.data.resultCode == "00"){
                searchCrewList();
                changedName = "";
                setModifyUser({});
                setIsShow(false);
            }else{
                Alert.alert("오류", "요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")    
            }
        }).catch(function (error) {
            console.log(error);
            Alert.alert("오류", "요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
        
    }
    //개인화된 정보 입력 화면으로 이동 
    const modifyCrewInfo = (cstCo, userId, userNa) => {
        console.log(cstCo, userId, userNa);
        navigation.push("ManageCrewUpdate", {cstCo, userId, userNa});
        //setModifyUser({name:userNa, userId:userId, cstCo:cstCo});
        //setIsShow(true);
    }
    // 이름변경
    const modifyCrew = (cstCo, userId, userNa) => {
        setModifyUser({name:userNa, userId:userId, cstCo:cstCo});
        setIsShow(true);
    }
    // 이름 수정
    const tapWidth = Dimensions.get('window').width / 3.1;
 
    const tapAction = (cstCo) => {
        setSelectCstCo(cstCo)
    }
    return (
        <>
            <View style={{padding:16, paddingBottom:10, backgroundColor:"#fff"}}>
                <SearchBar placeHolder='이름 조회' searchText={searchWrd} onSearch={setsearchWrd} onButtonPress={()=>{setfilterWrd(searchWrd)}} iconName={"magnify"}  iconColor={"#3479EF"}/>
            </View>
            {
                (storeList.length > 0)?
                <View style={{height:40, backgroundColor:"#fff"}}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal = {true} style={{ flexDirection: 'row', height: 40 }}>
                        {storeList.map((item, idx) => (
                            <TouchableOpacity key={idx} onPress={()=>tapAction(item.CSTCO)} style={[styles.tap, { width: tapWidth, borderBlockColor:(item.CSTCO == selectCstCo)?"#3479EF":"#fff"}]}>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={(item.CSTCO == selectCstCo)?fonts.tapText_selected:fonts.tapText}>{item.CSTNA}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                :
                null
            }
            <View style={styles.container}>
                {
                    (crewList.length > 0)
                    ?
                        (filterList.length > 0)
                        ?
                        <>
                            <Text style={fonts.count}>총 {filterList.length}명</Text>
                            <ScrollView style={styles.scrollArea}>
                                {filterList.map((el, idx)=>{
                                    console.log(el);
                                    return <CrewCard 
                                                key={idx} 
                                                crew={el} 
                                                applyBtntxt={"승인"} 
                                                onApplyButtonPressed={(cstCo, userId)=>{onApprov(el.USERNA, cstCo, userId, el.HPNO)}}
                                                retirementBtnTxt={"퇴직"}
                                                onRetirementButtonPressed={(cstCo, userId)=>{onRetirement(el.USERNA, cstCo, userId)}}
                                                denyBtnTxt={"거절"}
                                                onDenyButtonPressed={(cstCo, userId)=>{onDeny(el.USERNA, cstCo, userId)}}    
                                                //modifyBtnTxt={"수정"}
                                                //onModifyButtonPressed={(cstCo, userId, userNa)=>modifyCrew(cstCo, userId, userNa)}
                                                modifyBtnTxt={"수정"}
                                                onModifyButtonPressed={(cstCo, userId, userNa)=>modifyCrewInfo(cstCo, userId, userNa)}
                                            />
                                })}
                            </ScrollView>
                        </>
                        :
                        <Text style={{fontSize:16}}>조회 결과가 없습니다.</Text>
                    :
                    <>
                        <Text style={{fontSize:16}}>등록된 알바생이 없습니다.</Text>
                    </>
                }
            </View>
            
            <CustomModal
                visible={isShow}
                title={"이름 수정"}
                body={<ModalBody user={modifyUser} onNameChange={onNameChange} />}
                confBtnTxt={"수정하기"}
                confirm={modifyName}
                cBtnTxt={"취소"}
                onCancel={()=>setIsShow(false)}
                onClose={()=>console.log("onclose")}
            >
                <View >
                    <Text>asdfs</Text>
                </View>
            </CustomModal>
        </>
    );
    
}
const fonts = StyleSheet.create({
    tapText:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        color: "#999999"
    },
    tapText_selected:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#3479EF"
    },
    count:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#555",
        alignSelf:"flex-start", 
        marginBottom:12
    }
})
// visible, title, body, confBtnTxt, confirm, cBtnTxt, onCancel, onClose
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16, backgroundColor:"#F6F6F8"},
    modalBody:{padding:15, flexDirection:"row", alignItems:"center"},
    modalInput:{borderWidth:1, borderRadius:5, flex:1, padding:5},
    scrollArea:{width:"100%"},
    tap:{
        justifyContent:"center", 
        alignItems:"center",
        borderBottomWidth:1,
    }
});