import React, { useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CurTimer() {
    const [timer, setTimer] = useState("");
    const [day, setDay] = useState("");

    const currentTimer = () => {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        setTimer(`${hours}:${minutes}:${seconds}`)
    }

    const currentDay = () => {
        const date = new Date();
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
        setDay(date.getFullYear()+"년 "+(date.getMonth()+1)+"월 "+date.getDate()+"일 ("+dayOfWeek+")");
    };
    

    const startTimer = () => {
        setInterval(currentTimer, 1000)
    }
    
    useEffect(()=>{
        startTimer()
        currentDay();
    }, [])

    return (
        <>
            <Text style={styles.timer}>{timer}</Text>
            <Text>{day}</Text>
        </>
    )
};
const styles = StyleSheet.create({
    timer: {
      fontSize:16,
      fontWeight:"bold"
    },
  });