
import { Text, ScrollView, SafeAreaView, View } from "react-native";
import React, {useEffect, useState} from 'react';
import MyCalendar from "../components/Calendar";

export default function TestScreen() {
    return(
        <SafeAreaView>
            <View style={{paddingTop:70}}>
                <MyCalendar />
            </View>
        </SafeAreaView>
    );
}