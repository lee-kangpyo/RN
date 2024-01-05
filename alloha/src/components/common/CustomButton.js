
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { theme } from '../../util/color';

export default function CustomButton({text, onClick, style, fontColor="white", fontSize=16}) {

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onClick}>
            <Text style={{color:fontColor, fontSize:fontSize}}>{text}</Text>
        </TouchableOpacity>
        
    );
}

const styles = StyleSheet.create({
    container:{ backgroundColor:theme.link, borderRadius:5, padding:15, },
    btnColor:{color:"white"},
});