"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

const stories = [
  {
    label: "PERSONAL PIECE",
    name: "מאיה",
    descriptor: "שרשרת לב בעיצוב אישי",
    quote: "חיפשתי משהו קטן ועדין, אבל כזה שבאמת ירגיש שלי. לא רציתי עוד שרשרת יפה וזהו. רציתי תכשיט עם משמעות. התוצאה יצאה בדיוק כמו שדמיינתי — פשוטה, נקייה, ואני לא מורידה אותה כמעט בכלל.",
    image: "/maya.jpg",
    alt: "לקוחה עונדת שרשרת לב בעיצוב אישי של Maison MANA",
    cta: "לעיצוב תכשיט אישי",
    href: "/atelier"
  },
  {
    label: "BRIDAL STORY",
    name: "נועה ויואב",
    descriptor: "טבעת אירוסין בעיצוב אישי",
    quote: "מהרגע הראשון היה לנו ברור שאנחנו לא רוצים לבחור טבעת מוכנה ממגש. רצינו משהו שירגיש שלנו. עברנו יחד על הסגנון, האבן והפרטים הקטנים, ובסוף יצאה טבעת שהרגישה הכי מדויקת שיש — גם בהצעה וגם ביום החתונה.",
    image: "/couple.jpg",
    alt: "זוג ביום חתונתם מציג טבעת אירוסין בעיצוב אישי",
    cta: "לתיאום פגישה פרטית",
    href: "/inquiry"
  }
];

// TODO: Replace testimonial copy with approved real customer quotes before final production launch if needed.

export function RealStoriesSection() {
  return (
    <section className="bg-paper text-ink overflow-hidden" dir="rtl">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-32">
        <ScrollReveal className="text-center mb-16 md:mb-24 flex flex-col items-center">
          <p className="section-label mb-6 text-ink-soft" dir="ltr">MAISON MANA STORIES</p>
          <h2 className="display-lat text-[2.25rem] leading-[1.07] md:text-[3.75rem] text-ink">
            רגעים אמיתיים
          </h2>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            יש תכשיטים שלא מתחילים מקטלוג. הם מתחילים מרגע, מאדם, מסיפור קטן שרוצים לשמור קרוב.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-24 md:gap-32">
          {stories.map((story, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx} 
                className={`flex flex-col md:flex-row gap-10 md:gap-20 items-center ${
                  isEven ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 relative flex justify-center">
                  <ScrollReveal direction={isEven ? "right" : "left"} className="w-full max-w-lg">
                    <div className={`relative w-full ${isEven ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden border border-ink/10`}>
                      <Image
                        src={story.image}
                        alt={story.alt}
                        fill
                        className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Decorative corner brackets */}
                      <Bracket position="top-start" />
                      <Bracket position="top-end" />
                      <Bracket position="bottom-start" />
                      <Bracket position="bottom-end" />
                    </div>
                  </ScrollReveal>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <ScrollReveal direction={isEven ? "left" : "right"} delay={1}>
                    <div className="flex flex-col items-start text-start max-w-md mx-auto md:mx-0">
                      <span className="text-[0.625rem] tracking-[0.22em] uppercase text-ink-soft mb-6 font-body" dir="ltr">
                        {story.label}
                      </span>
                      <blockquote className="text-[1.25rem] md:text-[1.5rem] leading-relaxed text-ink mb-8">
                        "{story.quote}"
                      </blockquote>
                      <div className="flex flex-col gap-1 border-s border-brass/50 ps-4 mb-8">
                        <span className="font-medium text-lg">{story.name}</span>
                        <span className="text-ink-soft text-sm">{story.descriptor}</span>
                      </div>
                      <Link 
                        href={story.href}
                        className="inline-block border-b border-ink/30 pb-1 text-sm tracking-widest hover:border-ink transition-colors"
                      >
                        {story.cta}
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Bracket({ position }: { position: "top-start" | "top-end" | "bottom-start" | "bottom-end" }) {
  const base = "absolute h-4 w-4 border-brass opacity-60";
  const map: Record<string, string> = {
    "top-start":    `${base} top-3 start-3 border-t border-s`,
    "top-end":      `${base} top-3 end-3 border-t border-e`,
    "bottom-start": `${base} bottom-3 start-3 border-b border-s`,
    "bottom-end":   `${base} bottom-3 end-3 border-b border-e`,
  };
  return <span aria-hidden className={map[position]} />;
}
