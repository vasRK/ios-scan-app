
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Color';

export const rushStyles = StyleSheet.create({
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonDefault: {
    backgroundColor: "#fff"
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    paddingVertical: 5,
    fontWeight: "700"
  },
  input: {
    width: "80%",
  },
  inputMid: {
    width: '60%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10
  },
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 20,
    marginVertical: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  button: {
    width: 100
  },
  sellerInfo: {
    width: '100%',
    // paddingTop: 5,
    // justifyContent: 'flex-end',
    // flexDirection: "row"
  },
  textLabel: {
    color: Colors.lightGrey,
    fontWeight: "700"
  }
});

