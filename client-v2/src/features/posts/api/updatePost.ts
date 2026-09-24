import { supabase } from "../../../lib/supabaseClient";

// =====================================================
// Update Post
// =====================================================

export async function updatePost(
  id: string,
  content: string,
  imagesUrls?: string[]
) {
  const updateData: {
    content: string;
    images_urls?: string[];
  } = {
    content,
  };

  // ===================================================
  // Images
  // ===================================================

  if (imagesUrls !== undefined) {
    updateData.images_urls = imagesUrls;
  }

  // ===================================================
  // Update
  // ===================================================

  const { data, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}