import { DistrictRequest } from "app/models/districts/districts.interface";
import supabaseDistrictSdk from "../../sdk/district/supabase.district.sdk";

async function createDistrict(districtRequest: DistrictRequest) {
  const response = await supabaseDistrictSdk.createDistrict(districtRequest);
  return response;
}

async function getAllDistricts() {
  const response = await supabaseDistrictSdk.getAllDistricts();
  return response;
}

async function getDistrictById(districtId: string) {
  const response = await supabaseDistrictSdk.getDistrictById(districtId);
  return response;
}

async function deleteDistrictById(districtId: string) {
  const response = await supabaseDistrictSdk.deleteDistrictById(districtId);
  return response;
}

async function updateDistrictById(
  districtId: string,
  districtRequest: DistrictRequest
) {
  const response = await supabaseDistrictSdk.updateDistrictById(
    districtId,
    districtRequest
  );
  return response;
}

export default {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  deleteDistrictById,
  updateDistrictById,
};
