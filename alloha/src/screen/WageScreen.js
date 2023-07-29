
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { SearchBar } from 'react-native-screens';

export default function WageScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({title:"급여"})
    }, [navigation])

    return (
        <>
            <View style={{margin:16, paddingTop:150}}>
                <SearchBar searchText={"searchWrd"} onSearch={()=>{}} onButtonPress={()=>{}} iconName={"store-search"} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{ },
});