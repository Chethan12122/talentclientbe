import { Role } from "../../common/enum";

export interface RegisterRequestBody {
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  role: Role;
}

export interface VerifyRequestBody {
  phone_number: string;
  code: string;
}

export interface LoginRequestBody {
  phone_number: string;
}
