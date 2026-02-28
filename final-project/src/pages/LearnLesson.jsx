export default function LearnLesson() {
  return (
    <div className="w-full bg-[#f2f2f2] ">
      <div className="max-w-[1800px] mx-auto  px-20 py-10 text-slate-800">
        {/* Back */}
        <div className="text-[#102e50] font-semibold text-lg mb-6 cursor-pointer" >
          &lt; ត្រឡប់ទៅវគ្គសិក្សា
        </div>

        {/* Top Buttons */}
        <div className="mb-6 space-x-3">
          <button className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 bg-blue-50 text-sm">
            &lt;/&gt; មេរៀនទី១
          </button>
          <button className="px-4 py-2 rounded-full border border-green-500 text-green-600 bg-green-50 text-sm">
            ងាយស្រួល
          </button>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#112d4f] mb-3 flex items-center gap-2">
          សេចក្ដីផ្តើមអំពី HTML
          <span className="text-[#ffa500]">●</span>
        </h1>

        <p className="text-gray-500 mb-10">
          រៀនអំពីមូលដ្ឋានគ្រឹះនៃ HTML និងស្វែងយល់ពីរចនាសម្ព័ន្ធនៃទំព័រវេបសាយ។
        </p>

        {/* Content */}
        <div className="flex gap-8">
          {/* Left Side */}
          <div className="flex-1 space-y-6">
            {/* Definition Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-[#102d4f]">📘ទិដ្ឋភាពទូទៅនៃមេរៀន</h3>
              <p className="text-gray-600 leading-relaxed">
                HTML (HyperText Markup Language)
                គឺជាភាសាស្តង់ដារដែលប្រើសម្រាប់បង្កើតទំព័រ
                វេបសាយ។វាផ្តល់នូវរចនាសម្ព័ន្ធ និងខ្លឹមសារនៃគេហទំព័រ។ HTML
                ប្រើប្រាស់ប្រព័ន្ធនៃ "tags" និង "elements"ដើម្បីរៀបចំខ្លឹមសារ។
              </p>
            </div>

            {/* Key Points Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3">🔑 ចំណុចសំខាន់ៗ</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>HTML ប្រើសញ្ញា tags ដែលស្ថិតក្នុង &lt; &gt;</li>
                <li>Tags មាន tag បើក និង tag បិទ</li>
                <li>ប្រើ &lt;!DOCTYPE&gt; ដើម្បីប្រាប់ browser ថាជា HTML5</li>
                <li>&lt;head&gt; សម្រាប់ metadata</li>
                <li>&lt;body&gt; សម្រាប់មាតិកាដែលបង្ហាញ</li>
                <li>
                  Tags ដូចជា &lt;h1&gt; - &lt;h6&gt;, &lt;p&gt;, &lt;ul&gt;
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-[#102d4f] mb-4">ដំណេីរការមេរៀន</h3>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span> បញ្ចប់មេរៀន
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span>អនុវត្តជាមួយនឹងកូដ
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✔</span> បញ្ចប់កម្រងសំណួរ (quiz)
                </li>
              </ul>

              <button className="w-full mt-6 py-3 rounded-lg border border-green-500 bg-green-50 text-green-600 font-medium">
                ចាប់ផ្តើមរៀន
              </button>
              <hr className="mt-3 text-gray-300" />
              <button className="w-full mt-4 py-3 rounded-lg border border-blue-500 text-blue-600 font-medium">
                ធ្វេីតេស្ត
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
