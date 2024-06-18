import { Animated, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect } from 'react';
import { useRef } from "react";

const screen = Dimensions.get("screen")

export const CustomBottomSheet2 = ({isOpen, onClose, content}) => {
    const backDrop = (isOpen)?sheet.backDrop:{};
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current; // 애니메이션 초기 값은 화면 높이

    const slideUp = () => {
        Animated.timing(slideAnim, {
        toValue: 0, // 최종 값은 0 (원래 위치)
        duration: 200,
        useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height, // 화면 높이로 되돌아가기
        duration: 200,
        useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (isOpen) {
          slideUp();
        } else {
          slideDown();
        }
      }, [isOpen]);
    return (
        <>
        <View style={backDrop}/>
        {
            <Animated.View style={[sheet.container, {
                transform: [{ translateY: slideAnim }],
                },]}>
                {content}
            </Animated.View>
        }
        </>
    )
}

const sheet = StyleSheet.create({
    backDrop:{
        position:"absolute", 
        zIndex:30,
        left:0,
        top:0,
        backgroundColor:"rgba(0,0,0,0.5)", 
        height:screen.height,
        width:screen.width, 
    },
    container:{
        position:"absolute",
        zIndex:30,
        bottom:0,
        padding:20,
        borderTopEndRadius:15,
        borderTopStartRadius:15,
        backgroundColor:"white", 
        width:"100%", 
    }
})