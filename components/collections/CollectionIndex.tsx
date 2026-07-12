import { collections } from "@/lib/collections";
import { CollectionCard } from "./CollectionCard";

export function CollectionIndex() {
  return (
    <section className="bg-paper pb-24 md:pb-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-14 md:gap-y-20">
          {collections.map((collection, idx) => (
            <div
              key={collection.key}
              className="w-full mx-auto max-w-xl"
            >
              <CollectionCard collection={collection} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
