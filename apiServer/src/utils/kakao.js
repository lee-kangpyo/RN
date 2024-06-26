
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

async function reverseGeocode(lat, lon) {
  console.log("카카오 gps -> 주소 변환 api");
  console.log(lat, lon);
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
      const doc = response.data.documents
      result = {
          resultCode:"00", 
          roadAddress:(doc.length == 0)?"":doc[0].road_address, 
          address:(doc.length == 0)?"":doc[0].address
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