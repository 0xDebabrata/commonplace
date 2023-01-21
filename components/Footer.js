import Shortcuts from "./keyboard-shortcuts/Shortcuts"
import Export from "./export/"
import Feedback from "./feedback"

const Footer = () => {
  return (
    <div className="bg-neutral-800 flex justify-end items-center text-gray-200 border-t-[1px] border-neutral-600">

      {/*
      <div className="flex justify-between items-center">
        <Shortcuts />
        <Export />
      </div>
      */}

      <Feedback />
    </div>
  )
}

export default Footer
