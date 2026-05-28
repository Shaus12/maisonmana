import { AtelierConfigurator } from "@/components/AtelierConfigurator";

export const metadata = {
  title: "האטלייה — יצירה בהזמנה אישית",
  description:
    "עיצוב טבעת כלולות בהזמנה אישית: בחירת בסיס, יהלום, מתכת ולהקה — ביחד עם הצורף.",
};

export default function AtelierPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-10 md:px-12 md:pt-24 md:pb-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">חדר היצירה</p>
            <h1 className="display-he mt-6 text-[3rem] leading-[1.05] text-ink md:text-[4.25rem]">
              האטלייה
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>
              ארבעה צעדים: בסיס, יהלום, מתכת, להקה. הצעדים נעשים בכל סדר, ויכולים להישנות עד שהטבעת נראית לך נכון. בסיום, היצירה נשלחת לאטלייה ומתואמת לפגישה פרטית בה היא תוצג מודל-שעווה לאישור סופי, לפני שמתחילים לעבוד עליה.
            </p>
          </div>
        </div>
      </div>

      <AtelierConfigurator />
    </section>
  );
}
