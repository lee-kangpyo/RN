
function parseJSON(str) {
    // 문자열을 콤마로 분할하여 각 키-값 쌍을 배열로 만듭니다.
    var keyValuePairs = str.split(',');

    // 결과 객체를 초기화합니다.
    var result = {};

    // 각 키-값 쌍에 대해 반복합니다.
    keyValuePairs.forEach(function(keyValuePair) {
        // 등호를 기준으로 키와 값으로 분할합니다.
        var parts = keyValuePair.split('=');
        var key = parts[0].trim(); // 공백을 제거한 키
        var value = parts[1].trim(); // 공백을 제거한 값
        // 결과 객체에 키-값 쌍을 추가합니다.
        result[key] = value;
    });

    return result;
}

module.exports = parseJSON;