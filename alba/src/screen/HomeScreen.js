
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function HomeScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"출퇴근"})
    }, [navigation])
    
    return (
        <View style={styles.container}>
        <Text>Home!</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16 },
});