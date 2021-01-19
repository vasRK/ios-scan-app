import axios from "axios";
import React from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import { GetBookAndListingInfo, GetSaveBookToWrackURL, GetSellerColor } from "../constants/ApiConfig";
import { Colors } from "../constants/Color";
import { GetAccessToken } from '../models/AccessCode';
import { BookDetailsMasterAndWrackCopies, BookModel, IBookModel } from '../models/Book';
import { ListBookToWrackModel } from "../models/ListBookToWrack";
import { SaveResponse } from "../models/PushToWrackResponse";
import { WrackSummary } from "../models/WrackSummary";
import { BookDetails } from "./BookDetails";
import { Input } from "./Input";
import { Message } from "./Message";
import { ScanBarcode } from "./Scanner";
import { rushStyles } from "./Styles";
import { _logger } from "../utils/logger"

export const BookContainer: React.FunctionComponent<{
    sellerId: string, sellerName: string, show: boolean
    , wrackSummary: WrackSummary, refreshWrack: (summary: WrackSummary) => void
}> = (props) => {
    const [scanLaunch, setScanLaunch] = React.useState(false);
    const [isbn, setIsbn] = React.useState("");
    const [book, setBook] = React.useState<BookModel>();
    const [ajaxInProgress, setAjaxInProgress] = React.useState(false);
    const [showBookInfo, setShowBookInfo] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [actionColor, setActionColor] = React.useState(Colors.darkGrey);

    const getBookInfo = async (isbn: string) => {
        //console.log("getBookInfo: ", isbn);
        try {
            setAjaxInProgress(true);
            setShowBookInfo(false);
            setBook(undefined);
            setShowSnackbar(false);
            const url = GetBookAndListingInfo(isbn, props.wrackSummary.WrackNumber);

            _logger("url: ", url);

            const bookInfo: { data: BookDetailsMasterAndWrackCopies, status: number } = await axios.get(GetBookAndListingInfo(isbn, props.wrackSummary.WrackNumber), {
                headers: { "Authorization": `bearer ${GetAccessToken().access_token}` }
            });

            if (bookInfo.status == 200) {
                // console.log("bookInfo.statusText", bookInfo.status);
                // _logger(`bookInfo.data`, bookInfo.data);

                const bookDetailsRes = bookInfo.data.BookDetailsMaster
                const bookDetails = new BookModel();
                bookDetails.Title = bookDetailsRes.Title;
                bookDetails.Binding = bookDetailsRes.Binding;
                bookDetails.Id = bookDetailsRes.Id;
                bookDetails.ISBN10 = bookDetailsRes.ISBN10;
                bookDetails.ISBN13 = bookDetailsRes.ISBN13;
                bookDetails.PublicationDate = bookDetailsRes.PublicationDate;
                bookDetails.Publisher = bookDetailsRes.Publisher;
                bookDetails.NewPrice = bookDetailsRes.SuggestedPriceNew;
                bookDetails.UsedPrice = bookDetailsRes.SuggestedPriceGood;

                if (bookInfo.data.NoOfCopiesInWrack > 0) {
                    setSnackMessage("Book is already present wrack, check if you are pushing a duplicate copy");
                    setShowSnackbar(true);
                    setActionColor(Colors.red);
                }

                setBook(bookDetails);
            }
            else {
                setSnackMessage("Book not found");
                setShowSnackbar(true);
            }

            setShowBookInfo(true);
        } catch (ex: any) {
            _logger("error", ex);
            setSnackMessage("Book not found");
            setShowSnackbar(true);
            setActionColor(Colors.red);
        } finally {
            setAjaxInProgress(false);
        }
    }

    const clearAll = () => {
        setIsbn("");
        setShowBookInfo(false);
        setBook(undefined);
    }

    const pushBookToWrack = async () => {

        const model: ListBookToWrackModel = {
            WrackNumber: props.wrackSummary.WrackNumber,
            ISBN: book.ISBN13,
            SelectedSellerAccount: props.sellerName
        }

        try {
            setAjaxInProgress(true);
            setShowSnackbar(false);
            setActionColor(Colors.darkGrey);

            const start = Date.now();
            const response: { data: SaveResponse, status: number } = await axios.post(GetSaveBookToWrackURL(), { ...model }, {
                headers: { "Authorization": `bearer ${GetAccessToken().access_token}` }
            });

            if (response.status == 200 && response.data.Success) {
                // console.log("Pushed ..");
                // console.log(" response.data.WrackSummary.WrackNumber", response.data.WrackSummary);
                setActionColor(Colors.green);
                response.data.WrackSummary.WrackNumber = props.wrackSummary.WrackNumber;//Maintain old Wrack number
                props.refreshWrack(response.data.WrackSummary);
                clearAll();
            }
            else {
                // console.log("Error occured while pushing book");
                setActionColor(Colors.red);
            }

            _logger("Push book: ", response.data.NotificationMessage)
            setSnackMessage(response.data.NotificationMessage);
            // console.log("total time: ", (Date.now() - start));
            // console.log("response.data", response.data);
        } catch (ex: any) {
            _logger("error", ex);
            setSnackMessage("Failed to push book");
            setShowSnackbar(true);
            setActionColor(Colors.red);

        } finally {
            setAjaxInProgress(false);
            setShowSnackbar(true);
        }
    }

    if (!props.show) {
        return null;
    }

    return (
        <>
            <Message msgColor={actionColor} show={showSnackbar} canClose={true} snackMessage={snackMessage} closeMsg={() => {
                setShowSnackbar(false);
                setActionColor(Colors.darkGrey);
            }} />

            <View style={{ alignItems: "center" }}>
                <View style={rushStyles.inputContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} style={{ display: (ajaxInProgress ? "flex" : "none") }} />
                </View>
            </View>

            <View style={{ ...rushStyles.inputContainer, ...{ display: props.show ? "flex" : "none" } }} >
                <View style={{ flex: 2 }}>
                    <Input
                        placeholder="ISBN"
                        style={{ ...{ backgroundColor: GetSellerColor(props.sellerId) } }}
                        blurOnSubmit
                        autoCapitalize="none"
                        autoCorrect={false}

                        onEndEditing={() => {
                            // console.log("Edit end");
                            // console.log("isbn", isbn);

                            setScanLaunch(false);
                            (async () => {
                                await getBookInfo(isbn);
                            })();
                        }}

                        onChangeText={(text: string) => {
                            setIsbn(text);
                            // console.log("ISBN: ", text)
                        }}
                        value={isbn}
                    />
                </View>
                <View style={{ flex: 1, padding: 5 }}>
                    <Button title={scanLaunch ? "Stop Scan" : "Scan Barcode"} onPress={(ev) => {
                        if (!scanLaunch) {
                            clearAll();
                        }

                        setScanLaunch(!scanLaunch);
                    }} />
                </View>
            </View>

            <View style={{ paddingVertical: 5, justifyContent: "space-evenly", flexDirection: "row", alignItems: "center" }} >
                <View style={{ flex: 2, paddingHorizontal: 5 }}>
                    <Button title="Get Details" color={Colors.primary}
                        disabled={!isbn ? true : false}
                        onPress={(ev) => {
                            setScanLaunch(false);
                            (async () => {
                                await getBookInfo(isbn);
                            })();
                        }} />
                </View>

                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                    <Button title="Clear" color={Colors.red}
                        onPress={clearAll} />
                </View>

                {(showBookInfo && props.wrackSummary && !props.wrackSummary.IsWrackFull && book)
                    ? (<View style={{ flex: 2, paddingHorizontal: 5 }}>
                        <Button title={`Push To ${props.wrackSummary.WrackNumber}_${props.wrackSummary.NextRowNumber}_${props.wrackSummary.NextPosition}`}
                            disabled={book ? false : true}
                            color={Colors.green}
                            onPress={async (ev) => {
                                await pushBookToWrack();
                            }} />
                    </View>) :
                    (<></>)}
            </View>

            {(showBookInfo && book ? (
                <>
                    <BookDetails book={book} />
                </>
            ) : undefined)}

            {scanLaunch ? (
                <View style={[rushStyles.inputContainer]}>
                    <View style={{ flex: 1 }}>
                        <ScanBarcode callback={(result: string) => {
                            setIsbn(result);
                            setScanLaunch(false);
                            (async () => {
                                await getBookInfo(result);
                            })();
                        }} />
                    </View>
                </View>) : null}

        </>)
}

