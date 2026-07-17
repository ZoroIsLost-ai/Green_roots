import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "नाम आवश्यक है")
    .min(3, "नाम कम से कम 3 अक्षरों का होना चाहिए"),
  phone: z
    .string()
    .trim()
    .min(1, "फ़ोन नंबर आवश्यक है")
    .regex(/^\d{10}$/, "फ़ोन नंबर बिल्कुल 10 अंकों का होना चाहिए"),
  location: z.string().trim().min(1, "स्थान आवश्यक है"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const submissionSchema = contactFormSchema.extend({
  vibhag: z.string().trim().min(1, "विभाग आवश्यक है"),
  zilla: z.string().trim().min(1, "जिला आवश्यक है"),
  nagar: z.string().trim().min(1, "नगर आवश्यक है"),
});

export type SubmissionValues = z.infer<typeof submissionSchema>;
