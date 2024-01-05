import * as Location from 'expo-location';

export const getReverseGeocodeAsync = async (latitude, longitude) => {
  try {
    let location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (location && location.length > 0) {
      const address = location[0];
      console.log(`주소: ${address.city}, ${address.region}, ${address.country}`);
    } else {
      console.log('주소를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('주소 검색 중 오류 발생:', error);
  }
};

