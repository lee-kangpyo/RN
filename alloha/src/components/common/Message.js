import { Alert } from "react-native"

/**
 * 사용자에게 알림을 보여줍니다.
 * 
 * @param {string} title - 알림의 목적을 입력합니다.
 * @param {string} content - 알림의 상세 내용을 입력합니다.
 */


export default function Message (title, content) {
    return Alert.alert(
        title, content,
        [
            {text:"확인"},
        ]
    )
}


/**
 * @typedef {Object} confirmPosOrder
 * @property {boolean} LEFT - 확인, 취소 순서로 배치
 * @property {boolean} RIGHT - 취소, 확인 순서로 배치
 */

/**
 * @type {confirmPosOrder} - Confirm 함수에서 사용되는 named parameter인 confirmPosOrder의 값이 정의 되어 있습니다.
 * @param
 *  LEFT - 확인, 취소 순서로 배치
 * @param
 *  RIGHT - 취소, 확인 순서로 배치
 */
export const CONFIRM_POSITION = {
    LEFT: true,
    RIGHT: false
  }
/**
 * 프로세스를 진행/취소할지 묻는 confirm을 사용자에게 보여줍니다..
 * 
 * @param {string} title - 컴펌의 목적을 입력합니다.
 * @param {string} content - 컴펌의 상세 내용을 입력합니다.
 * @param {Object} options - 옵션 객체입니다. 이 파라메터는 기본값이 있습니다.
 * @param {string} options.confirmText - 확인 버튼의 글자입니다. 기본값은'네' 입니다.
 * @param {string} options.cancelText - 취소 버튼의 글자입니다. 기본값은'아니오' 입니다.
 * @param {function} options.confirm - 확인 버튼의 클릭시 작동될 함수입니다.
 * @param {function} options.cancel - 취소 버튼 클릭시 작동될 함수입니다.
 * @param {boolean} options.confirmPosOrder - 버튼 순서를 결정합니다. CONFIRM_POSITION을 IMPORT해서 사용, 기본값은 CONFIRM_POSITION.LEFT 입니다.
 */
export const Confirm = (title, content, { confirmText="네", cancelText="아니오", confirm=()=>{}, cancel=()=>{}, confirmPosOrder=CONFIRM_POSITION.LEFT } = {}) => {
    return Alert.alert(
        title, content,
        (confirmPosOrder)?
            [
                {text:confirmText, onPress:confirm},
                {text:cancelText, onPress:cancel}
            ]
        :
            [
                {text:cancelText, onPress:cancel},
                {text:confirmText, onPress:confirm}
            ]
    )
}