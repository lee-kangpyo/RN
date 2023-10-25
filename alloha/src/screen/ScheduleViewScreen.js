
import { StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

export default function ScheduleViewScreen({navigation}) {
    const ref = useRef();
    const albas = useSelector((state)=>state.schedule.albas)
    const dispatch = useDispatch();

    useEffect(()=>{
        navigation.setOptions({title:"시간표 일별 조회"})
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => test()}>
                    <Ionicons name="download-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation])


    const test = () => {
        // 이미지 저장 관련 로직을 수행하거나 다른 함수 호출
        ref.current.capture().then(async uri => {
            console.log("do something with ", uri);
            await Sharing.shareAsync(
                Platform.OS === 'ios' ? `file://${uri}` : uri,
                {
                  mimeType: 'image/png',
                  dialogTitle: '공유하기',
                  UTI: 'image/png',
                },
              );
        });
    }

    return (
        <View style={[styles.container, styles.containerBox]}>
            <Text>10월 4주차 일정표</Text>
            <ViewShot ref={ref} options={{ fileName: "capture", format: "jpg", quality: 0.9 }}>
                <View style={styles.box}>
                    <Text>10 / 22 (일)</Text>
                    <View style={styles.line}>
                        <View style={styles.box}>
                            <Text>이하나</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>07:30 ~ 1:30</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>            </Text>
                        </View>
                        <View style={styles.box}>
                            <Text>4.0</Text>
                        </View>
                    </View>
                    <View style={styles.line}>
                        <View style={styles.box}>
                            <Text>용호명</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>08:00 ~ 12:00</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>            </Text>
                        </View>
                        <View style={styles.box}>
                            <Text>4.0</Text>
                        </View>
                    </View>
                    <View style={styles.line}>
                        <View style={styles.box}>
                            <Text>강다니엘</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>11:30 ~ 16:00</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>16:00 ~ 19:00</Text>
                        </View>
                        <View style={{...styles.box, flexDirection:"column"}}>
                            <Text>4.0</Text>
                            <Text>3.0</Text>
                        </View>
                    </View>
                </View>
            </ViewShot>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    containerBox:{
        paddingVertical:10,
        margin:15,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignItems:"flex-start",
    },
    box:{
        backgroundColor:"white",
        paddingVertical:10,
        margin:15,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    line:{ flexDirection:"row"},
});