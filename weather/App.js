import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { API_KEY } from './env';

const { width:SCREEN_WIDTH } = Dimensions.get("window");
//원래는 서버에서 호출해야되지만 앱에서 호출 하도록 설정 api키는 다르js 파일에 저장함
const API_KEY=API_KEY;
const icons = {
  Clouds:"cloudy",
  Clear:"day-sunny",
  Atmosphere:"cloudy-gusts",
  Snow:"snow",
  Rain:"rain",
  Drizzle:"rain",
  Thunderstorm:"lightning"
}

export default function App() {
  const [posName, setPosName] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setOk(false);
      return;
    }
    let {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    setLocation({latitude, longitude});

    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    (location[0].city)?setPosName(location[0].city):setPosName(location[0].district);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=kr&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.list)
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.city}>
        <Text style={styles.cityName}>{posName}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 
          ? 
            (
              <View style={{...styles.day, alignItems:"center", }}>
                <ActivityIndicator color="white" size="large" style={{marginTop:10}}/>
              </View>
            ) 
          : 
            (
              days.map((day, index)=> 
                <View key={index} style={styles.day}>
                  <Text style={styles.curTime}>{day.dt_txt.split(" ")[0].split("-")[0]}년 {day.dt_txt.split(" ")[0].split("-")[1]}월 {day.dt_txt.split(" ")[0].split("-")[2]}일</Text>
                  <Text style={styles.curTime}> {day.dt_txt.split(" ")[1].split(":")[0]}시</Text>
                  <View style={{flexDirection:"row", alignItems:"baseline", width:"100%", justifyContent:"space-between"}}>
                    <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                    <Fontisto name={icons[day.weather[0].main]} size={60} color="white" />
                  </View>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                </View>
              )
              
            ) 
          }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor:"orange"
  },
  city:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName:{
    color:"white",
    fontSize:68,
    fontWeight:"500"
  },
  weather:{
  },
  day:{
    paddingLeft:16,
    paddingRight:16,
    width:SCREEN_WIDTH,
    alignItems:"flex-start",
    paddingTop:0,
  },

  temp:{
    color:"white",
    marginTop:30,
    fontSize:80,
  },
  description:{
    color:"white",
    marginTop:-10,
    fontSize:30,
  },
  curTime:{
    alignSelf:"center",
    color:"white",
    fontSize:30
  },
  tinyText:{
    color:"white",
    fontSize:20
  }

});
