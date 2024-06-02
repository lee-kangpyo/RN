
import { Text, ScrollView, SafeAreaView, View, StyleSheet } from "react-native";
import React, {useEffect, useState} from 'react';
import MyCalendar from "../components/Calendar";
import { FontAwesome } from '@expo/vector-icons';

export default function TestScreen() {
    return(
        <SafeAreaView>
            <View style={{paddingTop:0}}>
                <MyCalendar />
            </View>
            <View style={{flexDirection:"row", paddingHorizontal:16}}>
                <FontAwesome name="circle" size={24} color="#94FFD8" />
                <Text>메가커피 선릉점</Text>
            </View>
            <View style={{flexDirection:"row", paddingHorizontal:16}}>
                <FontAwesome name="circle" size={24} color="#94FFD8" />
                <Text>메가커피 선릉점</Text>
            </View>
            <View style={{flexDirection:"row", paddingHorizontal:16}}>
                <FontAwesome name="circle" size={24} color="#94FFD8" />
                <Text>메가커피 선릉점</Text>
            </View>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({

})