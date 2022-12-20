import removeMd from "remove-markdown";

const uncategorised = async (supabaseClient, userTags, userId) => {
  return new Promise(async (resolve, reject) => {
    let flag = 1;
    userTags.map((tag) => {
      if (
        tag.name.toLowerCase() === "uncategorised" ||
        tag.name.toLowerCase() === "uncategorized"
      ) {
        flag = 0;
        resolve(tag.id);
      }
    });

    if (flag) {
      const { data, error } = await supabaseClient.from("tags").insert([
        {
          name: "Uncategorised",
          colour: "696969",
          user_id: userId,
        },
      ])
        .select()

      if (error) {
        throw new Error(error.message);
      } else {
        resolve(data[0].id);
      }
    }
  });
};

// Insert new tags to tags table and card tags to card_tag table
// Return array of tag ids for the card
const handleTags = async (supabaseClient, tags, userTags, user_id) => {
  return new Promise(async (resolve, reject) => {
    const card_tags = [];
    const newTags = [];
    const tagIds = [];

    if (tags.length === 0) {
      uncategorised(supabaseClient, userTags, user_id).then((tag_id) => {
        resolve({
          tagIds: [tag_id],
          card_tags: [{ tag_id, user_id }],
        });
      });
    } else {
      // Filter newly created tags from user's tags which need to be added to junction table
      tags.map((tag) => {
        if (tag.user_id) {
          // Add tag to newTags for inserting multiple rows
          newTags.push(tag);
        } else {
          card_tags.push({
            tag_id: tag.id,
            user_id,
          });

          tagIds.push(tag.id);
        }
      });

      // Insert new tags to tags table
      const { data, error } = await supabaseClient.from("tags").insert(newTags).select();

      if (error) {
        throw error;
      }

      // Extract new tag ids to push to newTags
      data.map((tag) => {
        card_tags.push({
          tag_id: tag.id,
          user_id,
        });

        tagIds.push(tag.id);
      });

      resolve({ tagIds, card_tags });
    }
  });
};

// Insert rows into card_tag table
const postToJunctionTable = async (supabaseClient, card_tags, card_id) => {
  card_tags.forEach((tag) => {
    tag.card_id = card_id;
  });

  // Insert rows to card_tag junction table
  const { error } = await supabaseClient
    .from("card_tag")
    .upsert(card_tags)

  if (error) {
    throw new Error(error);
  }
};

// Return card ID from cards table
const getCollectionId = async (supabaseClient, collection, userCollections, user_id) => {
  if (!collection.name) return null;

  let collectionId;
  // Check if collection already exists
  userCollections.map((userCollection) => {
    if (
      userCollection.name.toLowerCase() === collection.name.toLowerCase() &&
      userCollection.author.toLowerCase() === collection.author.toLowerCase()
    ) {
      collectionId = userCollection.id;
    }
  });

  // If collection does not exist, insert it to collections table
  if (!collectionId) {
    collection.user_id = user_id;
    const { data, error } = await supabaseClient
      .from("collections")
      .insert([collection])
      .select()

    if (error) {
      throw error;
    }

    collectionId = data[0].id;
  }

  return collectionId;
};

// Delete removed tags from card_tag junction table
const deleteJunctionRows = async (supabaseClient, card_id, tag_id) => {
  const { error } = await supabaseClient
    .from("card_tag")
    .delete()
    .match({ card_id, tag_id });

  if (error) {
    throw error;
  }
};

// Check if user is a valid customer
const isCustomer = async (supabaseClient) => {
  return new Promise(async (resolve, reject) => {
    const { data } = await supabaseClient
      .from("users")
      .select("created_at, customer_id");

    if (data[0].customer_id) {
      resolve(true);
    } else {
      const start = new Date(date[0].created_at);
      const today = new Date();

      const days = Math.round((today - start) / 86400000);

      if (days > 7) {
        resolve(false);
      } else {
        resolve(true);
      }
    }
  });
};

// Update card
export const updateCard = async (
  supabaseClient,
  excerpt,
  note,
  collection,
  userCollections,
  tags,
  userTags,
  date,
  cardId,
  deleteRows,
  user
) => {
  // Check if user is a customer
  const customer = await isCustomer(supabaseClient);
  if (!customer) {
    throw new Error("Your free trial has ended 🙁");
  }

  if (!note && !excerpt) {
    throw new Error("Please add a note or an excerpt");
  }

  // Delete rows from junction table
  deleteRows.forEach(async (id) => {
    await deleteJunctionRows(supabaseClient, cardId, id);
  });

  const card = {};
  const user_id = user.id;

  const { tagIds, card_tags } = await handleTags(supabaseClient, tags, userTags, user_id);

  card.user_id = user_id;
  card.collection_id = await getCollectionId(
    supabaseClient,
    collection,
    userCollections,
    user_id
  );
  card.excerpt = excerpt;
  card.note = note;
  card.tags = tagIds;
  card.plain = {
    excerpt: removeMd(excerpt),
    note: removeMd(note),
  };

  card.created_at = date;

  const { error } = await supabaseClient
    .from("cards")
    .update(card)
    .eq("id", cardId);

  if (error) {
    throw error;
  }

  await postToJunctionTable(supabaseClient, card_tags, cardId);
  return cardId; 
};
