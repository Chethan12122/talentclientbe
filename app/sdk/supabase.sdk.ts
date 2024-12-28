import { supabase } from "../common/supabase";

async function signUpWithPhoneNumber(phone_number: string, password: string) {
    let { data, error } = await supabase.auth.signUp({
        phone: phone_number,
        password: password
      });

    if (error) {
        console.log("err", error);
        throw error;
    }

    return data;
}

export default { signUpWithPhoneNumber };