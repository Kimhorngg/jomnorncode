import jsPDF from "jspdf";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import {
  IoCheckmarkCircle,
  IoDownloadOutline,
  IoRibbonOutline,
} from "react-icons/io5";
import img from "../assets/Certificate.png";
import { createApiClient } from "./Tracking";

const generateCertificate = async (name, course, certificateData) => {
  const doc = new jsPDF();

  doc.addImage(
    img,
    "PNG",
    0,
    0,
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
  );

  doc.setFontSize(36);
  doc.setFont("helvetica");
  doc.text(name, 105, 150, { align: "center" });

  doc.setFontSize(20);
  doc.text(course, 105, 185, { align: "center" });

  doc.save(`${name}-${course}.pdf`);

  // Save certificate to backend if data is available
  if (certificateData?.userId && certificateData?.courseId) {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");

      if (!token) {
        console.warn("[Cert Save] ❌ No auth token found");
        toast.warning("Could not save certificate record (auth needed)");
        // Still dispatch event for PDF generation
        window.dispatchEvent(new Event("certificateIssued"));
        return;
      }

      try {
        const api = createApiClient(token);

        console.log("[Cert Save] 🚀 Starting with:", {
          userId: certificateData.userId,
          courseId: certificateData.courseId,
          courseName: course,
          userName: name,
        });

        const result = await api.issueCertificate({
          userId: Number(certificateData.userId),
          courseId: Number(certificateData.courseId),
          fileUrl: `${name}-${course}.pdf`,
          courseName: course,
          userName: name,
        });

        console.log("[Cert Save] ✅ API SUCCESS:", result);
        toast.success("វិញ្ញាបនបត្របានដាក់ឯកសារ");
        // Dispatch event so dashboard can refresh
        window.dispatchEvent(new Event("certificateIssued"));
      } catch (apiError) {
        console.error("[Cert Save] ⚠️ API error:", apiError.message);
        // Try fallback POST method
        console.log("[Cert Save] 🔄 Attempting fallback POST...");

        const endpoints = [
          "https://jomnorncode-api.cheat.casa/api/api/certificates",
          "https://jomnorncode-api.cheat.casa/api/api/certificates",
        ];

        let saved = false;
        for (const url of endpoints) {
          try {
            console.log(`[Cert Save] POST to: ${url}`);
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userId: Number(certificateData.userId),
                courseId: Number(certificateData.courseId),
                userName: name,
                courseName: course,
                issuedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                fileUrl: `${name}-${course}.pdf`,
              }),
            });

            const responseText = await response.text();
            console.log(
              `[Cert Save] Response ${response.status}:`,
              responseText.substring(0, 200),
            );

            if (response.ok) {
              saved = true;
              console.log("[Cert Save] ✅ Fallback SUCCESS");
              toast.success("វិញ្ញាបនបត្របានដាក់ឯកសារ");
              window.dispatchEvent(new Event("certificateIssued"));
              break;
            }
          } catch (error) {
            console.error("[Cert Save] ❌ Fallback error:", error);
          }
        }

        if (!saved) {
          console.warn("[Cert Save] ⚠️ All methods failed");
          toast.warning("PDF created but certificate record may not be saved");
        }

        // Always dispatch event
        window.dispatchEvent(new Event("certificateIssued"));
      }
    } catch (error) {
      console.error("[Cert Save] 🔴 FATAL ERROR:", error);
      toast.warning("Certificate PDF created but couldn't save record");
      window.dispatchEvent(new Event("certificateIssued"));
    }
  } else {
    console.error("[Cert Save] ❌ Missing data:", {
      hasUserId: !!certificateData?.userId,
      hasCourseId: !!certificateData?.courseId,
      certificateData,
    });
    toast.warning("Certificate data incomplete - cannot save to backend");
    // Still dispatch event so PDF was generated
    window.dispatchEvent(new Event("certificateIssued"));
  }
};

export default function Certificate({ name, course, certificate }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const issuedAt = certificate?.issuedAt || certificate?.createdAt || null;
  const displayDate = issuedAt
    ? new Date(issuedAt).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateCertificate(name, course, certificate);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f7fb_0%,#e9eef8_100%)] dark:bg-none dark:bg-[#101827]">
      <div className="max-w-420 mx-auto px-6 lg:px-12 py-4">
        <button
          onClick={() => navigate(`/enrollment/${courseId}`)}
          className="flex items-center gap-2 rounded-lg bg-[#3f71ae] px-4 py-2 text-white hover:bg-[#2d5a99] transition"
        >
          <ArrowLeft size={20} />
          ត្រឡប់ក្រោយ
        </button>
      </div>

      <div className="px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#17345f] text-white shadow-lg">
              <IoRibbonOutline className="text-3xl" />
            </div>
            <h1 className="text-2xl sm:text-5xl font-bold tracking-tight text-[#112d4f]">
              វិញ្ញាបនបត្ររបស់អ្នកបានរួចរាល់!
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-lg dark:text-gray-200 text-slate-600">
              អបអរសាទរ។ អ្នកបានបញ្ចប់វគ្គសិក្សារួចរាល់
              ហើយអាចទាញយកវិញ្ញាបនបត្ររបស់អ្នកបានឥឡូវនេះ។
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
              <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#17345f_0%,#244a86_100%)] px-6 py-5 text-white sm:px-8">
                <div className="flex items-center gap-3">
                  <IoCheckmarkCircle className="text-2xl text-emerald-300" />
                  <div>
                    <p className="text-sm uppercase text-blue-100">ការបញ្ចប់</p>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      វិញ្ញាបនបត្រ​នៃ​សមិទ្ធផល
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 mt-5">
                <div className="overflow-hidden rounded-3xl border border-[#d6deed] bg-[#f7f9fd]">
                  <div className="relative aspect-[0.707/1] w-full overflow-hidden bg-white">
                    <img
                      src={img}
                      alt="Certificate preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8">
                <p className="text-md font-semibold uppercase text-[#3f72af]">
                  ព័ត៌មានលម្អិតអំពីវិញ្ញាបនបត្រ
                </p>
                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-sm text-slate-500">អ្នកទទួល</p>
                    <p className="mt-1 text-xl font-bold text-[#112d4f]">
                      {name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">វគ្គសិក្សា</p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {course}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">
                      កាលបរិច្ឆេទចេញវិញ្ញាបនបត្រ
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-800">
                      {displayDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-[linear-gradient(135deg,#17345f_0%,#1f4b8f_100%)] p-6 text-white shadow-[0_24px_60px_rgba(23,52,95,0.28)] sm:p-8">
                <h2 className="text-2xl font-black">
                  ទាញយកវិញ្ញាបនបត្ររបស់អ្នក
                </h2>
                <p className="mt-3 text-sm sm:text-base text-blue-100">
                  ទាញយកជា PDF ដើម្បីរក្សាទុក ឬចែករំលែកការសម្រេចរបស់អ្នក។
                </p>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f59e0c] px-6 py-4 text-base font-bold text-white transition hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <IoDownloadOutline className="text-xl" />
                  {isDownloading
                    ? "កំពុងទាញយក..."
                    : "បង្កើតវិញ្ញាបនបត្ររបស់អ្នកជា PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
