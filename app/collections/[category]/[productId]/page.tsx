import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/catalog";

export default async function ProductPage({ params }: { params: Promise<{ category: string, productId: string }> }) {
  const { productId, category } = await params;
  const product = getProductById(productId);

  if (!product || product.category !== category) {
    notFound();
  }

  return (
    <div className="bg-paper min-h-screen pt-40 pb-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-mute mb-16 uppercase tracking-[0.2em] font-body">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-3">/</span>
          <Link href={`/collections/${category}`} className="hover:text-ink transition-colors">{category}</Link>
          <span className="mx-3">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Image Gallery - Asymmetric Large Frame */}
          <div className="md:col-span-7 relative aspect-[4/5] bg-vellum rounded-[1rem] overflow-hidden fade-in-cascade-1">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details - Right Aligned block */}
          <div className="md:col-span-5 flex flex-col fade-in-cascade-2 sticky top-40">
            <h1 className="font-display text-[3.5rem] md:text-[4.5rem] text-ink leading-[1.0] mb-6 tracking-tight">
              {product.name}
            </h1>
            
            <div className="h-px w-12 bg-rule mb-8" />

            <p className="text-ink-soft text-lg leading-relaxed mb-12 font-body">
              {product.description}
            </p>

            <div className="pt-8 border-t border-rule mb-12">
              <h3 className="font-display text-xl text-ink mb-6">Specifications</h3>
              <ul className="text-ink-soft space-y-3 text-sm font-body">
                <li className="flex justify-between border-b border-rule-soft pb-2">
                  <span className="text-ink-mute uppercase tracking-wider text-xs">Metals</span> 
                  <span className="text-ink">{product.metalOptions.join(", ")}</span>
                </li>
                {product.shapeOptions && (
                  <li className="flex justify-between border-b border-rule-soft pb-2">
                    <span className="text-ink-mute uppercase tracking-wider text-xs">Shapes</span> 
                    <span className="text-ink">{product.shapeOptions.join(", ")}</span>
                  </li>
                )}
                {product.settingOptions && (
                  <li className="flex justify-between border-b border-rule-soft pb-2">
                    <span className="text-ink-mute uppercase tracking-wider text-xs">Settings</span> 
                    <span className="text-ink">{product.settingOptions.join(", ")}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-4">
              <Link 
                href={category === "rings" ? "/atelier" : "/inquiry"} 
                className="hero-btn-solid w-full text-center"
              >
                {category === "rings" ? "Customize in Atelier" : "Inquire Now"}
              </Link>
              <p className="text-center text-xs text-ink-mute uppercase tracking-widest mt-4">
                Handcrafted in our workshop
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
