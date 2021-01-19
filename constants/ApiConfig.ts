import { BookSellerAccount } from "../models/BookSellerAccount";
import { Colors } from "./Color";

const APIBase = "https://rushltdglobal.azurewebsites.net/";
//const APIBase = "http://192.168.0.113/ShipmentAPI/";

export const GetTokenURL = () => `${APIBase}token`;

export const GetBookAndListingInfo = (isbn: string, wrackNumber: string) =>
    `${APIBase}api/BookSKUToWrack/GetByIsbn10AndCopiesCountInWrack?isbn=${isbn}&wrackNumber=${wrackNumber}&SelectedSellerAccount=""`;

export const GetBookDetailsURL = (isbn: string) => `${APIBase}api/bookMaster/GetByAsin?asin=${isbn}`;

export const GetSaveBookToWrackURL = () => `${APIBase}api/BookSKUToWrack/Save`;

export const GetLatestBookToWrackURL = (wrackNumber: string) => `${APIBase}api/BookSKUToWrack/PopulateLatestWrackSummary?wrackNumber=${wrackNumber}`;

export const GetAllSellerAccountURL = () => `${APIBase}api/BookSellerAccount/GetAllSellerAccounts`

export const UserDetails = { grant_type: "password", username: "srinivas@bananabooks.com", password: "", scope: "all" };

const sellers = new Array<BookSellerAccount>();
export const SetSellerAccountsCache = (sellersAccounts: Array<BookSellerAccount>) => {
    // console.log("set seller list: ", sellersAccounts)
    sellers.splice(0, sellers.length)
    sellers.push(...sellersAccounts);
}

export function GetSellerColor(sellerId: string) {
    const sellerAccount = sellers.find(seller => seller.Id == sellerId);

    // console.log("sellerId: ", sellerId.toUpperCase());
    // console.log("sellerAccount: ", sellerAccount);
    // console.log("sellerAccountList: ", sellers);

    if (sellerAccount && sellerAccount.ColorCode) {
        return sellerAccount.ColorCode
    }

    return Colors.primary;

    // // switch (sellerId.toUpperCase()) {
    // //     case "FC5E1917-5F60-4F27-903A-25ED4F5D9521":
    // //         //RushLtd-Amazon 
    // //         color = "#d58512";
    // //         break;
    // //     case "DC7305E4-4C60-42A0-BDC1-3A8DAB3F3049":
    // //         //RushLtd-Abe
    // //         color = "#a32cc4";
    // //         break;
    // //     case "E4BBB3D0-9DC1-4062-AC60-ACA100E49D6B":
    // //         //SoCalEnchanted-Amazon  
    // //         color = "#398439";
    // //         break;
    // //     case "46803849-7487-47CD-97DB-ACAA00FEDCF0":
    // //         color = "orange";
    // //         break;
    // //     default:
    // //         break;
    // // }
    // return color;
}

export const GetImageURL = (isbn: string) => `https://bananabooksblobstore.blob.core.windows.net/banana-prod/${isbn}`;