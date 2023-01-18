export default function ConnectTwitter() {
  return (
    <div className="text-neutral-100 mx-auto max-w-[800px] pt-28 px-10">
      <h2 className="text-5xl mb-5">
        Get started
      </h2>
      <p className="text-xl mb-5">
        Automatically organize everything and search for what you need.<br />
        Start syncing your Twitter bookmarks.
      </p>

      <a href="/api/twitter">
        <button className="bg-neutral-700 rounded py-1 px-5 text-base border border-neutral-600 font-bold"
        >
          Connect Twitter
        </button>
      </a>
      <p className="text-xl mb-5 mt-10">
        Or get high quality summaries to articles from the web.
      </p>
      <a href="/web">
        <button className="bg-neutral-700 rounded py-1 px-5 text-base border border-neutral-600 font-bold"
        >
          Get article summary
        </button>
      </a>
    </div>
  )
}
