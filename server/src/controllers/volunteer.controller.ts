
import { Request, Response } from "express";
import { Resend } from "resend";

import {
  createVolunteerApplication,
} from "../services/volunteer.service.js";

// =====================================================
// EMAIL HELPERS
// =====================================================

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

async function sendVolunteerEmails(application: {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  specialty: string;
  participationType: "team" | "project";
  selectedTeams: string[];
  projectInterest: string;
  skills: string;
  experience: string;
  portfolio: string;
  motivation: string;
  availability: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const adminEmail =
    process.env.VOLUNTEER_NOTIFICATION_EMAIL ||
    "support.unishare@gmail.com";

  if (!apiKey || !fromEmail) {
    console.warn(
      "Volunteer emails skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is missing."
    );
    return;
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(application.fullName);

  const participation =
    application.participationType === "team"
      ? "الانضمام إلى فريق"
      : "المساهمة في مشروع أو مهمة مستقلة";

  const details = [
    ["الاسم", application.fullName],
    ["البريد الإلكتروني", application.email],
    ["الهاتف", application.phone],
    ["الموقع", application.location],
    ["المستوى التعليمي", application.education],
    ["التخصص", application.specialty],
    ["طريقة المشاركة", participation],
    ["الفرق المختارة", application.selectedTeams.join("، ")],
    ["المشاريع المطلوبة", application.projectInterest],
    ["المهارات", application.skills],
    ["الخبرة", application.experience],
    ["الأعمال السابقة", application.portfolio],
    ["الدافع", application.motivation],
    ["التفرغ", application.availability],
  ];

  const adminHtml = `
    <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9">
      <h2>طلب تطوع جديد - UniShare</h2>
      <p>تم استلام طلب تطوع جديد عبر الموقع.</p>
      <table style="border-collapse:collapse;width:100%">
        ${details
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:8px;border:1px solid #ddd;font-weight:bold">
                  ${escapeHtml(label)}
                </td>
                <td style="padding:8px;border:1px solid #ddd">
                  ${escapeHtml(value || "غير محدد")}
                </td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `;

  const volunteerHtml = `
    <div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9">
      <h2>مرحباً ${safeName}،</h2>
      <p>
        نشكرك على اهتمامك بالمساهمة في مجتمع UniShare.
      </p>
      <p>
        نؤكد لك أننا استلمنا طلب التطوع الخاص بك بنجاح.
      </p>
      <p>
        ستقوم إدارة UniShare بمراجعة الطلب، وسيتم التواصل معك عند وجود مستجدات مناسبة.
      </p>
      <p>
        يرجى الانتباه إلى أن استلام الطلب لا يعني القبول النهائي.
      </p>
      <p>
        شكراً لثقتك ومساهمتك في نشر المعرفة.
      </p>
      <p><strong>فريق UniShare</strong></p>
    </div>
  `;

  const emails = [
    {
      to: adminEmail,
      subject: "طلب تطوع جديد - UniShare",
      html: adminHtml,
    },
    {
      to: application.email,
      subject: "تأكيد استلام طلب التطوع - UniShare",
      html: volunteerHtml,
    },
  ];

  await Promise.all(
    emails.map(async (email) => {
      try {
        const { error } = await resend.emails.send({
          from: fromEmail,
          to: email.to,
          subject: email.subject,
          html: email.html,
        });

        if (error) {
          console.error(
            `Volunteer email error (${email.to}):`,
            error
          );
        }
      } catch (error) {
        console.error(
          `Volunteer email exception (${email.to}):`,
          error
        );
      }
    })
  );
}

// =====================================================
// CREATE VOLUNTEER APPLICATION
// =====================================================

export const submitVolunteerApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      education,
      specialty,
      participationType,
      selectedTeams,
      projectInterest,
      skills,
      experience,
      portfolio,
      motivation,
      availability,
      accepted,
    } = req.body ?? {};

    // -------------------------------------------------
    // REQUIRED FIELDS
    // -------------------------------------------------

    const requiredFields = [
      fullName,
      email,
      location,
      skills,
      motivation,
    ];

    if (
      requiredFields.some(
        (value) =>
          typeof value !== "string" ||
          !value.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "يرجى ملء جميع الحقول المطلوبة.",
      });
    }

    // -------------------------------------------------
    // VALIDATE EMAIL
    // -------------------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "يرجى إدخال بريد إلكتروني صحيح.",
      });
    }

    // -------------------------------------------------
    // VALIDATE AGREEMENT
    // -------------------------------------------------

    if (accepted !== true) {
      return res.status(400).json({
        success: false,
        message: "يرجى الموافقة على ميثاق مجتمع UniShare.",
      });
    }

    // -------------------------------------------------
    // VALIDATE PARTICIPATION TYPE
    // -------------------------------------------------

    if (
      participationType !== "team" &&
      participationType !== "project"
    ) {
      return res.status(400).json({
        success: false,
        message: "طريقة المشاركة غير صحيحة.",
      });
    }

    // -------------------------------------------------
    // VALIDATE SELECTED TEAMS
    // -------------------------------------------------

    const allowedTeams = [
      "فريق جمع المحتوى",
      "فريق التنسيق الأكاديمي",
      "فريق المعالجة بالذكاء الاصطناعي",
      "فريق المراجعة والجودة",
      "فريق التصميم والإخراج",
    ];

    const normalizedTeams =
      Array.isArray(selectedTeams)
        ? selectedTeams
        : [];

    if (
      participationType === "team" &&
      normalizedTeams.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "يرجى اختيار فريق واحد على الأقل.",
      });
    }

    if (
      normalizedTeams.some(
        (team: unknown) =>
          typeof team !== "string" ||
          !allowedTeams.includes(team)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "اختيار الفرق غير صالح.",
      });
    }

    // -------------------------------------------------
    // VALIDATE PROJECT INTEREST
    // -------------------------------------------------

    if (
      participationType === "project" &&
      (
        typeof projectInterest !== "string" ||
        !projectInterest.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "يرجى توضيح نوع المهام أو المشاريع التي ترغب فيها.",
      });
    }

    // -------------------------------------------------
    // VALIDATE TEXT LENGTHS
    // -------------------------------------------------

    if (
      fullName.trim().length < 3 ||
      fullName.trim().length > 100 ||
      location.trim().length > 150 ||
      skills.trim().length < 5 ||
      skills.trim().length > 3000 ||
      motivation.trim().length < 10 ||
      motivation.trim().length > 3000
    ) {
      return res.status(400).json({
        success: false,
        message: "يرجى مراجعة طول البيانات المدخلة.",
      });
    }

    // -------------------------------------------------
    // SAVE APPLICATION IN SUPABASE
    // -------------------------------------------------

    const application =
      await createVolunteerApplication({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone:
          typeof phone === "string"
            ? phone.trim()
            : "",
        location: location.trim(),
        education:
          typeof education === "string"
            ? education.trim()
            : "",
        specialty:
          typeof specialty === "string"
            ? specialty.trim()
            : "",
        participationType,
        selectedTeams:
          participationType === "team"
            ? [...new Set(normalizedTeams)]
            : [],
        projectInterest:
          participationType === "project"
            ? projectInterest.trim()
            : "",
        skills: skills.trim(),
        experience:
          typeof experience === "string"
            ? experience.trim()
            : "",
        portfolio:
          typeof portfolio === "string"
            ? portfolio.trim()
            : "",
        motivation: motivation.trim(),
        availability:
          typeof availability === "string"
            ? availability.trim()
            : "",
      });

    // -------------------------------------------------
    // SEND EMAILS WITHOUT LOSING THE APPLICATION
    // -------------------------------------------------

    await sendVolunteerEmails({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      location: location.trim(),
      education: typeof education === "string" ? education.trim() : "",
      specialty: typeof specialty === "string" ? specialty.trim() : "",
      participationType,
      selectedTeams:
        participationType === "team"
          ? [...new Set(normalizedTeams)]
          : [],
      projectInterest:
        participationType === "project"
          ? projectInterest.trim()
          : "",
      skills: skills.trim(),
      experience: typeof experience === "string" ? experience.trim() : "",
      portfolio: typeof portfolio === "string" ? portfolio.trim() : "",
      motivation: motivation.trim(),
      availability: typeof availability === "string" ? availability.trim() : "",
    });

    // -------------------------------------------------
    // SUCCESS RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "تم استلام طلبك بنجاح.",
      data: {
        applicationId: application.id,
        createdAt: application.created_at,
      },
    });
  } catch (error: any) {
    console.error(
      "Submit volunteer application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "تعذر حفظ طلبك حالياً. يرجى المحاولة لاحقاً.",
    });
  }
};
