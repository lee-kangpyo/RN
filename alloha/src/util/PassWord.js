
export const generateSecureRandomPassword = (length) => {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';
  
    // 최소 한 개의 각 유형 문자를 포함시키기 위해 미리 추가합니다
    let password = '';
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  
    const allCharacters = upperCase + lowerCase + numbers + specialCharacters;
  
    // 나머지 길이를 무작위로 채웁니다
    for (let i = 4; i < length; i++) {
      password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }
  
    // 무작위로 비밀번호를 섞어줍니다
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }