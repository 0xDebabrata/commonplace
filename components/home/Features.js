import Image from "next/image"
import { Space_Grotesk } from "@next/font/google"

const spaceGrotest = Space_Grotesk({ subsets: ["latin"] })

export default function Features() {
  return (
    <div className="bg-neutral-800 pb-32">
      <h2 className={`${spaceGrotest.className} text-5xl text-white text-center`}>
        Search
      </h2>
      <h3 className="text-2xl mt-2 text-center text-slate-400">
        Search for an idea. Unearth relevant information.
      </h3>
        <Image src="/search.png" alt="Commonplace search" width={878} height={500}
          className="mx-auto mt-8 hidden md:block px-10"
          />
      <div className="pt-10 px-10 max-w-5xl mx-auto text-center">
        <div className="flex flex-col justify-between px-10">
          <p className="text-white text-2xl mt-4">
            You probably have multiple bookmarks with no way of finding what you need.
          </p>
          <p className="text-slate-300 text-lg mt-4 font-thin">
            Chances are you have forgotten what you had bookmarked on Twitter. Re-discover and find the stuff you need with a powerful search that is a master at providing relevant information.
            <br /><br />
            "Learn programming"<br /> "Healthy diet for teens"<br /> Google, but for your information
          </p>
        </div>
      </div>

      <h2 className={`${spaceGrotest.className} pt-32 text-5xl text-white text-center`}>
        Smart Collections
      </h2>
      <h3 className="text-2xl mt-2 text-center text-slate-400">
        No time to manually organize bookmarks? We got you.
      </h3>
      <div className="pt-16 px-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:justify-between">
        <div className="min-w-[400px] lg:min-w-[500px]">
          <Image src="/smart-collections.png" 
            alt="Cards are automatically organized into smart collections"
            width={550} height={254}
            />
        </div>
        <div className="flex flex-col justify-between px-10">
          <p className="text-white ml-10 text-2xl mt-4">
            Commonplace automatically organizes all your information into smart collections so you don't have to.
          </p>
          <p className="text-slate-300 md:ml-10 text-lg mt-4">
            All you need to do is search to find the relevant information. We handle the rest.
          </p>
        </div>
      </div>

      <h2 className={`${spaceGrotest.className} pt-32 text-5xl text-white text-center`}>
        Weekly Highlights
      </h2>
      <h3 className="text-2xl mt-2 text-center text-slate-400">
        Reflect. Remember. Learn.
      </h3>
      <div className="pt-16 px-10 max-w-5xl text-center mx-auto">
        <p className="text-white text-2xl mt-4">
          It's important that you are in touch with everything in your personal library.
        </p>
        <p className="text-slate-300 text-lg mt-4">
          Get weekly highlights and summary of all the twitter bookmarks you add straight to your inbox.
        </p>
      </div>
    </div>
  )
}
