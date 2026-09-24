import { supabase } from "../../../lib/supabaseClient";

export async function deletePost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("DELETE POST ERROR:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      "لم يتم حذف أي منشور. قد يكون المنشور غير موجود أو لا تملك صلاحية حذفه."
    );
  }

  return true;
}