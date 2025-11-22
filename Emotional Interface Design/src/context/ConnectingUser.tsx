import { supabase } from "../supabase_client";

export async function connectExistingUser(patientId: string, therapistId: string) {
  try {
    // 1. 检查患者是否存在且当前无 therapist_id
    const { data: patientData, error: selectError } = await supabase
      .from("patients")
      .select("patient_user_id, therapist_id")
      .eq("patient_user_id", patientId)
      .single();

    if (selectError) {
      throw new Error(`Patient lookup failed: ${selectError.message}`);
    }

    if (!patientData) {
      throw new Error(`Patient ID ${patientId} does not exist`);
    }

    if (patientData.therapist_id) {
      throw new Error(`Patient already linked to therapist: ${patientData.therapist_id}`);
    }

    // 2. 执行更新，如果 therapist_id 为空
    const { error: updateError } = await supabase
      .from("patients")
      .update({
        therapist_id: therapistId,
        updated_at: new Date().toISOString(),
      })
      .eq("patient_user_id", patientId);

    if (updateError) {
      throw new Error(`Failed to update therapist_id: ${updateError.message}`);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
