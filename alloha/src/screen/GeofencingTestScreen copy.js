import React, {useEffect, useState} from 'react';
import { Button, View, StyleSheet, Text, ScrollView } from 'react-native';
import * as TaskManager from 'expo-task-manager';

import * as Location from 'expo-location';
import { GeofencingEventType } from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSelector } from 'react-redux';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  console.log("포그라운드" + foregroundStatus)
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    console.log("백그라운드" + backgroundStatus)
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        timeInterval: 60000,
        deferredUpdatesInterval: 100,
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
            notificationTitle: "Location",
            notificationBody: "Location tracking in background",
            notificationColor: "#fff",
        },
      });
      console.log("위치 업데이트 시작")
    }
  }
};

function PermissionsButton () {
  
  return(
      <View style={styles.container}>
          <Button onPress={requestPermissions} title="Enable background location" />
      </View>
  )
};

TaskManager.defineTask(LOCATION_TASK_NAME,  async ({ data, error }) => {
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
    //console.log(getCurrentTimeWithDate() + " : " +locations[0].coords.latitude + ", " + locations[0].coords.longitude)
    // AsyncStorage를 사용하여 데이터 저장
    // 메인 스레드에서 상태 업데이트

    await axios.get("http://192.168.8.103:8080/api/v1/testTaskManager", {params:{log:getCurrentTimeWithDate() + " : " +locations[0].coords.latitude + ", " + locations[0].coords.longitude}})
    //.then((data)=>{
    //}).error((err)=>{
    //})
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const getCurrentTimeWithDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
    const currentTimeWithDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return currentTimeWithDate;
  };

export default PermissionsButton;
