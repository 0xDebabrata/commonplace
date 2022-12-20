// Delete card when viewing it a single card page
export const deleteAndRedirect = async (supabaseClient, id, router) => {
  await deleteCard(supabaseClient, id);
  router.push("/");
};

// Delete card when viewing it under a tag/collection page
export const deleteAndRefresh = async (supabaseClient, id, router) => {
  await deleteCard(supabaseClient, id);
  router.reload(window.location.pathname);
};

const deleteCard = async (supabaseClient, id) => {
  // Delete row from cards table
  const { err } = await supabaseClient.from("cards").delete().eq("id", id);

  if (err) {
    console.log(err);
    throw err;
  }
};
