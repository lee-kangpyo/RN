
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function SettingsScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"점포관리"})
    }, [navigation])

    return (
        <View style={styles.container}>
            <Text>setting!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16},
});