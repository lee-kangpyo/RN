
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import sampleImage from '../../assets/community.png';

export default function EtcScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"기타"})
    }, [navigation])

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.push("storeList")}
            >
                <Text>점포관리</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.push("ManageCrew")}
            >
                <Text>알바관리</Text>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    sampleImage:{width:"100%", height:"100%"}
});