
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function SettingsScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"급여"})
    }, [navigation])

    return (
        <View style={styles.container}>
            <Text>이 페이지는 준비중입니다.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16},
});