
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../util/color';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import {Picker} from '@react-native-picker/picker';
import WageCard from '../components/WageCard';
import { DatePiker } from '../components/DateTimePicker';
import { convertTime2 } from '../util/moment';
import { CustomBottomSheet2 } from '../components/common/CustomBottomSheet2';
import { InlineDatePicker } from '../components/TimePicker';
import { useIsFocused } from '@react-navigation/native';

export default function WageScreen({navigation, route}) {
    const isFocused = useIsFocused();
    const userType = route.params.userType
    const userId = useSelector((state)=>state.login.userId)
    const [myStore, setMyStore] = useState([]);
    const [selectLIst, setSelectList] = useState([]);
    const [selectedStore, setSelectedStore] = useState({});
    const [selCstCo, setSelCstco] = useState();

    const getDate = (isFirstDay) => {
        const currentDate = new Date();
        const targetDate = new Date(currentDate);
        if (isFirstDay) {
            targetDate.setDate(1);
        } else {
            const nextMonth = targetDate.getMonth() + 1;
            targetDate.setMonth(nextMonth, 0);
        }
        return targetDate;
    }
    
    const [searchWrd, setSearchWrd] = useState("");
    const [date, setDate] = useState(getDate(true));
    const [date2, setDate2] = useState(getDate(false));
    const [mode, setMode] = useState(0);
    const [isOpen, setIsOpen] = useState(false); 
    const getStoreForSalary = async () => {
        await HTTP("GET", "/api/v1/getMyStoreForSalary", {"userType":userType, "userId":userId,})
            .then((res)=>{
                setSelectList(res.data.storeList);
            }
        )
    }
    const getSalary = async (cstCo) => {
        const ymdFr = date.getFullYear()+String(date.getMonth() + 1).padStart(2, '0')+String(date.getDate()).padStart(2, '0');
        const ymdTo = date2.getFullYear()+String(date2.getMonth() + 1).padStart(2, '0')+String(date2.getDate()).padStart(2, '0');
        await HTTP("GET", "/api/v1/getSalary", {"userType":userType, "ymdFr":ymdFr, "ymdTo":ymdTo, "userId":userId, "cstCo":cstCo})
            .then((res)=>{
                setMyStore(res.data.salary)
            }
        )
    }

    useEffect(()=>{
        if(userType === "crew"){
            getSalary("");
        }else if(userType === "owner"){
            getStoreForSalary();
        }
    }, [isFocused, date, date2, searchWrd])

    useEffect(()=>{
        if(userType === "owner"){
            getSalary(selCstCo);
        }
    }, [selCstCo])


    const navigateWageDetail = (item) => {
        
        const ymdFr = date.getFullYear()+String(date.getMonth() + 1).padStart(2, '0')+String(date.getDate()).padStart(2, '0');
        const ymdTo = date2.getFullYear()+String(date2.getMonth() + 1).padStart(2, '0')+String(date2.getDate()).padStart(2, '0');
        console.log(ymdFr);
        console.log(ymdTo);
        //navigation.navigate("WageDetail", {item:item});
        
        navigation.navigate("WageResultDetail", { title: `${item.userNa}`, cstCo:item.cstCo, userId:item.userId, ymdFr:ymdFr, ymdTo:ymdTo});
    }

    const openDateChanger = (mode) => {
        setMode(mode);
        setIsOpen(true);
    }
    const DatePickerBottomSheet = ({date, setDate, setIsOpen, maxDate=null, minDate=null}) => {
        const [tDate, setTDate] = useState(date);
        const onConfirm = () => {
            setIsOpen(false);
            setDate(tDate);
        }
        return (
            <>
                <View style={styles.dateSheetContainer}>
                    <InlineDatePicker date={tDate} setDate={setTDate} maxDate={maxDate} minDate={minDate}/>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={()=>setIsOpen(false)} style={styles.cancel}>
                        <Text style={fonts.cancel}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
                        <Text style={fonts.confirm}>확인</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    return (
        <>
            <View style={{backgroundColor:"#fff", padding:16,}}>
                <SearchBar searchText={searchWrd} onSearch={setSearchWrd} onButtonPress={()=>setSearchWrd("")} iconName={"eraser"} placeHolder={"점포 검색"} />
            </View>
            {
                (userType === "owner")?
                    <>
                    <View style={{borderColor:theme.primary, borderWidth:1, margin:16, borderRadius:16}}>
                        <Picker
                            style={{fontSize:"16"}}
                            selectedValue={selCstCo}
                            onValueChange={
                                (itemValue, itemIndex) =>{
                                    setSelCstco(itemValue)
                                    setSelectedStore(selectLIst.filter((el)=>{return el.CSTCO == itemValue})[0])
                                }
                            }
                        >
                            {
                            selectLIst.map((el, idx)=>{
                                    return <Picker.Item key={idx} label={el.CSTNA} value={el.CSTCO}/>
                                })
                            }
                            
                        </Picker>
                    </View>
                    </>
                :
                    null

            }
            <View style={styles.dateContainer}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <View style={styles.dateBox2}>
                        <Text style={fonts.dateStr}>{convertTime2(date, {format:"YYYY.MM.DD"})}</Text>
                        <TouchableOpacity onPress={()=>openDateChanger(0)}>
                            <AntDesign name="calendar" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[fonts.dateStr, {paddingHorizontal:4}]}>~</Text>
                    <View style={styles.dateBox2}>
                        <Text style={fonts.dateStr}>{convertTime2(date2, {format:"YYYY.MM.DD"})}</Text>
                        <TouchableOpacity onPress={()=>openDateChanger(1)}>
                            <AntDesign name="calendar" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ScrollView style={{flex:1, backgroundColor:"#F6F6F8"}} contentContainerStyle={{paddingHorizontal:16, paddingVertical:8, }}>
                {
                    (myStore.length > 0)?
                        myStore.filter(el=>el.cstNa.includes(searchWrd)).map((el, idx)=>{
                            return( <WageCard key={idx} item={el} userType={userType} onPress = {navigateWageDetail} /> )
                        })
                    :
                        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                            <Text style={fonts.noData}>데이터가 없습니다.</Text>
                        </View>
                }
            </ScrollView>
            <CustomBottomSheet2 isOpen={isOpen} onClose={()=>setIsOpen(false)}
                content={
                    (mode == 0)?
                        <DatePickerBottomSheet setIsOpen={setIsOpen} date={date} setDate={setDate} maxDate={date2}/>
                    :
                        <DatePickerBottomSheet setIsOpen={setIsOpen} date={date2} setDate={setDate2} minDate={date}/>
                }
            />

            
        </>
    );
}

const fonts = StyleSheet.create({
    dateStr:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#000000",
        marginRight:4
    },
    noData:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#999999"
    },
    cancel:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#999999"
    },
    confirm:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#FFFFFF"
    }
})
      
const styles = StyleSheet.create({
    dateBox:{
        flexDirection:"row", 
        backgroundColor:theme.primary, 
        padding:16, 
        marginHorizontal:16, 
        justifyContent:"space-between"
    },
    dateContainer:{
        backgroundColor:"#f6f6f8",
        flexDirection:"row", 
        padding:32, 
        justifyContent:"center"
    },
    dateBox2:{
        alignItems:"center",
        flexDirection:"row",
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:10,
        backgroundColor:"white",
        padding:8,
        paddingHorizontal:16,
    },
    dateBox_txt:{
        fontSize:16,
        color:theme.white
    },
    dateSheetContainer:{
        alignItems:"center",
        borderRadius: 15,
        backgroundColor: "#F7F7F7",
        marginBottom:16,
    },
    cancel:{
        flex:1,
        paddingVertical:17,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
        marginRight:9,
        alignItems:"center",
    },
    confirm:{
        flex:3,
        paddingVertical:17,
        borderRadius: 10,
        backgroundColor: "#3479EF",
        alignItems:"center",
    },
    row:{flexDirection:"row"}
});