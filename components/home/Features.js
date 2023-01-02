import Image from "next/image"
import { Space_Grotesk } from "@next/font/google"

const spaceGrotest = Space_Grotesk({ subsets: ["latin"] })

export default function Features() {
  return (
    <div className="bg-neutral-800 pb-32">
      {/*
      <h2 className={`${spaceGrotest.className} text-5xl text-white text-center`}>
        Search
      </h2>
      <h3 className="text-2xl mt-2 text-center text-slate-400">
        Search for an idea. Unearth relevant information.
      </h3>
      <div className="py-16 px-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:justify-between">
        <Image src="/smart-collections.png" 
          alt="Cards are automatically organized into smart collections"
          width={550} height={254}
          />
        <div className="flex flex-col justify-between px-10">
          <p className="text-white ml-10 text-2xl mt-4">
            Commonplace automatically organizes all your information into smart collections so you don't have to.
          </p>
          <p className="text-slate-300 md:ml-10 text-lg mt-4">
            All you need to do is search to find the relevant information. We handle the rest.
          </p>
        </div>
      </div>
          */}

      <h2 className={`${spaceGrotest.className} text-5xl text-white text-center`}>
        Smart Collections
      </h2>
      <h3 className="text-2xl mt-2 text-center text-slate-400">
        No time to manually organize bookmarks? We got you.
      </h3>
      <div className="pt-16 px-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:justify-between">
        <Image src="/smart-collections.png" 
          alt="Cards are automatically organized into smart collections"
          width={550} height={254}
          />
        <div className="flex flex-col justify-between px-10">
          <p className="text-white ml-10 text-2xl mt-4">
            Commonplace automatically organizes all your information into smart collections so you don't have to.
          </p>
          <p className="text-slate-300 md:ml-10 text-lg mt-4">
            All you need to do is search to find the relevant information. We handle the rest.
          </p>
        </div>
      </div>
    </div>
  )
}
