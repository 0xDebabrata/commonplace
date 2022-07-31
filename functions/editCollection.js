import toast from "react-hot-toast";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const update = async (id, router, name, author) => {
  const updateCollection = async (id, name, author) => {
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

  const promise = updateCollection(id, name, author);

  toast.promise(
    promise,
    {
      loading: "Updating collection",
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
