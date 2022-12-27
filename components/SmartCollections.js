export default function SmartCollections({ collections }) {
  return (
    <div className="py-5 flex justify-start items-center flex-wrap max-w-[1000px] mx-auto">
      {collections.map((collection, idx) => {
        return <CollectionElement key={idx} collection={collection} />
      })}
    </div>
  )
}

const CollectionElement = ({ collection }) => {
  return (
    <div className="border border-neutral-600 rounded-full text-white px-5 py-1 mt-2 mx-1 transition-all hover:bg-neutral-700 cursor-default">
      {collection.name}
    </div>
  )
}
