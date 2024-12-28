import { logger } from "../../common/logger";
import { RegisterRequestBody } from "../../models/auth/auth.interface";
import supabaseSdk from '../../sdk/supabase.sdk';

async function register(requestBody: RegisterRequestBody) {
    logger.info("Inside register service");

    const response = await supabaseSdk.signUpWithPhoneNumber(requestBody.phone_number, requestBody.password);

    return response;
}

export default { register };