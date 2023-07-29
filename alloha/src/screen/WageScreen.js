
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { theme } from '../util/color';

export default function WageScreen({navigation}) {
    const [searchWrd, setSearchWrd] = useState("");
    useEffect(()=>{
        navigation.setOptions({title:"급여"})
    }, [navigation])

    const getDate = (isFirstDay) => {
        const currentDate = new Date();
        const targetDate = new Date(currentDate);
      
        if (isFirstDay) {
          targetDate.setDate(1);
        } else {
          targetDate.setMonth(targetDate.getMonth() + 1);
          targetDate.setDate(0);
        }
      
        return targetDate;
    }
    
    const [date, setDate] = useState(getDate(true));
    const [date2, setDate2] = useState(getDate(false));
    const [mode, setMode] = useState('date');
    const [startShow, setStartShow] = useState(false);
    const [endShow, setEndShow] = useState(false);

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
    };

    const showMode = (currentMode) => {
        setStartShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    return (
        <>
            <View style={{margin:16}}>
                <SearchBar searchText={searchWrd} onSearch={setSearchWrd} onButtonPress={()=>{}} iconName={"magnify"} placeHolder={"점포 검색"} />
            </View>
            <View style={styles.dateBox}>
                <View style={{flexDirection:"row"}}>
                    <Text style={styles.dateBox_txt}>{date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, '0')}-{String(date.getDate()).padStart(2, '0')}</Text>
                    <Text style={styles.dateBox_txt}> ~ </Text>
                    <Text style={styles.dateBox_txt}>{date2.getFullYear()}-{String(date2.getMonth() + 1).padStart(2, '0')}-{String(date2.getDate()).padStart(2, '0')}</Text>
                </View>
                <TouchableOpacity onPress={showDatepicker}>
                    <AntDesign name="calendar" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{margin:16}}>
                <TouchableOpacity onPress={()=>{navigation.navigate("WageDetail", { title: '메가커피 선릉' })}}>
                    <Text>메가커피 선릉</Text>
                </TouchableOpacity>

            </View>

            {startShow && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                />
            )}
            {endShow && (
                <DateTimePicker
                testID="dateTimePicker2"
                value={date2}
                minimumDate={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange2}
                />
            )}
            
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