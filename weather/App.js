import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

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

    const location = await Location.reverseGeocodeAsync(location, {useGoogleMaps:false});
    console.log(location);
    (location[0].city)?setPosName(location[0].city):setPosName(location[0].district);
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
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
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
  },
  temp:{
    marginTop:50,
    fontSize:178,
  },
  description:{
    marginTop:-30,
    fontSize:60,
  },

});
