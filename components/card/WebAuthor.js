export default function Author({ author, meta }) {

  return (
    <div className="flex items-center pt-4 pb-2 px-5">
      <img src={`https://www.google.com/s2/favicons?domain=${meta.url}&sz=${32}`} alt="favicon" className="rounded mr-4" />

      <div className="flex items-start flex-col justify-start">
        <p className="text-neutral-100">{meta.entity_name}</p>
        <div className="flex items-center">
          <div className="text-slate-300 text-base hover:underline hover:underline-offset-4">{author.name}</div>
          {/*
          <a href={""} target="_blank" rel="noopener">
            <p className="text-neutral-400 ml-3 hover:underline text-sm">{meta.host}</p>
          </a>
          */}
          <a href={`https://${meta.host}`} target="_blank" rel="noopener">
            <p className="text-neutral-400 ml-3 text-sm hover:underline">{meta.host}</p>
          </a>
        </div>
      </div>
    </div>

  )
}

