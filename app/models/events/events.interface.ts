import { EVENT_TYPE } from "../../common/enum";

export interface EventRequest {
    name: string,
    type: EVENT_TYPE
}