import React from "react";

export default function StudentFeedback() {
  return (
    <div className="bg-[#f3f4f6] py-16 px-4 dark:bg-[#0e172b]">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="khmer-font text-3xl md:text-4xl font-bold text-[#112d52] dark:text-slate-100 inline-block relative">
            មតិយោបល់របស់សិស្ស
            <span className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-2/3 h-1 bg-[#ffbf48] rounded-full"></span>
          </h2>
        </div>

        {/* Feedback Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] relative border border-gray-100 dark:bg-[#111827] dark:border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/src/assets/chovorn.jpg"
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <h4 className="khmer-font font-bold text-[#112d50] dark:text-slate-100 text-lg">
                  ស៊ន ឆវ័ន
                </h4>
                <p className="text-gray-400 dark:text-slate-400 text-sm">
                  Project Manager
                </p>
              </div>
              <div className="ml-auto opacity-20">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gray-400"
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12M3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12" />
                </svg>
              </div>
            </div>
            <p className="text-[#6c7180] dark:text-slate-300 leading-relaxed">
              មេរៀនងាយយល់ណាស់
              ហើយខ្ញុំចូលចិត្តពេលវាយកូដតាមជាក់ស្តែងពីព្រោះវាធ្វេី
              ឲ្យហាត់បានភ្លាមៗ។​ខ្ញុំចូលចិត្តការបែងចែកវគ្គសិក្សាច្បាស់លាស់ងាយស្រួលក្នុងការសិក្សា។
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] relative border border-gray-100 dark:bg-[#111827] dark:border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/src/assets/Maneth.png"
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <h4 className="khmer-font font-bold text-[#112d50] dark:text-slate-100 text-lg">
                  ជា ភីរម្យ
                </h4>
                <p className="text-gray-400 dark:text-slate-400 text-sm">
                  Project Manager
                </p>
              </div>
              <div className="ml-auto opacity-20">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-gray-400"
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12M3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12" />
                </svg>
              </div>
            </div>
            <p className="text-[#6c7180] dark:text-slate-300 leading-relaxed">
              វេបសាយមាន Editor ដែលខ្ញុំអាចវាយកូដ និងមើលលទ្ធផលភ្លាមៗ។ទាំងស្រុង
              វេបសាយនេះធ្វើឲ្យការរៀនកូដក្លាយជារឿងងាយស្រួល សប្បាយ
              និងអាចប្រើបានទាំងពីរភាសា។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
