
import { ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ScheduleByAlba from '../components/schedule/ScheduleByAlba';
import { getStartAndEndOfWeek } from '../util/moment';
import MyStorePicker from '../components/alba/MyStorePicker';

export default function ScheduleScreenToAlba({navigation}) {
    const userId = useSelector((state)=>state.login.userId)
    //const week = useSelector((state)=>state.schedule.week);
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    const { thisSunday, nextSaturday } = getStartAndEndOfWeek();

    useEffect(()=>{
        navigation.setOptions({title:"주간근무계획"})
    }, [navigation])
    return (
        (sCstCo > 0)?
            <View style={styles.container}>
                <MyStorePicker userId={userId} />
                <ScheduleByAlba cstCo={sCstCo} userId={userId} ymdFr={thisSunday} ymdTo={nextSaturday}/>
            </View>
        :
        (sCstCo == "-1")?
            <>
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <MyStorePicker userId={userId} />
                <ActivityIndicator />
            </View>
            </>
        :
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <Text>등록된 점포가 없습니다. 점포검색을 이용해 주세요</Text>
            </View>
    );
}

const styles = StyleSheet.create({
    container:{flex:1, padding:15},
});