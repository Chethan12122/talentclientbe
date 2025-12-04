export interface InstituteRequest {
  name: string;
  district_id: string;
}

export interface InstituteResponse {
  institute_id: string;
  name: string;
  district_id: string;
  created_at: string;
  updated_at: string;
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

export interface InstituteDistrictResponse {
  institute_id: string;
  district_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}


export interface InstitueGroupResponse {
  group_id: string;
  institute_id: string;
}