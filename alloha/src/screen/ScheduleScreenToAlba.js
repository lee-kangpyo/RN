import { ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScheduleByAlba from '../components/schedule/ScheduleByAlba';
import { getStartAndEndOfWeek } from '../util/moment';
import MyStorePicker from '../components/alba/MyStorePicker';
import PushTest from '../components/test/PushTest';
import HeaderControl from '../components/common/HeaderControl';
import { nextMonth, prevMonth } from '../../redux/slices/result';

export default function ScheduleScreenToAlba({navigation}) {
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const date = useSelector((state) => state.result.month);
    //const { thisSunday, thisSaturday } = getStartAndEndOfWeek();
    const [loading, SetLoading] = useState(true);
    useEffect(()=>{
        navigation.setOptions({title:"근무계획"})
    }, [navigation]);

    return (
        (loading)?
            <View style={styles.container}>
                <MyStorePicker userId={userId} isComplete = {()=>SetLoading(false)} />
                <View style={{flex:1, justifyContent:"center"}}>
                    <ActivityIndicator />
                </View>
            </View>
        :
            (sCstCo  == -1)?
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <Text>등록된 점포가 없습니다. 점포검색을 이용해 주세요</Text>
                </View>
            :
                <View style={styles.container}>
                    <MyStorePicker userId={userId} />
                    <View style={{marginVertical:20}}>
                        <HeaderControl title={`${date.mm}월`} onLeftTap={()=> dispatch(prevMonth())} onRightTap={()=> dispatch(nextMonth())} />
                    </View>
                    <View style={{padding:8}} />
                    {/* <ScheduleByAlba cstCo={sCstCo} userId={userId} ymdFr={thisSunday} ymdTo={thisSaturday}/> */}
                    <ScheduleByAlba cstCo={sCstCo} userId={userId} ymdFr={date.start} ymdTo={date.end}/>
                </View>
    );
}

const styles = StyleSheet.create({
    container:{flex:1, padding:15},
});