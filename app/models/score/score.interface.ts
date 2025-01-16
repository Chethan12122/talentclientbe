export interface ScoreRequest {
    fixture_id: string;
    referee_id: string;
    winning_team_id: string;
    losing_team_id: string;
    scores_key: JSON;
}