import { z } from "zod";

export const contactFormSchema = z.object({
  sanyojak_name: z
    .string()
    .trim()
    .transform((val) => val || "NA"),
  sanyojak_phone: z
    .string()
    .trim()
    .transform((val) => val || "NA")
    .refine((val) => val === "NA" || /^\d{10}$/.test(val), {
      message: "संयोजक फ़ोन नंबर बिल्कुल 10 अंकों का होना चाहिए",
    }),
  sanyojak_location: z
    .string()
    .trim()
    .transform((val) => val || "NA"),
  sah_sanyojak_name: z
    .string()
    .trim()
    .transform((val) => val || "NA"),
  sah_sanyojak_phone: z
    .string()
    .trim()
    .transform((val) => val || "NA")
    .refine((val) => val === "NA" || /^\d{10}$/.test(val), {
      message: "सह संयोजक फ़ोन नंबर बिल्कुल 10 अंकों का होना चाहिए",
    }),
  sah_sanyojak_location: z
    .string()
    .trim()
    .transform((val) => val || "NA"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const submissionSchema = contactFormSchema.extend({
  vibhag: z.string().trim().min(1, "विभाग आवश्यक है"),
  zilla: z.string().trim().min(1, "जिला आवश्यक है"),
  nagar: z.string().trim().min(1, "नगर आवश्यक है"),
});

export type SubmissionValues = z.infer<typeof submissionSchema>;
