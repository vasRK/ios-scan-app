export class BookModel {
    Title: string;
    Binding: string;
    Publisher: string;
    Publication: string;
    PublicationDate: string;
    ISBN10: string;
    ISBN13: string;
    Id: string;
    UsedPrice: number;
    NewPrice: number;
}

export interface IBookModel {
    Title: string;
    Binding: string;
    ISBN10: string;
    ISBN13: string;
    Id: string;
    SuggestedPriceGood: number;
    SuggestedPriceNew: number;
    Publisher: string;
    PublicationDate: string;
}

export interface BookDetailsMasterAndWrackCopies {
    
    BookDetailsMaster: IBookModel;

    NoOfCopiesInWrack: number;
}