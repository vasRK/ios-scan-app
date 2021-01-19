import { FontAwesome } from '@expo/vector-icons';
import axios from "axios";
import QueryString from "query-string";
import React from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { BookContainer } from './comp/BookContainer';
import Header from "./comp/Header";
import { Input } from "./comp/Input";
import { Login } from './comp/Login';
import { Message } from './comp/Message';
import { SelectWrakSeller } from './comp/SellerWrack';
import { rushStyles } from "./comp/Styles";
import { GetAllSellerAccountURL, GetLatestBookToWrackURL, GetSellerColor, GetTokenURL, SetSellerAccountsCache, UserDetails } from "./constants/ApiConfig";
import { Colors } from "./constants/Color";
import { AccessCode, GetAccessToken, SetAccessToken } from './models/AccessCode';
import { BookSellerAccount } from './models/BookSellerAccount';
import { WrackSummary } from './models/WrackSummary';


export default function App() {
  const [selectedSellerId, setSelectedSellerId] = React.useState("");
  const [wrack, setWrack] = React.useState("");
  const [loginToken, setLogingToken] = React.useState<AccessCode>();
  const [wrackMessage, setWrackMessage] = React.useState("");
  const [isWrackSelected, setIsWrackSelected] = React.useState(false);
  const [ajaxInProgress, setAjaxInProgress] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [sellerAccounts, setSellerAccounts] = React.useState<Array<BookSellerAccount>>([]);
  // const [inputColor, setInputColor] = React.useState(Colors.default);
  const [selectedSellerAccount, setSelectedSellerAccount] = React.useState<BookSellerAccount>();
  const [wrackSummary, setWrackSummary] = React.useState<WrackSummary>(new WrackSummary());

  // React.useEffect(() => {
  //   setInputColor(GetSellerColor(selectedSellerId));
  // }, [selectedSellerId])


  const getSellerAccounts = async (token: string) => {
    // console.log("running getSellerAccounts");
    // console.log("${loginToken.access_token}", token);
    try {
      setAjaxInProgress(true);
      const selllerResponse: { data: { accounts: Array<BookSellerAccount> } } = await axios.get(GetAllSellerAccountURL(), {
        headers: { "Authorization": `bearer ${token}` }
      });

      const sellers = selllerResponse.data.accounts.map(account => {
        const sellerAccount = new BookSellerAccount();
        sellerAccount.Id = account.Id;
        sellerAccount.SellerName = account.SellerName;
        sellerAccount.Site = account.Site;
        sellerAccount.ColorCode = account.ColorCode;

        return sellerAccount;
      })

      // console.log("sellers", sellers);
      setSellerAccounts([...sellers]);
      SetSellerAccountsCache(sellers);
    }
    catch (ex: any) {
      setWrackMessage("Error occured while getting seller accounts");
    } finally {
      setAjaxInProgress(false);
    }
  }

  const getToken = async (passcode: string) => {

    if (!passcode) {
      setSnackMessage("Enter password");
      setShowSnackbar(true);
      return;
    }

    setSnackMessage("");
    setShowSnackbar(false);
    setAjaxInProgress(true);
    const usr = { ...UserDetails }
    usr.password = passcode;

    try {
      const responseToken: { data: AccessCode } = await axios.post(GetTokenURL()
        , QueryString.stringify(usr)
        , { headers: { Accept: "application/x-www-form-urlencoded", "Content-Type": "application/x-www-form-urlencoded" } });

      console.log("responseToken", responseToken.data);
      setLogingToken(responseToken.data);
      SetAccessToken(responseToken.data);
      await getSellerAccounts(responseToken.data.access_token);
    } catch (ex: any) {
      console.log("ex: ", ex);
      setSnackMessage("Enter correct password, if error persists contact admin.");
      setShowSnackbar(true);
    } finally {
      setAjaxInProgress(false);
    }
  }

  const getLatestBookToWrack = async () => {

    // console.log("running GetLatestBookToWrack");
    setWrackMessage("");
    try {

      setAjaxInProgress(true);
      const response: { data: WrackSummary } = await axios.get(GetLatestBookToWrackURL(wrack), {
        headers: { "Authorization": `bearer ${GetAccessToken().access_token}` }
      });

      // console.log("wrack Summary", response.data);
      setWrackSummary(response.data);
      response.data.WrackNumber = wrack
      setWrackMessage(response.data.WrackSummaryMessage);
    }
    catch (ex: any) {
      // setWrackMessage("Error occured while getting wrack info");
      // console.log("ex: ", ex);
    } finally {
      setAjaxInProgress(false);
    }
  }

  const signOut = () => {
    setLogingToken(undefined);
    clearAll();
    setWrack("");
    setSellerAccounts([]);
    setShowSnackbar(false);
    setIsWrackSelected(false);
    // console.log("Sign out");
  }

  const clearAll = () => {
    // console.log("Submitted");
    setShowSnackbar(false);
    setSnackMessage("");
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Header title={"Rush LLC"}  >
          <View style={[rushStyles.inputContainer, { padding: 2 }]}>

            {loginToken ? (<FontAwesome.Button name={"power-off"} style={{ backgroundColor: Colors.primary }} onPress={() => {
              signOut();
            }}>
            </FontAwesome.Button>
            ) : null}
          </View>
        </Header>

        <View style={{ alignItems: "center" }}>
          <View style={[rushStyles.inputContainer, { display: (ajaxInProgress ? "flex" : "none") }]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </View>

        {!loginToken ? (
          <View style={{
            padding: 10,
            alignItems: 'center'
          }}>
            <Message canClose={true} closeMsg={() => { setShowSnackbar(false) }} show={showSnackbar} snackMessage={snackMessage} />

            <Login callback={getToken} />
          </View>
        ) : null}

        {!loginToken ? (<>
        </>)
          : (<>
            <View style={rushStyles.screen} >

              <Message canClose={true} closeMsg={() => { setShowSnackbar(false) }} show={showSnackbar} snackMessage={snackMessage} />

              <SelectWrakSeller message={wrackMessage} show={isWrackSelected} wrack={wrack} sellerAccount={selectedSellerAccount} callback={() => {
                setIsWrackSelected(false);
              }} />

              {!isWrackSelected ? (<>

                <View style={rushStyles.inputContainer}>
                  <Text style={rushStyles.label}>Wrack Number:</Text>
                </View>

                <View style={rushStyles.inputContainer}>
                  <View style={{ flex: 2 }}>

                    <Input placeholder="Ex. 4S"
                      blurOnSubmit
                      autoCapitalize="characters"
                      autoCorrect={false}
                      onChangeText={(text: string) => {
                        setWrack(text);
                        setSnackMessage("");
                        setShowSnackbar(false);
                      }}
                      value={wrack} />
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    {/* <Button disabled={selectedSellerId && wrack ? false : true} color={GetSellerColor(selectedSellerId)} title={"Start"} onPress={(ev) => {

                      (async () => {
                        await getLatestBookToWrack();
                        setIsWrackSelected(true);
                      })();

                    }} /> */}
                  </View>
                </View>

                {sellerAccounts.map(seller => {
                  return <View key={seller.Id} style={{ paddingVertical: 5 }}>
                    <Button color={GetSellerColor(seller.Id)} title={seller.SellerName} onPress={(ev) => {

                      if (wrack) {
                        setSelectedSellerId(seller.Id);
                        setSelectedSellerAccount(seller);

                        (async () => {
                          await getLatestBookToWrack();
                          setIsWrackSelected(true);
                        })();
                      } else {
                        setSnackMessage("Enter wrack Name");
                        setShowSnackbar(true);
                      }
                    }} />
                  </View>
                })}
              </>) : null}

              <BookContainer show={isWrackSelected}

                sellerId={selectedSellerAccount ? selectedSellerAccount.Id : ""}

                sellerName={selectedSellerAccount ? selectedSellerAccount.SellerName : ""}

                wrackSummary={wrackSummary} refreshWrack={(summary: WrackSummary) => {
                  setWrackSummary(summary);
                  setWrackMessage(summary.WrackSummaryMessage);
                  // console.log("summary.WrackSummaryMessage", summary.WrackSummaryMessage);
                }} />
            </View >

          </>)}
      </View>
    </>
  );
}