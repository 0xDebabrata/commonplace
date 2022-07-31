import { supabaseClient } from "@supabase/auth-helpers-nextjs";

// Delete card when viewing it under a card page
export const deleteAndRedirect = async (id, router) => {
  await deleteCard(id);
  router.push("/");
};

// Delete card when viewing it under a tag/collection page
export const deleteAndRefresh = async (id, router) => {
  await deleteCard(id);
  router.reload(window.location.pathname);
};

const deleteCard = async (id) => {
  // Delete row from cards table
  const { err } = await supabaseClient.from("cards").delete().eq("id", id);

  if (err) {
    console.log(err);
    throw err;
  }
};
