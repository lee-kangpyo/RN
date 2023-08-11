import { Alert } from 'react-native';

export const Confirm = (title, contents, cancelTxt, confirmTxt, onConfirm) => {
    Alert.alert(title, contents,
        [
            {text: cancelTxt, onPress: () => {}, style: 'cancel'},
            {text: confirmTxt, onPress: () => {onConfirm();}, style: 'destructive',},
        ],
        { cancelable: true, onDismiss: () => {}, },
    );
};
