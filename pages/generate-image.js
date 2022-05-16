import supabase from "../utils/supabaseClient"

export default function GenerateImage() {
  const executeFunction = async () => {
    try {
      const data = await fetch("https://nntsubixtqccokiqltlt.functions.supabase.co/generate-image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabase.auth.session().access_token}`
        },
        body: JSON.stringify({
          type: "generate-image"
        })
      })
        .then(resp => resp.json())
        .then(data => {
          return data
        })

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <>
      <button onClick={executeFunction}>
        Execute function
      </button>
    </>
  )
}