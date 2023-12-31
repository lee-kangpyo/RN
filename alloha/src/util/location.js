import * as Location from 'expo-location';

export const getLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
      console.log(location)
      return {
        mocked: location.mocked,
        accuracy: location.coords.accuracy,    
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } else {
      //console.log('Permission to access location was denied');
      return null;
    }
  } catch (error) {
    //console.error('Error getting location:', error);
    return null;
  }
};