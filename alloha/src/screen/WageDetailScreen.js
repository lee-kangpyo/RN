
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { color } from 'react-native-reanimated';
import { theme } from '../util/color';

export default function WageDetailScreen({navigation, route}) {
    useEffect(()=>{
        navigation.setOptions({title:route.params.title})
    }, [navigation])

    return (
        <View style={{margin:16}}>
            <Text>디테일 화면</Text>
        </View>
    );
}
      
const styles = StyleSheet.create({
    container:{ },
    
});