import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { GetImageURL } from '../constants/ApiConfig';
import { Colors } from '../constants/Color';
import { BookModel } from '../models/Book';
import { rushStyles } from './Styles';

export const BookDetails: React.FunctionComponent<{ book: BookModel }> = (props) => {
    const { book } = props;
    const [showLoading, setShowLoading] = React.useState(false);

    return (
        <View style={[{ paddingVertical: 5 }, rushStyles.inputContainer]}>
            <View style={{ flex: 2 }}>

                <View style={[rushStyles.inputContainer, { display: (showLoading ? "flex" : "none") }]}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>

                <Image
                    onLoadStart={() => {
                        setShowLoading(true);
                        // console.log("onLoadStart: ");
                    }}

                    onLoadEnd={() => {
                        setShowLoading(false);
                        // console.log("onLoadEnd: ");
                    }}
                    source={{
                        uri: `${GetImageURL(props.book.ISBN13)}`
                    }}
                    style={{ height: 200, width: 120 }}
                />

            </View>
            <View style={{ flex: 3 }}>
                <BookProperty name={"Title"} val={book.Title}></BookProperty>
                <BookProperty name={"Binding"} val={book.Binding}></BookProperty>
                <BookProperty name={"ISBN/ASIN" as any} val={book.ISBN13 + " / " + book.ISBN10}></BookProperty>
                <BookProperty name={"Publisher"} val={book.Publisher}></BookProperty>
                <BookProperty name={"PublicationDate"} val={book.PublicationDate}></BookProperty>
                <BookProperty name={"NewPrice"} val={`$ ${book.NewPrice}`}></BookProperty>
                <BookProperty name={"UsedPrice"} val={`$ ${book.UsedPrice}`}></BookProperty>
            </View>
        </View>
    )
}

export const BookProperty: React.FunctionComponent<{ name: keyof BookModel, val: string | number }> = (props) => {
    const { name, val } = props;
    return (
        <>
            <Text style={rushStyles.textLabel}>{name}</Text>
            <Text style={{ paddingVertical: 4 }}>{val}</Text>
        </>
    )
}