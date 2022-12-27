import Shortcuts from "./keyboard-shortcuts/Shortcuts"
import Export from "./export/"

const Footer = () => {
  return (
    <div className="bg-neutral-800 flex justify-end items-center text-gray-200 border-t-[1px] border-neutral-600">

      {/*
      <div className="flex justify-between items-center">
        <Shortcuts />
        <Export />
      </div>
      */}

      <ul className="text-gray-400 flex space-x-8 pr-8 text-xs my-2">
        <a href="mailto:hello@commonplace.one"><li>Feedback</li></a>
      </ul>
    </div>
  )
}

export default Footer
