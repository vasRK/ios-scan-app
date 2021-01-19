import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export const Input: React.FunctionComponent<TextInputProps> = (props) => {

    return (<TextInput {...props} style={{ ...styles.input, ...props.style as object }} />)
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