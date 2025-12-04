import { DistrictRequest } from "app/models/districts/districts.interface";
import { supabase } from "../../common/supabase";
import { ApplicationDynamicErrors } from "../../errors/application.error";
import { NonRetryableException } from "../../errors/base.error";

async function createDistrict(districtRequest: DistrictRequest) {
  const { data, error } = await supabase
    .from("districts")
    .insert(districtRequest)
    .select();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data[0];
}

async function getAllDistricts() {
  const { data, error } = await supabase.from("districts").select("*");
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function getDistrictById(districtId: string) {
  const { data, error } = await supabase
    .from("districts")
    .select("*")
    .eq("id", districtId)
    .single();
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function deleteDistrictById(districtId: string) {
  const { data, error } = await supabase
    .from("districts")
    .delete()
    .eq("id", districtId);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

async function updateDistrictById(
  districtId: string,
  districtRequest: DistrictRequest
) {
  const { data, error } = await supabase
    .from("districts")
    .update(districtRequest)
    .eq("id", districtId);
  if (error) {
    throw new NonRetryableException(
      ApplicationDynamicErrors.SDK_API_ERROR(
        error.message,
        500,
        error.code || ""
      )
    );
  }
  return data;
}

export default {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  deleteDistrictById,
  updateDistrictById,
};
