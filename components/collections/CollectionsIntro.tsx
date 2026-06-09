import { ScrollReveal } from "@/components/ScrollReveal";

export function CollectionsIntro() {
  return (
    <section className="bg-paper text-ink pb-12 md:pb-16 overflow-hidden" dir="rtl">
      <div className="mx-auto max-w-[820px] px-6 md:px-12">
        <ScrollReveal className="flex flex-col items-center text-center">
          <p className="section-label mb-6 text-ink-soft tracking-[0.25em]" dir="ltr">
            MAISON MANA COLLECTIONS
          </p>
          <h1 className="display-lat text-[2.5rem] leading-[1.1] md:text-[4rem] text-ink mb-8">
            אוספים
          </h1>
          <p className="text-[1.125rem] leading-relaxed text-ink-soft mb-6 max-w-xl mx-auto">
            עולמות התכשיטים של Maison MANA — מטבעות אירוסין ועיצוב אישי ועד תכשיטי יהלומים, פריטי חתימה ויצירות חד־פעמיות.
          </p>
          <p className="text-sm tracking-wide text-ink-mute">
            כל אוסף נבנה סביב רגע אחר, חומר אחר וסיפור אחר.
          </p>
          <div className="mt-10 mx-auto h-px w-full max-w-[120px] bg-brass/30" />
        </ScrollReveal>
      </div>
    </section>
  );
}
