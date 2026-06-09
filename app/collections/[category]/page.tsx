import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByCategory, Category } from "@/lib/catalog";

const CATEGORY_TITLES: Record<string, string> = {
  rings: "Engagement Rings",
  necklaces: "Bespoke Necklaces",
  earrings: "Diamond Earrings",
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  if (!["rings", "necklaces", "earrings"].includes(category)) {
    notFound();
  }

  const products = getProductsByCategory(category as Category);
  const title = CATEGORY_TITLES[category];

  return (
    <div className="bg-paper min-h-screen pt-40 pb-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        
        {/* Header - Left Aligned, Editorial */}
        <header className="mb-32 max-w-2xl fade-in-cascade-1">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-mute mb-4">{category}</p>
          <h1 className="font-display text-[4rem] md:text-[5.5rem] text-ink mb-6 leading-none">
            {title}
          </h1>
          <p className="text-ink-soft text-lg leading-relaxed font-body">
            Every piece is made to order in our atelier, pairing structural integrity with lab-grown diamonds of uncompromising quality.
          </p>
        </header>

        {/* Asymmetric Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-12 items-end">
          {products.map((product, idx) => {
            // Create an alternating masonry/zig-zag look
            const isEven = idx % 2 === 0;
            const spanClass = isEven ? "md:col-span-7" : "md:col-span-5";
            const startClass = isEven ? "md:col-start-1" : "md:col-start-8";
            const aspectClass = isEven ? "aspect-[4/5]" : "aspect-[3/4]";
            
            return (
              <div key={product.id} className={`${spanClass} ${startClass} fade-in-cascade-2`}>
                <Link href={`/collections/${category}/${product.id}`} className="group block">
                  <div className={`relative ${aspectClass} bg-vellum overflow-hidden rounded-[0.5rem]`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-[800ms] ease-spring group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-6">
                    <h2 className="font-display text-2xl text-ink mb-1 group-hover:text-ink-soft transition-colors">{product.name}</h2>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
