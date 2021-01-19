import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';
import { Colors } from '../constants/Color';
import { Input } from './Input';
import { rushStyles } from './Styles';

export const Login: React.FunctionComponent<TextInputProps & { callback: (code: string) => void }> = (props) => {
    const [passCode, setPassCode] = React.useState("");

    return (
        <View style={[rushStyles.inputContainer, { padding: 20 }]}>
            <View style={{ flex: 2 }}>
                <Input
                    placeholder="Password"
                    blurOnSubmit
                    keyboardType="number-pad"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={(text: string) => {
                        setPassCode(text);
                    }}
                    value={passCode}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Ionicons name="md-log-in-sharp" size={50} color={Colors.primary} onPress={() => {
                    props.callback(passCode);
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 35,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 10,
        borderRadius: 5,
        padding: 5
    }
});