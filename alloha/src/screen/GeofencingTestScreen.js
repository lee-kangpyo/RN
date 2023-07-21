import React, {useEffect, useState} from 'react';
import { Button, View, StyleSheet, Text, ScrollView, Alert } from 'react-native';

import { DEV_URL } from "@env";

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { GeofencingEventType } from 'expo-location';

import axios from 'axios';


const LOCATION_TASK_NAME = 'background-location-task';


function PermissionsButton () {
  const [fore, setFore] = useState("아직 안받음");
  const [back, setBack] = useState("아직 안받음");

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    console.log("포그라운드" + foregroundStatus)
    setFore(foregroundStatus)
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      console.log("백그라운드" + backgroundStatus)
      setBack(backgroundStatus)
      if (backgroundStatus === 'granted') {
        await Location.startGeofencingAsync(LOCATION_TASK_NAME, [{
          identifier:"1",
          latitude:37.5415495,
          longitude:127.0928167,
          radius:20
        }]);
        console.log("지오펜싱 시작")
      }
    }
  };
  return(
    
      <View style={styles.container}>
          <Button onPress={requestPermissions} title="Enable background location" />
          <Text>{fore}</Text>
          <Text>{back}</Text>
      </View>
  )
};

TaskManager.defineTask(LOCATION_TASK_NAME,  async ({ data: { eventType, region }, error } ) => {
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
  
  if (eventType === GeofencingEventType.Enter) {
    //console.log("You've entered region:", region.latitude+", "+region.longitude)
    await axios.get(DEV_URL+"/api/v1/testTaskManager", {params:{log:"You've entered region[app]", lat:region.latitude, lon:region.longitude, day:getCurrentTimeWithDate()}})
    .catch((err)=>{console.log(err)})
  } else if (eventType === GeofencingEventType.Exit) {
    //console.log("You've left region:", region.latitude+", "+region.longitude)
    await axios.get(DEV_URL+"/api/v1/testTaskManager", {params:{log:"You've left  region[app]" + region.latitude+", "+region.longitude, day:getCurrentTimeWithDate()}})
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
