import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { GetSellerColor } from '../constants/ApiConfig';
import { Colors } from '../constants/Color';
import { BookSellerAccount } from '../models/BookSellerAccount';
import { Message } from './Message';
import { rushStyles } from './Styles';

export const SelectWrakSeller: React.FunctionComponent<{ message: string, show: boolean, sellerAccount: BookSellerAccount, wrack: string, callback: () => void }> = (props) => {

    const { wrack, sellerAccount, callback } = props;

    if (!props.show) {
        return null;
    }

    return (
        <View>
            <View style={{ ...rushStyles.sellerInfo, ...rushStyles.inputContainer }}>
                <View style={{ flex: 1, padding: 5 }}>
                    <LabelPair label="W" text={wrack} />
                </View>
                <View style={{ flex: 6, borderRadius: 2, padding: 5 }}>
                    <LabelPair style={{ backgroundColor: (GetSellerColor(sellerAccount.Id)), padding: 5, borderRadius: 6 }} label="Seller" text={sellerAccount.SellerName} />
                </View>
                <View style={{ flex: 2 }}>
                    <Ionicons name="md-refresh-circle" size={30} color={GetSellerColor(sellerAccount.Id)} onPress={() => {
                        callback();
                    }} />
                </View>
            </View>
            <View>
                <Message show={props.show} snackMessage={props.message} closeMsg={() => { }} canClose={false} />
            </View>
        </View>
    )
}


const LabelPair: React.FunctionComponent<TextProps & { label: string, text: string, color?: string }> = (props) => {

    return (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}>
            <>
                <Text style={rushStyles.textLabel}>{`${props.label} : `}</Text>
                <Text {...props}>{props.text}</Text>
            </>
        </View>
    )
}