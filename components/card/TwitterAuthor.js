export default function Author({ author }) {
  const url = `https://twitter.com/${author.username}`

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/Logo.png"
  }

  return (
    <div className="flex items-center py-4 px-5">
      <img alt="Twitter profile picture" 
        width={28}
        height={28}
        className="mr-3 rounded-full"
        src={author.profile_image_url}
        onError={handleImgError}
        />

      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="text-slate-300 hover:underline hover:underline-offset-4">{author.name}</div>
      </a>
    </div>

  )
}
