import { Dimensions, StyleSheet, View } from "react-native";
import React from 'react';

const screen = Dimensions.get("screen")

export const CustomBottomSheet2 = ({isOpen, onClose, content}) => {
    const backDrop = (isOpen)?sheet.backDrop:{};
    return (
        <>
        <View style={backDrop}/>
        {
            (isOpen)?
                <View style={sheet.container}>
                    {content}
                </View>
            :
                null
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