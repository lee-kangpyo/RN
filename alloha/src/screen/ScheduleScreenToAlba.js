
import { StyleSheet, Text, View, ScrollView, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useId} from 'react';
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux';
import ScheduleByAlba from '../components/schedule/ScheduleByAlba';
import { getStartAndEndOfWeek, getWeekList } from '../util/moment';
import MyStorePicker from '../components/alba/MyStorePicker';

export default function ScheduleScreenToAlba({navigation}) {
    const userId = useSelector((state)=>state.login.userId)
    const week = useSelector((state)=>state.schedule.week);
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    const { thisSunday, nextSaturday } = getStartAndEndOfWeek();

    useEffect(()=>{
        navigation.setOptions({title:"주간근무계획"})
    }, [navigation])
    
    return (
        <View style={styles.container}>
            <MyStorePicker userId={userId} />
            <ScheduleByAlba cstCo={sCstCo} userId={userId} ymdFr={thisSunday} ymdTo={nextSaturday}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{flex:1, padding:15},
});