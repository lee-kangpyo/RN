
import { ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ScheduleByAlba from '../components/schedule/ScheduleByAlba';
import { getStartAndEndOfWeek } from '../util/moment';
import MyStorePicker from '../components/alba/MyStorePicker';
import PushTest from '../components/test/PushTest';




export default function ScheduleScreenToAlba({navigation}) {
    const userId = useSelector((state)=>state.login.userId)
    //const week = useSelector((state)=>state.schedule.week);
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    const { thisSunday, thisSaturday } = getStartAndEndOfWeek();
    const [loading, SetLoading] = useState(true);
    useEffect(()=>{
        navigation.setOptions({title:"주간근무계획"})
    }, [navigation])
    return (
        (loading)?
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <MyStorePicker userId={userId} isComplete = {()=>SetLoading(false)} />
                <ActivityIndicator />
            </View>
        :
            (sCstCo  == -1)?
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <Text>등록된 점포가 없습니다. 점포검색을 이용해 주세요</Text>
                </View>
            :
                <View style={styles.container}>
                    <PushTest />
                    <MyStorePicker userId={userId} />
                    <ScheduleByAlba cstCo={sCstCo} userId={userId} ymdFr={thisSunday} ymdTo={thisSaturday}/>
                </View>
    );
}

const styles = StyleSheet.create({
    container:{flex:1, padding:15},
});