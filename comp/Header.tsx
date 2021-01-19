import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Color';

export const Header: React.FunctionComponent<{ title: string }> = (props) => {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>{props.title}</Text>
            </View>
            <View style={styles.headerRight} >
                {props.children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        paddingTop: 36,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: "row"
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18
    },
    headerLeft: {
        flex: 1,
        paddingLeft: 10
    },
    headerRight: {
        flex: 1,
        flexDirection: "row-reverse",
    }
});

export default Header;
