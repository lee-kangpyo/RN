
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

async function reverseGeocode(lat, lon) {
  const key = process.env.KAKAO_API
  let result = {resultCode:"-1"}

  await axios.get("https://dapi.kakao.com/v2/local/geo/coord2address", {
      params: {
        y: lat,
        x: lon
      },
      headers:{
          "content-type":"application/json;charset=UTF-8",
          "Authorization": `KakaoAK ${key}`
      }
  })
  .then(function (response) {
      result = {
          resultCode:"00", 
          roadAddress:response.data.documents[0].road_address, 
          address:response.data.documents[0].address
      }
  }).catch(function (error) {
      // 오류발생시 실행
      console.log(error)
  }).then(function() {
      // 항상 실행
      //console.log("항상 실행")
  });
  return result
};

module.exports = {reverseGeocode};