const { Client } = require("pg")

const constructQuery = (phrase) => {
    let string = ""
    phrase.split(" ").forEach(word => {
        string += (word + " <-> ")
    })

    return string.substr(0, string.length - 5)
}

export default async function handler(req, res) {

    const body = JSON.parse(req.body)
    const tsquery = constructQuery(body.search.trim())

    const text = `SELECT c.id, c.excerpt, c.note, c.created_at, c.tags, t.id as tag_id, t.name as tag_name, t.colour, coll.id as collection_id, coll.name, coll.author
FROM card_tag AS ct
JOIN cards AS c ON c.id = ct.card_id
JOIN tags AS t ON ct.tag_id = t.id
JOIN collections AS coll ON coll.id = c.collection_id
WHERE ct.user_id = $1 AND c.fts @@ to_tsquery($2)
ORDER BY c.created_at DESC`

    const values = [body.user_id, tsquery]

    const client = new Client()
    await client.connect()

    const response = await client.query(text, values)
    await client.end()

    const cardsArray = []

    let i = 0
    // Generate proper card format used in front-end (REFER BELOW)
    while (i < response.rows.length) {
        const cardObj = response.rows[i]
        const collections = {
            id: cardObj.collection_id,
            name: cardObj.name,
            author: cardObj.author
        }

        const card_tag = []

        for (let k = 0; k < cardObj.tags.length; k++) {
            const tag = {
                id: response.rows[i+k].tag_id,
                name: response.rows[i+k].tag_name,
                colour: response.rows[i+k].colour
            }
            card_tag.push(tag)
        }

        cardsArray.push({
            id: cardObj.id, 
            excerpt: cardObj.excerpt, 
            note: cardObj.note, 
            created_at: cardObj.created_at, 
            tags: cardObj.tags, 
            collections: collections, 
            card_tag: card_tag
        })

        i += cardObj.tags.length
    }

    res.status(200).json({ response: cardsArray })
}

/*
RESPONSE FORMAT:

Array of card objects.
Each object:

id: card id,
note: card note,
excerpt: card exceprt,
created_at: card formation date,
tags: array of ids of tags the card has,
collections: a collection object {
    id: collection id,
    name: collection name,
    author: collection author
},
card_tag: an array of tag objects 

*/
