
import { StyleSheet, Text, View, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import sampleImage from '../../assets/community.png';

export default function BoardScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"커뮤니티"})
    }, [navigation])

    return (
        <View style={styles.container}>
            <Image style={styles.sampleImage} source={sampleImage}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center'},
    sampleImage:{width:"100%", height:"100%"}
});