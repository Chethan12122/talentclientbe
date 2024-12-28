import { logger } from "../../common/logger";
import supabaseSdk from '../../sdk/supabase.sdk';

async function register(requestBody: any) {
    logger.info("Inside register service");

    const response = await supabaseSdk.signUpWithPhoneNumber(requestBody.phone_number, requestBody.password);

    return response;
}

export default { register };