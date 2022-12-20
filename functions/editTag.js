import toast from "react-hot-toast";

export const update = async (supabaseClient, id, router, name, colour) => {
  const updateTag = async (supabaseClient, id, name, colour) => {
    if (!name) throw new Error("Please enter a tag name");
    if (!colour) throw new Error("Please select a tag colour");

    const { error } = await supabaseClient
      .from("tags")
      .update({ name, colour })
      .eq("id", id);

    if (error) throw error;
  };

  const promise = updateTag(supabaseClient, id, name, colour);

  toast.promise(
    promise,
    {
      loading: "Updating tag",
      success: () => {
        router.reload(window.location.pathname);
        return "Tag updated";
      },
      error: (err) => {
        console.error(err);
        return "There was an error";
      },
    },
    {
      style: {
        background: "rgba(105,105,105,0.7)",
        minWidth: "300px",
        color: "white",
        backdropFilter: "blur(10px)",
      },
    }
  );
};
