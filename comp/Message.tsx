import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from "../constants/Color";


export const Message: React.FunctionComponent<{ msgColor?: string, snackMessage: string, show: boolean, closeMsg: () => void, canClose: boolean }> = (props) => {

    if (!props.show) {
        return null;
    }

    return (<View style={{
        padding: 5,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: "row",
        backgroundColor: (props.msgColor ? props.msgColor : Colors.darkGrey),
        margin: 5
    }}>
        <View style={{ flex: 5 }}>
            <Text style={{ color: Colors.white }}>{props.snackMessage}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: "row-reverse", display: (props.canClose ? "flex" : "none") }}>
            <Text style={{ color: Colors.white, margin: 5, fontWeight: "700" }} onPress={() => {
                props.closeMsg()
            }} >
                <MaterialIcons name="close" size={24} color={Colors.white} />
            </Text>
        </View>
    </View>)
}