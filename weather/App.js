import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.city}>
        <Text style={styles.cityName}>서울</Text>
      </View>
      <View style={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
      </View>
    </View>
  );
}200

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
    flex:3,
  },
  day:{
    flex:1,
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
