
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { theme } from '../util/color';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import {Picker} from '@react-native-picker/picker';
import WageCard from '../components/WageCard';
import { DatePiker } from '../components/DateTimePicker';

export default function WageScreen({navigation, route}) {
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
    const [mode, setMode] = useState('date');
    const [startShow, setStartShow] = useState(false);
    const [endShow, setEndShow] = useState(false);

    

    const getStoreForSalary = async () => {
        await HTTP("GET", "/api/v1/getMyStoreForSalary", {"userType":userType, "userId":userId,})
            .then((res)=>{
                setSelectList(res.data.storeList);
            }
        )
    }
    const getSalary = async (cstCo) => {
        console.log("cstco:"+cstCo)
        const ymdFr = date.getFullYear()+String(date.getMonth() + 1).padStart(2, '0')+String(date.getDate()).padStart(2, '0');
        const ymdTo = date2.getFullYear()+String(date2.getMonth() + 1).padStart(2, '0')+String(date2.getDate()).padStart(2, '0');
        await HTTP("GET", "/api/v1/getSalary", {"userType":userType, "ymdFr":ymdFr, "ymdTo":ymdTo, "userId":userId, "cstCo":cstCo})
            .then((res)=>{
                console.log(res.data.salary)
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
    }, [])

    useEffect(()=>{
        if(userType === "owner"){
            getSalary(selCstCo);
        }
    }, [selCstCo])

    
    useEffect(()=>{
        navigation.setOptions({title:"급여"})
    }, [navigation])



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setStartShow(false);
        setDate(currentDate);
        if(event.type === "set") setEndShow(true);
    };

    const onChange2 = (event, selectedDate) => {
        const currentDate = selectedDate;
        setEndShow(false);
        setDate2(currentDate);
        // 조회 시작
        getSalary()
    };

    const showMode = (currentMode) => {
        setStartShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const navigateWageDetail = ({title, cstCo, userId}) => {
        const ymdFr = date.getFullYear()+String(date.getMonth() + 1).padStart(2, '0')+String(date.getDate()).padStart(2, '0');
        const ymdTo = date2.getFullYear()+String(date2.getMonth() + 1).padStart(2, '0')+String(date2.getDate()).padStart(2, '0');
        navigation.navigate("WageDetail", { title: title, cstCo:cstCo, userId:userId, ymdFr:ymdFr, ymdTo:ymdTo});
    }

    return (
        <>
            <View style={{margin:16}}>
                <SearchBar searchText={searchWrd} onSearch={setSearchWrd} onButtonPress={()=>{}} iconName={"magnify"} placeHolder={"점포 검색"} />
            </View>
            {
                (userType === "owner")?
                    <View style={{borderColor:theme.primary, borderWidth:1, margin:16, borderRadius:16}}>
                        <Picker
                            style={{fontSize:"16"}}
                            selectedValue={selCstCo}
                            onValueChange={(itemValue, itemIndex) =>{
                                console.log("@!@#!$!")
                                console.log(selectLIst.filter((el)=>{return el.CSTCO == itemValue}))
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
                :
                    null

            }
            

            <View style={styles.dateBox}>
                <View style={{flexDirection:"row"}}>
                    <DatePiker date={date} mode={"date"} onChanged={(day)=>setDate(day)} txtStyle={styles.dateBox_txt} />
                    <Text style={styles.dateBox_txt}> ~ </Text>
                    <DatePiker date={date2} mode={"date"} onChanged={(day)=>setDate2(day)} txtStyle={styles.dateBox_txt} />
                </View>
                <TouchableOpacity onPress={showDatepicker}>
                    <AntDesign name="calendar" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {startShow && (
                <>
                
                <DateTimePicker
                    locale="ko-kr"
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                />
                </>
            )}
            {endShow && (
                <DateTimePicker
                    locale="ko-kr"
                    testID="dateTimePicker2"
                    value={date2}
                    minimumDate={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange2}
                />
            )}

            <View style={{padding:8}}>
                {
                    myStore.map((el, idx)=>{
                        return<WageCard key={idx} item={el} userType={userType} onPress = {navigateWageDetail} />;
                    })
                }

            </View>
            
        </>
    );
}
      
const styles = StyleSheet.create({
    container:{ },
    dateBox:{
        flexDirection:"row", 
        backgroundColor:theme.primary, 
        padding:16, 
        marginHorizontal:16, 
        justifyContent:"space-between"
    },
    dateBox_txt:{
        fontSize:16,
        color:theme.white
    }
});