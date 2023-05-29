import { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

const test = {
    latitude:37.541602,
    longitude:127.0928316
}

const GoogleMap = () => {
  return(
  <View style={styles.screen}>
  	  <MapView 
		style={styles.map}
        minZoomLevel={10}
        maxZoomLevel={20}
		initialRegion={{
            latitude: test.latitude,
            longitude: test.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        //showsUserLocation={true}
        //showsScale={true}
        //zoomControlEnabled={true}
        provider={PROVIDER_GOOGLE}
		> 
    	<Marker
            coordinate={{
            latitude: test.latitude,
            longitude: test.longitude,
          }}
            pinColor="#2D63E2"
            title="하이"
            description="테스트"
          />

        <Circle 
            center={{
                latitude: test.latitude,
                longitude: test.longitude,
              }}
            radius={1000}
            strokeWidth={1}
            strokeColor='rgba(0,0,0,0.5)'
            fillColor='rgba(0,0,0,0.5)'
            lineCap='butt'
        />
    
      </MapView>
  </View>
  )
  
}

export default GoogleMap

const styles = StyleSheet.create({
	screen:{
      flex:1
    },
  	map:{
	  width: 300,
  	  height : 500
	}
})