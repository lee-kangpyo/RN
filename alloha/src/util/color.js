export const theme = {
    green:"#13BD7E",
    purple:"#7219ed",
    white:"#fff",
    grey:"#C4C4C4",
    primary:"#3479EF",
    error:"#EB9AC3",
    correct:"#A9BCE0",
    darkGrey:"#A9A9A9",
    black:"#000",
    blurblack:"#666",
    red:"#f3444f",
    link:"#30CD93",
    open:"#FF634F",
    middle:"#28B49A",
    close:"#3479EF",
    etc:"#B080FF",
    yellow:"#FFEAA7",
    orange:"#FFBB64",
    grey2:"#B6BBC4",
    sky:"#4CB9E7",
    lightgrey:"#EDEDED",
    backGround:"rgb(242, 242, 242)",
    selectBox:"rgba(221, 221, 221, 1.0)"
}

// 색을 연하게 만드는 함수 (HSL 색상 모델 사용)
export const lightenColor = (color, percentage) => {
    if (!color) {
        return '#FFFFFF'; // 기본 색상 하얀색
    }

    const num = parseInt(color.replace("#", ""), 16);
    let r = (num >> 16) + Math.round(2.55 * percentage);
    let g = (num >> 8 & 0x00FF) + Math.round(2.55 * percentage);
    let b = (num & 0x0000FF) + Math.round(2.55 * percentage);

    // r, g, b 값이 0~255 범위를 벗어나지 않도록 조정
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${(0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1).toUpperCase()}`;
};