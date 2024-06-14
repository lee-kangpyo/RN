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
        //setDay(date.getFullYear()+"년 "+(date.getMonth()+1)+"월 "+date.getDate()+"일 ("+dayOfWeek+")");
        setDay(date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate()+"("+dayOfWeek+")");
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
            <Text style={styles.date}>{day}</Text>
        </>
    )
};
const styles = StyleSheet.create({
    timer: {
        fontFamily: "SUIT-ExtraBold",
        fontSize: 20,
        fontWeight: "800",
        fontStyle: "normal",
        color: "#111111",
        marginBottom:4,
    },
    date:{
        fontFamily: "SUIT-Medium",
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        color: "#555555"
    }
  });