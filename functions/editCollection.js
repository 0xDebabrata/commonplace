import toast from "react-hot-toast";

export const update = async (supabaseClient, id, router, name, author) => {
  const updateCollection = async (supabaseClient, id, name, author) => {
    if (!name) {
      toast.error("Please enter a name", {
        style: {
          background: "rgba(105,105,105,0.7)",
          minWidth: "300px",
          color: "white",
          backdropFilter: "blur(10px)",
        },
      });
      throw new Error("Please enter a name");
    }

    const { error } = await supabaseClient
      .from("collections")
      .update({ name, author })
      .eq("id", id);

    if (error) throw error;
  };

  const promise = updateCollection(supabaseClient, id, name, author);

  toast.promise(
    promise,
    {
      loading: "Updating collection",
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
