import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

const { width:SCREEN_WIDTH } = Dimensions.get("window");
//원래는 서버에서 호출해야되지만 앱에서 호출 하도록 설정 api키는 실행할때 새로 발급받아 사용
const API_KEY="";

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
    //console.log(location);
    (location[0].city)?setPosName(location[0].city):setPosName(location[0].district);
    //console.log(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=kr&appid=${API_KEY}&units=metric`);
    
    const json = await response.json();
    //console.log(json.list)
    setDays(json.list)
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.city}>
        <Text style={styles.cityName}>{posName}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 
          ? 
            (
              <View style={styles.day}>
                <ActivityIndicator color="white" size="large" style={{marginTop:10}}/>
              </View>
            ) 
          : 
            (
              days.map((day, index)=> 
                <View key={index} style={styles.day}>
                  <Text style={styles.curTime}>{day.dt_txt.split(" ")[0]}</Text>
                  <Text style={styles.curTime}>{day.dt_txt.split(" ")[1].split(":")[0]}시</Text>
                  <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
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
    color:"black",
    fontSize:68,
    fontWeight:"500"
  },
  weather:{
  },
  day:{
    width:SCREEN_WIDTH,
    alignItems:"center",
    paddingTop:30,
  },
  temp:{
    marginTop:20,
    fontSize:150,
  },
  description:{
    marginTop:-30,
    fontSize:60,
  },
  curTime:{
    fontSize:30
  },
  tinyText:{
    fontSize:20
  }

});
