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
        Google, but for your information
      </h3>
        <Image src="/search.png" alt="Commonplace search" width={878} height={500}
          className="mx-auto mt-8 hidden md:block px-10"
          />
      <div className="pt-10 px-10 max-w-5xl mx-auto text-center">
        <div className="flex flex-col justify-between px-10">
          <p className="text-white text-2xl mt-4">
            Save information from multiple sources and always find what you need.
          </p>
          <p className="text-slate-300 text-lg mt-4 font-thin">
            We consume content from various sources but there is no way of finding that article you came across last week.
            Simply save it to Commonplace and we&apos;ll make sure you find it when you need it.
          </p>
        </div>
      </div>

      <h2 className={`${spaceGrotest.className} pt-32 text-5xl text-white text-center`}>
        Smart Collections
      </h2>
      <h3 className="text-2xl mt-2 text-center text-slate-400">
        No time to manually organize your information? We got you.
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
            Commonplace automatically organizes everything based on topics
          </p>
          <p className="text-slate-300 md:ml-10 text-lg mt-4">
            You don&apos;t need to worry about coming up with the perfect way to organize your information.
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
        <p className="text-slate-300 text-lg mt-4">
          Get weekly highlights and summaries for your information straight to your inbox.
        </p>
      </div>
    </div>
  )
}
