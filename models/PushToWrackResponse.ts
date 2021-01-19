import { WrackSummary } from "./WrackSummary";

export class SaveResponse {
    Success: boolean;
    NotificationMessage: string;
    WrackSummary: WrackSummary;
}