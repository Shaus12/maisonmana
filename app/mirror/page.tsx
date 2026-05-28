import { Mirror } from "@/components/Mirror";

export const metadata = {
  title: "המראה — צפייה אישית בתכשיט",
  description:
    "המראה של מאזון מנא — צפי כיצד תכשיט מן הקטלוג נראה עליך. הצילום נותר במכשיר, לא נשלח, לא נשמר.",
};

export default function MirrorPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-10 md:px-12 md:pt-24 md:pb-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">מראה</p>
            <h1 className="display-he mt-6 text-[3rem] leading-[1.05] text-ink md:text-[4.25rem]">
              המראה
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>
              העלי צילום של יד, צוואר, אוזן או פרק — בחרי יצירה מן הקטלוג — והמראה תציג כיצד הם נראים יחד. ההכל מתרחש במכשיר שלך: הצילום לא עולה לשרת, לא נשמר, לא נשלח לאיש.
            </p>
          </div>
        </div>
      </div>

      <Mirror />

      <div className="border-t border-rule bg-paper-deep">
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12">
          <p className="section-label">פרטיות</p>
          <p className="mt-3 max-w-3xl text-[0.875rem] text-ink-soft leading-relaxed">
            המראה פועלת באמצעות מודלים שרצים כולם בדפדפן שלך. אנו לא מעלים את הצילום לשרת, לא שומרים אותו, ולא משתפים אותו עם צד שלישי. רישיון המצלמה תקף רק לסשן הנוכחי, ונסגר בעת מעבר לעמוד אחר. בהמראתך הצילום ללא צפייה — אנא העלי קובץ במקום להפעיל את המצלמה.
          </p>
        </div>
      </div>
    </section>
  );
}
