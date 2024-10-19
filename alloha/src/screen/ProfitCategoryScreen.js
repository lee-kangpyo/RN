
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { HTTP } from '../util/http';
import { theme } from '../util/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useAlert } from '../util/AlertProvider';

export default function ProfitCategoryScreen({navigation, route}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const storeList = useSelector((state)=>state.common.storeList);
    const store = storeList.filter(el => el.CSTCO == cstCo);
    const [data, setData] = useState([]);
   
    useEffect(() => {
        // 화면 진입 시 탭 바 숨기기
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    
        // 화면 나갈 때 탭 바 다시 보이게 하기
        return () =>
          navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
      }, [navigation]);
    
    const getData = async () => {
        // var params = {cls:"MonCstPlSearch", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, plItCo:"", amt:0}
        await HTTP("GET", "/api/v1/profitAndLoss/getCustomCategory", {cstCo})
        .then((res)=>{
            setData(res.data.result)
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    
    useEffect(()=>{
        getData();
    }, [])

    const [isShow, setIsShow] = useState(false);
    const [mode, setMode] = useState("");
    const [updateParam, setUpdateParam] = useState({});
    const openLayer = (mode, params) => {
        if(mode == "update") setUpdateParam(params);
        setMode(mode)
        setIsShow(true);
    }

    const reload = () => {
        getData();
        setIsShow(false);
    }
   
    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={{flex:1, width:"100%"}}>
                    <View style={{alignItems:"center", marginBottom:16}}>
                        <Text style={[fonts.info]}>{store[0].CSTNA} 매출 항목</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.card}>
                            <Text>현금</Text>
                        </View>
                        <View style={styles.card}>
                            <Text>카드</Text>
                        </View>
                        {
                            (data.length > 0)?
                                data.map((el, idx)=>{
                                    return (
                                        <Card key={idx} item={el} openLayer={openLayer} reload={reload}/>
                                    )
                                })
                            :null
                        }
                    </ScrollView>
                </View>
                <View style={{flexDirection:"row", padding:30}}>
                    <TouchableOpacity style={styles.btn} onPress={()=>openLayer("add")}>
                        <Text style={fonts.info}>항목 추가</Text>
                    </TouchableOpacity>
                    <View style={{width:16}} />
                    <TouchableOpacity style={styles.btn} onPress={()=>navigation.goBack()}>
                        <Text style={fonts.info}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {
                (isShow)?
                    <>
                        <View style={styles.back} />
                        <LayerPopUp mode={mode} item={updateParam} setIsShow={setIsShow} reload={reload}/>
                    </>
                :null
            }
        </>
    );
}
const LayerPopUp = ({mode, item, setIsShow, reload}) => {
    const [layout, setLayout] = useState({ width: -50, height: -50 });
    const [isLayoutReady, setIsLayoutReady] = useState(false);  // 레이아웃 준비 여부

    const onLayout = (event) => {
      const { width, height } = event.nativeEvent.layout;
      setLayout({ width, height });
      setIsLayoutReady(true);
    };
    return (
        <>
            <View style={[styles.layer, {opacity: isLayoutReady ? 1 : 0, transform: [{ translateX: -(layout.width / 2) }, { translateY: -(layout.height / 2) },],}, ]} onLayout={onLayout}>
                {
                    (mode == "add")?<Add reload={reload}/>:(mode == "update")?<Update item={item} reload={reload}/>:null
                }
            </View>
        </>
    )
}
const Add = ({reload}) => {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const [cName, setCName] = useState("");
    const [showBlank, setShowBlank] = useState(false);
    const checkCName = async () => {
        if(cName.length > 0){
            await HTTP("POST", "/api/v1/profitAndLoss/addCustomCategory", {cstCo, cName, userId})
            .then((res)=>{
                reload(false);    
            }).catch(function (error) {
                console.log(error);
                alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
            })
        }else{
            setShowBlank(true)
        }
    }
    return (
        <>
            <Text style={fonts.confirmText}>매출 항목을 입력하세요</Text>
            <View style={{height:8}} />
            <View style={{borderWidth:1, borderRadius:5}}>
                <TextInput value={cName} onChangeText={(text) => {setCName(text);}} />
            </View>
            {
                (showBlank)?
                    <View style={{color:"red",}}>
                        <Text style={fonts.errorMessage}>매출 항목을 입력하셔야합니다.</Text>
                    </View>
                :null
            }
            <View style={{height:8}} />
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <TouchableOpacity onPress={reload}>
                    <Text style={fonts.confirmText}>취소</Text>
                </TouchableOpacity>
                <View style={{width:8}} />
                <TouchableOpacity onPress={checkCName}>
                    <Text style={fonts.confirmText}>추가하기</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
const Update = ({item, reload}) => {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const [cName, setCName] = useState("");
    const [showBlank, setShowBlank] = useState(false);
    const updateAction = async () => {
        await HTTP("PUT", "/api/v1/profitAndLoss/customCategory", {categoryNo:item.CATEGORYNO, cstCo, cName, userId})
        .then((res)=>{
            reload(false);    
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    return (
        <>
            <Text style={fonts.confirmText}>매출 항목을 수정하세요</Text>
                <View style={{height:8}} />
                <View style={{borderWidth:1, borderRadius:5}}>
                    <TextInput value={cName} onChangeText={(text) => {setCName(text);}} />
                </View>
                {
                    (showBlank)?
                        <View style={{color:"red",}}>
                            <Text style={fonts.errorMessage}>내용을 입력해주세요.</Text>
                        </View>
                    :null
                }
                <View style={{height:8}} />

            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <TouchableOpacity onPress={reload}>
                    <Text>취소</Text>
                </TouchableOpacity>
                <View style={{width:8}} />
                <TouchableOpacity onPress={updateAction}>
                    <Text>수정하기</Text>
                </TouchableOpacity>
            </View>
        </>


    )
}
const Card = ({item, openLayer, reload}) => {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const delAction = async () => {
        await HTTP("DELETE", "/api/v1/profitAndLoss/customCategory", {categoryNo:item.CATEGORYNO, userId, cstCo})
        .then((res)=>{
            reload(false);    
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    return (
        <View style={styles.card}>
            <Text>{item.CNAME}</Text>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>openLayer("update", item)}>
                    <Text>수정</Text>
                </TouchableOpacity>
                <View style={{width:8}} />
                <TouchableOpacity onPress={delAction}>
                    <Text>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const fonts = StyleSheet.create({
    info:{
        fontFamily: "SUIT-Medium",
        fontSize: 16,
    },
    btnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        color: theme.primary,
        textDecorationLine:"underline",
    },
    confirmText:{
        fontFamily: "SUIT-Regular",
        fontSize: 16,
    },
    errorMessage:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color:"red"
    }
})
const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', backgroundColor:"white", padding:16},
    btn:{borderColor:"#ddd", borderWidth:1, padding:16, borderRadius:10, flex:1, alignItems:"center"},
    card:{borderColor:"#ddd", borderWidth:1, padding:16, borderRadius:10, marginBottom:8, flexDirection:"row", justifyContent:"space-between"},
    layer:{
        position:"absolute",
        backgroundColor:"white",
        top:"50%",
        left:"50%",
        zIndex:5,
        borderRadius:5,
        padding:15,
    },
    back:{
        position:"absolute",
        backgroundColor:"rgba(0,0,0,0.6)",
        width:"100%",
        height:"100%",
        top:0,
        left:0,
    },

    centerContainer:{flex:1, justifyContent:"center"},
    mainContainer:{flexGrow: 1, width:"100%"},
    bottomInputContainer:{
        borderWidth:0, 
        borderColor:"grey", 
        width:"100%", 
        padding:10, 
        flexDirection:"row", 
        alignItems:"space-between",
        backgroundColor:"white",
        justifyContent:"space-between",
    },
    input:{fontSize: 16, flex:1},
    chatBox:{borderWidth:1, borderRadius:5, padding:10, marginBottom:8, marginHorizontal:10, maxWidth:"80%"}
});