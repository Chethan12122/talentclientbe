export interface InstituteRequest {
  name: string;
  venue: string;
  no_of_teams?: number;
}

export interface InstituteResponse {
  institute_id: string;
  name: string;
  venue: string;
}

export interface VenueRequest {
  name: string;
}

export interface VenueInstituteResponse {
  venue_id: string;
  institute_id: string | null;
}

export interface VenueResponse {
  id: string;
  name: string;
}
