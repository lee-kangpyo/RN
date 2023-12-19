
import { StyleSheet, Text, View, ScrollView, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useId} from 'react';
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux';
import ScheduleByAlba from '../components/schedule/ScheduleByAlba';
import { getWeekList } from '../util/moment';
import MyStorePicker from '../components/alba/MyStorePicker';

export default function ScheduleScreenToAlba({navigation}) {
    const userId = useSelector((state)=>state.login.userId)
    const week = useSelector((state)=>state.schedule.week);
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    useEffect(()=>{
        navigation.setOptions({title:"주간근무계획"})
    }, [navigation])

    function getFormattedDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }
        
    function getStartAndEndOfWeek() {
        const now = new Date();
        const currentDayOfWeek = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
        // 이번 주 일요일
        const thisSunday = new Date(now);
        thisSunday.setDate(now.getDate() - currentDayOfWeek);
        // 이번 주 토요일
        const thisSaturday = new Date(thisSunday);
        thisSaturday.setDate(thisSunday.getDate() + 6);
        // 다음 주 일요일
        const nextSunday = new Date(thisSunday);
        nextSunday.setDate(thisSunday.getDate() + 7);
        // 다음 주 토요일
        const nextSaturday = new Date(thisSaturday);
        nextSaturday.setDate(thisSaturday.getDate() + 7);
        // 다다음 주 일요일
        const nextnextSunday = new Date(thisSunday);
        nextSunday.setDate(thisSunday.getDate() + 14);
        // 다다음 주 토요일
        const nextnextSaturday = new Date(thisSaturday);
        nextSaturday.setDate(thisSaturday.getDate() + 14);
        return {
            thisSunday: getFormattedDate(thisSunday),
            thisSaturday: getFormattedDate(thisSaturday),
            nextSunday: getFormattedDate(nextSunday),
            nextSaturday: getFormattedDate(nextSaturday),
        };
    }
    const { thisSunday, nextSaturday } = getStartAndEndOfWeek();
    return (
        <View style={styles.container}>
            <MyStorePicker userId={userId} />
            <ScheduleByAlba cstCo={sCstCo} userId={userId} ymdFr={thisSunday} ymdTo={nextSaturday}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{flex:1},
});