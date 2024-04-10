
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { theme } from '../../util/color';

export default function CustomButton({text, onClick, style, fontStyle={}, fontColor="white", fontSize=16, disabled=false}) {
    return (
        <TouchableOpacity style={[styles.container, style, disabled && styles.disabled]} onPress={onClick} disabled={disabled}>
            <Text style={[{color:fontColor, fontSize:fontSize}, fontStyle]}>{text}</Text>
        </TouchableOpacity>
        
    );
}

const styles = StyleSheet.create({
    container:{ backgroundColor:theme.link, borderRadius:5, padding:15, },
    btnColor:{color:"white"},
    disabled: {
        backgroundColor:theme.grey
      },
});