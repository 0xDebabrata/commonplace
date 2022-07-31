import toast from "react-hot-toast";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const update = async (id, router, name, colour) => {
  const updateTag = async (id, name, colour) => {
    if (!name) throw new Error("Please enter a tag name");
    if (!colour) throw new Error("Please select a tag colour");
    console.log(id);

    const { error } = await supabaseClient
      .from("tags")
      .update({ name, colour })
      .eq("id", id);

    if (error) throw error;
  };

  const promise = updateTag(id, name, colour);

  toast.promise(
    promise,
    {
      loading: "Updating tag",
      success: () => {
        router.reload(window.location.pathname);
        return "Tag updated";
      },
      error: (err) => {
        console.log(err);
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
