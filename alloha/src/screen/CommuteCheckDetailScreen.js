
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import CommuteDetail from '../components/commuteCheck/CommuteDetail';
import CommuteInfo from '../components/commuteCheck/CommuteInfo';

export default function CommuteCheckDetailScreen({navigation, route}) {
    const { ymd } = route.params;
    const [YYYYMMDD, setYYYYMMDD] = useState(ymd);
    const userId = useSelector((state)=>state.login.userId);
    useEffect(()=>{
        navigation.setOptions({title:"근무내역"})
    }, [navigation])

    const onModifyBtnpressed = () => {
        console.log("근무기록변경버튼클릭")
    }

    return (
        <View style={styles.container}>
            <CommuteInfo day = {YYYYMMDD} />
            <CommuteDetail day = {YYYYMMDD} onModifyBtnpressed={onModifyBtnpressed} />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:10 },

});