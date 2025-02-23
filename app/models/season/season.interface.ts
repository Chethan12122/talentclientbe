export interface SeasonRequest {
    start_date: Date;
    end_date: Date;
    break_start_date?: Date;
    break_end_date?: Date;
}

export interface SeasonResponse extends SeasonRequest {
    season_id: string;
    season_name: string;
}