import { SupabaseClient } from "@supabase/supabase-js";

export const uploadFileToStorage = async (
  supabase: SupabaseClient,
  file: Express.Multer.File,
  userId: string,
  tripId: string,
) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${tripId}/${fileName}`;

  const { error: storageError } = await supabase.storage
    .from("trip-assets")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (storageError) throw storageError;

  const { data: dbData, error: dbError } = await supabase
    .from("t_document_docu")
    .insert({
      id_trip: tripId,
      id_user: userId,
      file_path_docu: filePath,
      file_name_docu: file.originalname,
      file_type_docu: file.mimetype,
      file_size_docu: file.size,
    })
    .select()
    .single();
  if (dbError) throw dbError;

  return dbData;
};

export const getSecureDocumentUrlService = async (
  supabase: SupabaseClient,
  docId: string,
  userId: string,
) => {
  const { data, error } = await supabase
    .from("t_document_docu")
    .select(
      `
      file_path_docu,
      t_trip_member_trme!inner (id_user)
    `,
    )
    .eq("id_docu", docId)
    .eq("t_trip_member_trme.id_user", userId)
    .single();

  if (error || !data) {
    throw new Error("Access denied or document not found.");
  }

  // 2. Generate the signed URL
  const { data: urlData, error: urlError } = await supabase.storage
    .from("trip-assets")
    .createSignedUrl(data.file_path_docu, 3600);
  if (urlError) throw urlError;

  return urlData.signedUrl;
};

export const getTripDocumentsService = async (
  supabase: SupabaseClient,
  id_trip: string,
  id_user: string,
) => {
  const { data: isMember, error: memberError } = await supabase
    .from("t_trip_member_trme")
    .select("id_trme")
    .eq("id_trip", id_trip)
    .eq("id_user", id_user)
    .single();

  if (memberError || !isMember) {
    throw new Error("Access denied. You are not a member of this trip.");
  }

  const { data, error } = await supabase
    .from("t_document_docu")
    .select(
      "id_docu, file_name_docu, file_type_docu, file_size_docu, created_at_docu",
    )
    .eq("id_trip", id_trip)
    .order("created_at_docu", { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteDocumentService = async (
  supabase: SupabaseClient,
  docId: string,
  userId: string,
) => {
  const { data: document, error: fetchError } = await supabase
    .from("t_document_docu")
    .select("file_path_docu")
    .eq("id_docu", docId)
    .eq("id_user", userId)
    .single();

  if (fetchError || !document) {
    throw new Error(
      "Document not found or you don't have permission to delete it.",
    );
  }

  const { error: storageError } = await supabase.storage
    .from("trip-assets")
    .remove([document.file_path_docu]);

  if (storageError)
    throw new Error(`Storage Delete Error: ${storageError.message}`);

  const { error: dbError } = await supabase
    .from("t_document_docu")
    .delete()
    .eq("id_docu", docId);

  if (dbError) throw dbError;

  return { success: true };
};
