import { Role, SOURCE } from "../../common/enum";

export interface RegisterRequestBody {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: Role;
  institute_id: string;
  district_id: string;
  scanner_code_url: string;
}

export interface VerifyRequestBody {
  phone_number: string;
  code: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
  source: SOURCE;
}
