import React from "react";
import { CheckCircle, Lock, Circle } from "lucide-react";

export default function LearnTrack() {

  // ===== MOCK DATA (You can replace with API later) =====
  const lessons = [
    { id: 1, title: "សេចក្ដីផ្ដើម", status: "done" },
    { id: 2, title: "HTML Tag", status: "done" },
    { id: 3, title: "Heading និង Paragraph", status: "current" },
    { id: 4, title: "Link និង Images", status: "locked" },
    { id: 5, title: "Forms", status: "locked" }
  ];

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.status === "done").length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= MAIN ================= */}
      <div className="max-w-[1450px] mx-auto px-6 py-10 space-y-8">

        {/* ===== COURSE CARD ===== */}
        <div className="bg-white rounded-xl shadow p-6 flex gap-6 items-center">
          
          <div className="w-24 h-24 bg-orange-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
            &lt;html&gt;
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#112d4f]">
             <span className="text-[#ffa500]">HTML</span>  មូលដ្ឋានសម្រាប់អ្នកចាប់ផ្តើម
            </h2>

            <p className="text-gray-500 mt-1">
             សិក្សាមូលដ្ឋានគ្រឹះពីជំហានមួយទៅជំហានមួយទៀត
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {progress}% បានបញ្ចប់
              </p>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid md:grid-cols-3 gap-30">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-semibold text-[#112d4f]​ ">មេរៀនបានបញ្ចប់</h3>
            <p className="text-2xl font-bold mt-2">
              {completedLessons}/{totalLessons}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-semibold text-[#112d4f]">តេស្តបានបញ្ចប់</h3>
            <p className="text-2xl font-bold mt-2">1/5</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-semibold text-[#112d4f]">ចំនួនម៉ោង</h3>
            <p className="text-2xl font-bold mt-2">8 ម៉ោង</p>
          </div>
        </div>

        {/* ===== LESSON LIST ===== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-[#112d4f] mb-10">
            មេរៀនទាំងអស់
          </h3>

          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <p className="text-[#555555]">
                  មេរៀនទី{lesson.id} - {lesson.title}
                </p>

                {lesson.status === "done" && (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={18} /> បានបញ្ចប់
                  </span>
                )}

                {lesson.status === "current" && (
                  <span className="flex items-center gap-2 text-blue-600">
                    <Circle size={18} /> កំពុងរៀន
                  </span>
                )}

                {lesson.status === "locked" && (
                  <span className="flex items-center gap-2 text-gray-500">
                    <Lock size={18} /> បានចាក់សោរ
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== CERTIFICATE ===== */}
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-bold text-[#112d4f] mb-2">
            សញ្ញាប័ត្រ
          </h3>

          <p className="text-[#6c7180] mb-6">
            បញ្ចប់មេរៀនទាំងអស់ដើម្បីទទួលបានវិញ្ញាបនបត្រ
          </p>

          <div className="border-4 border-yellow-600 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-widest">
              ONLINE COURSE CERTIFICATE
            </h2>

            <p className="mt-6 text-lg">
              Has completed all the lessons
            </p>

            <p className="mt-6 font-bold text-xl">
              Your Name
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}