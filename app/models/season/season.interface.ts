export interface SeasonRequest {
    start_date: Date;
    end_date: Date;
    break_start_date?: Date;
    break_end_date?: Date;
}