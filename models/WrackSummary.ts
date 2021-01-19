export class WrackSummary {
    TotalBooks: number;
    LatestPosition: number;
    NextPosition: number;
    IsWrackFull: boolean;
    LatestRowNumber: string;
    NextRowNumber: string;
    WrackSummaryMessage: string;
    //Temp properties used only in UI
    WrackNumber : string;
    SelectedSellerAccount: string;

    constructor() {
        this.IsWrackFull = false;
    }
}