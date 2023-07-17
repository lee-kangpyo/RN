import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';

export default function GetLocationPermission({Grant, Deny}){
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('위치 정보 권한이 허용되지 않았습니다.');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }
  
    return (
        <>
        {
            (errorMsg)?
                <View style={styles.container}>
                    <Text style={styles.paragraph}>{text}</Text>
                </View>
            :
                <Grant/>
        }
        </>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    paragraph:{
        fontSize:16,
    }

});