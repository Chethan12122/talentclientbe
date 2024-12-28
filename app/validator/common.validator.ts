import { REGEX } from "../common/constants";

function isValidEmail(email: string) {
  return REGEX.EMAIL.test(email);
}

function isValidPhoneNumber(phoneNumber: string) {
  return REGEX.PHONE_NUMBER.test(phoneNumber);
}

export { isValidEmail, isValidPhoneNumber };
