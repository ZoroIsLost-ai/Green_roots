"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormCard from "@/components/FormCard";
import DropdownField from "@/components/DropdownField";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";
import { ToastNotification } from "@/components/ToastNotification";
import { useHierarchy } from "@/hooks/useHierarchy";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { CheckCircle2 } from "lucide-react";

const emptyFields: ContactFormValues = { name: "", phone: "", location: "" };

export default function HomePage() {
  const { loading, error, vibhagOptions, getZillaOptions, getNagarOptions } =
    useHierarchy();

  const [vibhag, setVibhag] = useState("");
  const [zilla, setZilla] = useState("");
  const [nagar, setNagar] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: emptyFields,
  });

  const zillaOptions = getZillaOptions(vibhag);
  const nagarOptions = getNagarOptions(vibhag, zilla);
  const showForm = Boolean(vibhag && zilla && nagar);

  function handleVibhagChange(value: string) {
    setVibhag(value);
    setZilla("");
    setNagar("");
  }

  function handleZillaChange(value: string) {
    setZilla(value);
    setNagar("");
  }

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibhag, zilla, nagar, ...values }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "जमा करने में समस्या हुई");
      }

      ToastNotification.success("आपकी प्रतिक्रिया सफलतापूर्वक जमा हो गई");
      setSubmitted(true);
      reset(emptyFields);
    } catch (err) {
      const message = err instanceof Error ? err.message : "कुछ गलत हो गया";
      ToastNotification.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  function startOver() {
    setVibhag("");
    setZilla("");
    setNagar("");
    setSubmitted(false);
    reset(emptyFields);
  }

  const steps = [
    { label: "विभाग", value: vibhag, active: !vibhag },
    { label: "जिला", value: zilla, active: Boolean(vibhag) && !zilla },
    { label: "नगर", value: nagar, active: Boolean(zilla) && !nagar },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">
            अपनी जानकारी दर्ज करें
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            पहले विभाग, फिर जिला और अंत में नगर चुनें।
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="animate-fade-in flex flex-col items-center gap-4 rounded-2xl border border-surface-border bg-surface-card p-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <div>
              <p className="text-base font-semibold text-ink">धन्यवाद!</p>
              <p className="mt-1 text-sm text-ink-muted">
                आपकी प्रतिक्रिया दर्ज कर ली गई है।
              </p>
            </div>
            <button
              onClick={startOver}
              className="rounded-xl border border-surface-border bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-card"
            >
              नई प्रविष्टि जोड़ें
            </button>
          </div>
        ) : (
          <FormCard steps={steps}>
            <div className="flex flex-col gap-4">
              <DropdownField
                label="विभाग"
                placeholder={loading ? "लोड हो रहा है..." : "विभाग चुनें"}
                value={vibhag}
                options={vibhagOptions}
                disabled={loading}
                onChange={handleVibhagChange}
              />

              <DropdownField
                label="जिला"
                placeholder="जिला चुनें"
                value={zilla}
                options={zillaOptions}
                disabled={!vibhag}
                onChange={handleZillaChange}
              />

              <DropdownField
                label="नगर"
                placeholder="नगर चुनें"
                value={nagar}
                options={nagarOptions}
                disabled={!zilla}
                onChange={setNagar}
              />

              {showForm && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 flex flex-col gap-4 border-t border-surface-border pt-5 animate-fade-in"
                >
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="नाम"
                        placeholder="अपना पूरा नाम दर्ज करें"
                        value={field.value}
                        error={errors.name?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="फ़ोन नंबर"
                        placeholder="10 अंकों का मोबाइल नंबर"
                        value={field.value}
                        error={errors.phone?.message}
                        inputMode="numeric"
                        maxLength={10}
                        onChange={(v) => field.onChange(v.replace(/\D/g, ""))}
                      />
                    )}
                  />
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="स्थान"
                        placeholder="स्थान दर्ज करें"
                        value={field.value}
                        error={errors.location?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <SubmitButton loading={submitting} onClick={handleSubmit(onSubmit)} />
                </form>
              )}
            </div>
          </FormCard>
        )}
      </main>

      <Footer />
    </div>
  );
}
