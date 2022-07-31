import removeMd from "remove-markdown"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"

// Insert new tags to tags table and card tags to card_tag table
// Return array of tag ids for the card
const handleTags = async (tags, userTags, user_id) => {
  return new Promise(async (resolve, reject) => {
    const card_tags = [];
    const newTags = [];
    const tagIds = [];

    // Handle no tags
    if (tags.length === 0) {
      uncategorised(userTags, user_id).then((tag_id) => {
        resolve({
          tagIds: [tag_id],
          card_tags: [{ tag_id, user_id }],
        });
      });
    } else {
      // tags contains 2 types of objects: userTag - { id, name, colour } or an object (which needs to be uploaded) { user_id, name, colour }
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
      const { data, error } = await supabaseClient.from("tags").insert(newTags);

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
const postToJunctionTable = async (card_tags, card_id) => {
  card_tags.forEach((tag) => {
    tag.card_id = card_id;
  });

  // Insert rows to card_tag junction table
  const { card_tagData, card_tagError } = await supabaseClient
    .from("card_tag")
    .insert(card_tags);

  if (card_tagError) {
    throw error;
  }
};

// Return card ID from cards table
const getCollectionId = async (collection, userCollections, user_id) => {
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
      .insert([collection]);

    if (error) {
      throw error;
    }

    collectionId = data[0].id;
  }

  return collectionId;
};

const uncategorised = async (userTags, userId) => {
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
      ]);

      if (error) {
        throw new Error(error.message);
      } else {
        resolve(data[0].id);
      }
    }
  });
};

// Check if user is a valid customer
const isCustomer = async () => {
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

// Create new card
export const createCard = async (
  excerpt,
  note,
  collection,
  userCollections,
  tags,
  userTags,
  user
) => {
  // Check if user is a customer
  const customer = await isCustomer();
  if (!customer) {
    throw new Error("Your free trial has ended 🙁");
  }

  const card = {};
  const user_id = user.id;

  if (!note && !excerpt) {
    throw new Error("Please add a note or an excerpt");
  }

  const { tagIds, card_tags } = await handleTags(tags, userTags, user_id);

  card.user_id = user_id;
  card.collection_id = await getCollectionId(
    collection,
    userCollections,
    user_id
  );
  card.excerpt = excerpt;
  card.note = note;
  card.tags = tagIds;
  card.plain = {
    excerpt: removeMd(excerpt),
    note: removeMd(note)
  }

  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "-" +
    (nowDate.getMonth() + 1) +
    "-" +
    nowDate.getDate();
  card.created_at = date;

  const { data, error } = await supabaseClient.from("cards").insert([card]);

  if (error) {
    throw error;
  }

  const card_id = data[0].id;
  await postToJunctionTable(card_tags, card_id);

  return card_id;
};
