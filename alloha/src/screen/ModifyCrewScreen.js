
import { StyleSheet, Text, View, Image } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function ModifyCrewScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"알바수정"})
    }, [navigation])

    return (
        <View style={styles.container}>
            <Text>알바수정 진행중</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    sampleImage:{width:"100%", height:"100%"}
});