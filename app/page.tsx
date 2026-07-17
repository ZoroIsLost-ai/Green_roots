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

const emptyFields: ContactFormValues = {
  sanyojak_name: "",
  sanyojak_phone: "",
  sanyojak_location: "",
  sah_sanyojak_name: "",
  sah_sanyojak_phone: "",
  sah_sanyojak_location: "",
};

export default function HomePage() {
  const { loading, error, vibhagOptions, getZillaOptions, getNagarOptions } =
    useHierarchy();

  const [vibhag, setVibhag] = useState("");
  const [zilla, setZilla] = useState("");
  const [nagar, setNagar] = useState("");

  const [selectedGraminKhand, setSelectedGraminKhand] = useState("");
  const [selectedKhandsamNagar, setSelectedKhandsamNagar] = useState("");
  const [selectedAnyaNagar, setSelectedAnyaNagar] = useState("");
  const [selectedMahanagariyaNagar, setSelectedMahanagariyaNagar] = useState("");

  const [tempSubmissions, setTempSubmissions] = useState<any[]>([]);
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
  const { gramin_khand, khandsam_nagar, anya_nagar, mahanagariya_nagar } =
    getNagarOptions(vibhag, zilla);
  const showForm = Boolean(vibhag && zilla && nagar);

  function handleVibhagChange(value: string) {
    setVibhag(value);
    setZilla("");
    clearNagarStates();
  }

  function handleZillaChange(value: string) {
    setZilla(value);
    clearNagarStates();
  }

  const handleNagarSelect = (category: string, value: string) => {
    setSelectedGraminKhand(category === "gramin_khand" ? value : "");
    setSelectedKhandsamNagar(category === "khandsam_nagar" ? value : "");
    setSelectedAnyaNagar(category === "anya_nagar" ? value : "");
    setSelectedMahanagariyaNagar(category === "mahanagariya_nagar" ? value : "");
    setNagar(value);
  };

  function clearNagarStates() {
    setNagar("");
    setSelectedGraminKhand("");
    setSelectedKhandsamNagar("");
    setSelectedAnyaNagar("");
    setSelectedMahanagariyaNagar("");
  }

  const handleAddRecord = (values: ContactFormValues) => {
    const newRecord = {
      vibhag,
      zilla,
      nagar,
      ...values,
    };
    setTempSubmissions((prev) => [...prev, newRecord]);
    reset(emptyFields);
    ToastNotification.success("रिकॉर्ड अस्थायी सूची में जोड़ दिया गया है");
  };

  const handleRemoveRecord = (index: number) => {
    setTempSubmissions((prev) => prev.filter((_, i) => i !== index));
    ToastNotification.info("रिकॉर्ड सूची से हटा दिया गया है");
  };

  const handleBulkSubmit = async () => {
    if (tempSubmissions.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempSubmissions),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "जमा करने में समस्या हुई");
      }

      ToastNotification.success("सभी प्रविष्टियाँ सफलतापूर्वक जमा हो गईं");
      setSubmitted(true);
      setTempSubmissions([]);
      clearNagarStates();
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
    clearNagarStates();
    setSubmitted(false);
    setTempSubmissions([]);
    reset(emptyFields);
  }

  const steps = [
    { label: "विभाग", value: vibhag, active: !vibhag },
    { label: "जिला", value: zilla, active: Boolean(vibhag) && !zilla },
    { label: "नगर", value: nagar, active: Boolean(zilla) && !nagar },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface relative overflow-hidden">
      {/* Premium Ambient Background Blobs (Soft Organic Lights) */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary-100/20 blur-[130px] z-0" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-[500px] w-[500px] rounded-full bg-emerald-100/15 blur-[120px] z-0" />
      <div className="pointer-events-none absolute -left-40 bottom-10 h-[450px] w-[450px] rounded-full bg-teal-100/20 blur-[110px] z-0" />

      {/* Grid Pattern overlay fading towards the bottom and sides */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2ece9_1.5px,transparent_1.5px),linear-gradient(to_bottom,#e2ece9_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 z-0" />

      {/* Subtle Leaf Watermarks in background (visible on desktop) */}
      <div className="pointer-events-none absolute right-[8%] bottom-[15%] text-primary-300/15 opacity-40 select-none hidden lg:block z-0">
        <svg
          width="240"
          height="240"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 9.5a7 7 0 0 1-8 8.5z" />
          <path d="M19 2v9.5" />
          <path d="M9.8 6.1C5 8 3.5 12.5 5 17.5a7 7 0 0 0 6 2.5" />
        </svg>
      </div>

      <div className="pointer-events-none absolute left-[5%] top-[25%] text-primary-300/10 opacity-30 select-none hidden lg:block z-0">
        <svg
          width="160"
          height="160"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 9.5a7 7 0 0 1-8 8.5z" />
          <path d="M19 2v9.5" />
          <path d="M9.8 6.1C5 8 3.5 12.5 5 17.5a7 7 0 0 0 6 2.5" />
        </svg>
      </div>

      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12 relative z-10">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">
            अपनी जानकारी दर्ज करें
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            विभाग और जिला चुनें, फिर नीचे दिए गए खंडों में से कोई एक चुनें।
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
                आपकी सभी प्रविष्टियाँ डेटाबेस में दर्ज कर ली गई हैं।
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
          <div className="flex flex-col gap-6">
            <FormCard steps={steps}>
              <div className="flex flex-col gap-4">
                <DropdownField
                  label="विभाग"
                  placeholder={loading ? "लोड हो रहा है..." : "विभाग चुनें"}
                  value={vibhag}
                  options={vibhagOptions}
                  disabled={loading || tempSubmissions.length > 0}
                  onChange={handleVibhagChange}
                />

                <DropdownField
                  label="जिला"
                  placeholder="जिला चुनें"
                  value={zilla}
                  options={zillaOptions}
                  disabled={!vibhag || tempSubmissions.length > 0}
                  onChange={handleZillaChange}
                />

                {zilla && (
                  <div className="mt-2 rounded-xl border border-surface-border bg-surface-card p-4 animate-fade-in">
                    <p className="mb-3 text-xs font-semibold text-ink-muted">
                      कृपया नीचे दिए गए 4 विकल्पों में से कोई एक चुनें:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DropdownField
                        label="ग्रामीण खंड"
                        placeholder={gramin_khand.length === 0 ? "कोई डेटा नहीं" : "ग्रामीण खंड चुनें"}
                        value={selectedGraminKhand}
                        options={gramin_khand}
                        disabled={tempSubmissions.length > 0 || gramin_khand.length === 0}
                        onChange={(val) => handleNagarSelect("gramin_khand", val)}
                      />

                      <DropdownField
                        label="खंडसम नगर"
                        placeholder={khandsam_nagar.length === 0 ? "कोई डेटा नहीं" : "खंडसम नगर चुनें"}
                        value={selectedKhandsamNagar}
                        options={khandsam_nagar}
                        disabled={tempSubmissions.length > 0 || khandsam_nagar.length === 0}
                        onChange={(val) => handleNagarSelect("khandsam_nagar", val)}
                      />

                      <DropdownField
                        label="अन्य नगर"
                        placeholder={anya_nagar.length === 0 ? "कोई डेटा नहीं" : "अन्य नगर चुनें"}
                        value={selectedAnyaNagar}
                        options={anya_nagar}
                        disabled={tempSubmissions.length > 0 || anya_nagar.length === 0}
                        onChange={(val) => handleNagarSelect("anya_nagar", val)}
                      />

                      <DropdownField
                        label="महानगरीय नगर"
                        placeholder={mahanagariya_nagar.length === 0 ? "कोई डेटा नहीं" : "महानगरीय नगर चुनें"}
                        value={selectedMahanagariyaNagar}
                        options={mahanagariya_nagar}
                        disabled={tempSubmissions.length > 0 || mahanagariya_nagar.length === 0}
                        onChange={(val) => handleNagarSelect("mahanagariya_nagar", val)}
                      />
                    </div>
                  </div>
                )}

                {showForm && (
                  <form
                    onSubmit={handleSubmit(handleAddRecord)}
                    className="mt-2 flex flex-col gap-6 border-t border-surface-border pt-5 animate-fade-in"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sanyojak section */}
                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary border-b border-surface-border pb-1">
                          संयोजक (Coordinator)
                        </h3>
                        <Controller
                          name="sanyojak_name"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="नाम"
                              placeholder="संयोजक का नाम"
                              value={field.value === "NA" ? "" : field.value}
                              error={errors.sanyojak_name?.message}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <Controller
                          name="sanyojak_phone"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="फ़ोन नंबर"
                              placeholder="10 अंकों का मोबाइल नंबर"
                              value={field.value === "NA" ? "" : field.value}
                              error={errors.sanyojak_phone?.message}
                              inputMode="numeric"
                              maxLength={10}
                              onChange={(v) => field.onChange(v.replace(/\D/g, ""))}
                            />
                          )}
                        />
                        <Controller
                          name="sanyojak_location"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="स्थान"
                              placeholder="स्थान दर्ज करें"
                              value={field.value === "NA" ? "" : field.value}
                              error={errors.sanyojak_location?.message}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      {/* Sah Sanyojak section */}
                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary border-b border-surface-border pb-1">
                          सह संयोजक (Co-coordinator)
                        </h3>
                        <Controller
                          name="sah_sanyojak_name"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="नाम"
                              placeholder="सह संयोजक का नाम"
                              value={field.value === "NA" ? "" : field.value}
                              error={errors.sah_sanyojak_name?.message}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <Controller
                          name="sah_sanyojak_phone"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="फ़ोन नंबर"
                              placeholder="10 अंकों का मोबाइल नंबर"
                              value={field.value === "NA" ? "" : field.value}
                              error={errors.sah_sanyojak_phone?.message}
                              inputMode="numeric"
                              maxLength={10}
                              onChange={(v) => field.onChange(v.replace(/\D/g, ""))}
                            />
                          )}
                        />
                        <Controller
                          name="sah_sanyojak_location"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              label="स्थान"
                              placeholder="स्थान दर्ज करें"
                              value={field.value === "NA" ? "" : field.value}
                              error={errors.sah_sanyojak_location?.message}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <SubmitButton 
                      loading={false} 
                      label="सूची में जोड़ें (Add to List)" 
                      onClick={handleSubmit(handleAddRecord)} 
                    />
                  </form>
                )}
              </div>
            </FormCard>

            {tempSubmissions.length > 0 && (
              <div className="mt-2 rounded-2xl border border-surface-border bg-white p-6 shadow-sm animate-fade-in relative z-10">
                <div className="flex flex-col gap-1 mb-4">
                  <h2 className="text-base font-bold text-ink">
                    अस्थायी रूप से सहेजे गए रिकॉर्ड ({tempSubmissions.length})
                  </h2>
                  <p className="text-xs text-ink-muted">
                    ये रिकॉर्ड अभी डेटाबेस में सहेजे नहीं गए हैं। आप नीचे "डेटा सबमिट करें" दबाकर इन्हें एक साथ भेज सकते हैं।
                  </p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-surface-border">
                  <table className="min-w-full divide-y divide-surface-border text-left text-sm">
                    <thead className="bg-surface-card text-ink font-semibold text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">संयोजक Details</th>
                        <th className="px-4 py-3">सह संयोजक Details</th>
                        <th className="px-4 py-3">नगर</th>
                        <th className="px-4 py-3 text-right">कार्रवाई</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {tempSubmissions.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-ink">
                            <div className="font-medium">{item.sanyojak_name}</div>
                            <div className="text-xs text-ink-muted">
                              {item.sanyojak_phone !== "NA" ? item.sanyojak_phone : "कोई फ़ोन नहीं"} | {item.sanyojak_location}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-ink">
                            <div className="font-medium">{item.sah_sanyojak_name}</div>
                            <div className="text-xs text-ink-muted">
                              {item.sah_sanyojak_phone !== "NA" ? item.sah_sanyojak_phone : "कोई फ़ोन नहीं"} | {item.sah_sanyojak_location}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-ink-muted align-middle">{item.nagar}</td>
                          <td className="px-4 py-3 text-right align-middle">
                            <button
                              type="button"
                              onClick={() => handleRemoveRecord(index)}
                              className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
                            >
                              हटाएं
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm font-semibold text-ink px-1">
                    <span>कुल अस्थायी रिकॉर्ड:</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                      {tempSubmissions.length}
                    </span>
                  </div>
                  <SubmitButton
                    loading={submitting}
                    label="डेटा सबमिट करें (Submit Batch)"
                    onClick={handleBulkSubmit}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
