import React, {useEffect, useState} from 'react';
import { Button, View, StyleSheet, Text, ScrollView, Alert } from 'react-native';

import { URL } from "@env";

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { GeofencingEventType } from 'expo-location';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_TASK_NAME = 'background-location-task';


function PermissionsButton () {
  const [fore, setFore] = useState("아직 안받음");
  const [back, setBack] = useState("아직 안받음");

  const test = async () => {
    console.log("테스트")
    const result = await TaskManager.getRegisteredTasksAsync()
    console.log(result);
  }

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    console.log("포그라운드" + foregroundStatus)
    setFore(foregroundStatus)
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      console.log("백그라운드" + backgroundStatus)
      setBack(backgroundStatus)
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          timeInterval: 60000,
          //deferredUpdatesDistance:1,
          deferredUpdatesInterval: 100,
          accuracy: Location.Accuracy.BestForNavigation,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
              notificationTitle: "알로하",
              notificationBody: "알로하가 위치 기반으로 출퇴근을 여부를 체크하고 있습니다.",
              notificationColor: "#fff",
          },
        });
        console.log("내위치 추적 시작")
      }
    }
  };

  return(
      <View style={styles.container}>
          <Button onPress={requestPermissions} title="Enable background location" />
          <Button onPress={test} title="test" />
          <Text>{fore}</Text>
          <Text>{back}</Text>
          <Text>{URL}</Text>
      </View>
  )
};

TaskManager.defineTask(LOCATION_TASK_NAME,  async ({ data, error } ) => {
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

  if (error) {
    // check `error.message` for more details.
    return;
  }
  if(data){
    let id = await AsyncStorage.getItem("id")
    id = (id)?id:"테스트아이디"
    const { locations } = data;
    await axios.get("http://13.124.217.193:8546"+"/api/v1/testTaskManager", {params:{id:id, log:"You've move location[dev]", lat:locations[0].coords.latitude, lon:locations[0].coords.longitude, day:getCurrentTimeWithDate()}})
    .catch((err)=>{console.log(err)})
  }
  
    
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PermissionsButton;
