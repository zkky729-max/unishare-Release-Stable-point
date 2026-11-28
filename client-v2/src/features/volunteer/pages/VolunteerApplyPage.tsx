
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const teams = [
  "فريق جمع المحتوى",
  "فريق التنسيق الأكاديمي",
  "فريق المعالجة بالذكاء الاصطناعي",
  "فريق المراجعة والجودة",
  "فريق التصميم والإخراج",
];

const inputClass =
  "w-full rounded-xl border border-white/15 bg-[#0b1d3b] px-4 py-3 !text-white caret-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15";

const labelClass = "mb-2 block text-sm font-bold text-slate-200";

export default function VolunteerApplyPage() {
  const [participation, setParticipation] = useState("team");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleTeam = (team: string) => {
    setSelectedTeams((current) =>
      current.includes(team)
        ? current.filter((item) => item !== team)
        : [...current, team]
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!accepted) {
      setErrorMessage(
        "يرجى الموافقة على ميثاق مجتمع UniShare أولاً."
      );
      return;
    }

    if (participation === "team" && selectedTeams.length === 0) {
      setErrorMessage("يرجى اختيار فريق واحد على الأقل.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

    if (!apiUrl) {
      setErrorMessage(
        "تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً."
      );
      return;
    }

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      location: String(formData.get("location") || ""),
      education: String(formData.get("education") || ""),
      specialty: String(formData.get("specialty") || ""),
      participationType: participation,
      selectedTeams:
        participation === "team" ? selectedTeams : [],
      projectInterest:
        participation === "project"
          ? String(formData.get("projectInterest") || "")
          : "",
      skills: String(formData.get("skills") || ""),
      experience: String(formData.get("experience") || ""),
      portfolio: String(formData.get("portfolio") || ""),
      motivation: String(formData.get("motivation") || ""),
      availability: String(formData.get("availability") || ""),
      accepted,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/volunteer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى."
        );
      }

      setSuccessMessage(
        "تم استلام طلبك بنجاح! شكراً لاهتمامك بالانضمام إلى مجتمع UniShare. سنرسل لك رسالة تأكيد عبر البريد الإلكتروني."
      );

      form.reset();
      setParticipation("team");
      setSelectedTeams([]);
      setAccepted(false);
    } catch (error) {
      console.error("Volunteer application submission error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#07152f] px-5 py-16 text-white sm:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <Link
          to="/volunteer"
          className="inline-flex items-center gap-2 font-semibold text-cyan-300 transition hover:text-white"
        >
          ← العودة إلى صفحة انضم إلينا
        </Link>

        <header className="mb-12 mt-10 text-center">
          <span className="inline-block rounded-full border border-cyan-300/25 bg-cyan-400/10 px-5 py-2 text-sm font-bold text-cyan-300">
            كن جزءاً من مجتمع UniShare
          </span>

          <h1 className="mt-7 text-4xl font-extrabold text-[#00E5FF] sm:text-5xl">
            طلب الانضمام
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-9 text-slate-300">
            يسعدنا اهتمامك بالمساهمة معنا. املأ البيانات التالية
            حتى نتعرف عليك وعلى المجالات التي ترغب في المشاركة فيها.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 rounded-3xl border border-white/10 bg-[#0b1d3b] p-6 shadow-2xl shadow-black/20 sm:p-10"
        >
          <section>
            <h2 className="mb-7 border-b border-white/10 pb-4 text-2xl font-extrabold text-[#00E5FF]">
              المعلومات الشخصية
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>الاسم الكامل *</label>
                <input name="fullName" type="text" required minLength={3} maxLength={100} placeholder="أدخل اسمك الكامل" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>البريد الإلكتروني *</label>
                <input name="email" type="email" required placeholder="example@email.com" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>رقم الهاتف</label>
                <input name="phone" type="tel" placeholder="+213 ..." className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>البلد والولاية *</label>
                <input name="location" type="text" required placeholder="مثال: الجزائر، ولاية الجزائر" className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-7 border-b border-white/10 pb-4 text-2xl font-extrabold text-[#00E5FF]">
              الدراسة ومجال الاهتمام
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>المستوى الدراسي أو المهني</label>
                <select name="education" defaultValue="" className={inputClass}>
                  <option value="" disabled className="bg-[#0b1d3b]">اختر المستوى</option>
                  <option className="bg-[#0b1d3b]">طالب جامعي</option>
                  <option className="bg-[#0b1d3b]">خريج</option>
                  <option className="bg-[#0b1d3b]">أستاذ جامعي</option>
                  <option className="bg-[#0b1d3b]">مختص أو مهني</option>
                  <option className="bg-[#0b1d3b]">مستوى آخر</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>التخصص أو المجال</label>
                <input name="specialty" type="text" placeholder="مثال: الإعلام الآلي، التصميم..." className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-7 border-b border-white/10 pb-4 text-2xl font-extrabold text-[#00E5FF]">
              طريقة المشاركة
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`cursor-pointer rounded-xl border p-5 transition ${participation === "team" ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-[#07152f]"}`}>
                <input type="radio" name="participation" value="team" checked={participation === "team"} onChange={() => { setParticipation("team"); setSelectedTeams([]); }} className="ml-2 accent-cyan-400" />
                <span className="font-bold text-white">الانضمام إلى فريق</span>
                <p className="mt-2 text-sm leading-7 text-slate-300">المشاركة المستمرة ضمن أحد فرق UniShare.</p>
              </label>

              <label className={`cursor-pointer rounded-xl border p-5 transition ${participation === "project" ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-[#07152f]"}`}>
                <input type="radio" name="participation" value="project" checked={participation === "project"} onChange={() => { setParticipation("project"); setSelectedTeams([]); }} className="ml-2 accent-cyan-400" />
                <span className="font-bold text-white">المساهمة في مهام ومشاريع مستقلة</span>
                <p className="mt-2 text-sm leading-7 text-slate-300">المشاركة في مهمة محددة وفق المهارات والاحتياجات المتاحة.</p>
              </label>
            </div>

            {participation === "team" ? (
              <div className="mt-7">
                <label className={labelClass}>الفرق التي ترغب في الانضمام إليها *</label>
                <p className="mb-4 text-sm text-slate-400">يمكنك اختيار أكثر من فريق.</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {teams.map((team) => (
                    <label key={team} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${selectedTeams.includes(team) ? "border-cyan-300 bg-cyan-400/10" : "border-white/10 bg-[#07152f]"}`}>
                      <input type="checkbox" checked={selectedTeams.includes(team)} onChange={() => toggleTeam(team)} className="h-4 w-4 accent-cyan-400" />
                      <span className="text-sm font-semibold text-slate-200">{team}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-7">
                <label className={labelClass}>ما نوع المهام أو المشاريع التي ترغب في المساهمة فيها؟ *</label>
                <textarea name="projectInterest" required rows={4} placeholder="اشرح نوع المساهمة التي تستطيع تقديمها..." className={inputClass} />
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-7 border-b border-white/10 pb-4 text-2xl font-extrabold text-[#00E5FF]">
              المهارات والخبرات
            </h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>ما المهارات التي تمتلكها؟ *</label>
                <textarea name="skills" required minLength={5} rows={4} placeholder="اذكر مهاراتك ومجالات إتقانك..." className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>هل لديك تجارب أو أعمال سابقة؟</label>
                <textarea name="experience" rows={4} placeholder="يمكنك ذكر تجاربك، أو كتابة أنك مبتدئ..." className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>رابط أعمالك أو ملفك المهني (اختياري)</label>
                <input name="portfolio" type="url" placeholder="https://..." className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-7 border-b border-white/10 pb-4 text-2xl font-extrabold text-[#00E5FF]">
              دوافع المشاركة والالتزام
            </h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>لماذا ترغب في الانضمام إلى UniShare؟ *</label>
                <textarea name="motivation" required minLength={10} rows={4} placeholder="أخبرنا عن دوافعك وما الذي تطمح إلى تحقيقه..." className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>الوقت الذي يمكنك تخصيصه للمساهمة</label>
                <select name="availability" defaultValue="" className={inputClass}>
                  <option value="" disabled className="bg-[#0b1d3b]">اختر الوقت المناسب</option>
                  <option className="bg-[#0b1d3b]">أقل من 3 ساعات أسبوعياً</option>
                  <option className="bg-[#0b1d3b]">3 إلى 5 ساعات أسبوعياً</option>
                  <option className="bg-[#0b1d3b]">5 إلى 10 ساعات أسبوعياً</option>
                  <option className="bg-[#0b1d3b]">أكثر من 10 ساعات أسبوعياً</option>
                  <option className="bg-[#0b1d3b]">حسب المهام المتاحة</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-cyan-400" />
              <span className="text-sm leading-8 text-slate-200">
                أؤكد أن المعلومات التي قدمتها صحيحة، وأوافق على احترام
                ميثاق مجتمع UniShare وقواعد العمل والتعاون والمسؤوليات
                المعتمدة فيه.
                <span className="mr-1 text-cyan-300">*</span>
              </span>
            </label>
          </section>

          {errorMessage && (
            <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm leading-7 text-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div role="status" className="rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-sm leading-7 text-green-200">
              {successMessage}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#00E5FF] px-8 py-4 text-lg font-extrabold text-[#07152f] transition hover:-translate-y-1 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "جارٍ إرسال الطلب..." : "إرسال طلب الانضمام"}
          </button>

          <p className="text-center text-xs leading-7 text-slate-400">
            لن تحتاج إلى إنشاء حساب. إرسال الطلب لا يعني القبول النهائي،
            وسيتم التواصل معك عبر البريد الإلكتروني.
          </p>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          لديك استفسار؟{" "}
          <a href="mailto:support.unishare@gmail.com" className="font-bold text-cyan-300 hover:underline">
            تواصل مع فريق UniShare
          </a>
        </p>
      </div>
    </main>
  );
}
