import React, { useState } from 'react';

export default function Roadmap() {
  const [activeTab, setActiveTab] = useState('web');

  const roadmapData = {
    web: {
      steps: [
        { id: 1, title: "រៀន HTML, CSS, JavaScript", desc: "យល់ពីមូលដ្ឋាននៃការបង្កើតវេបសាយ។" },
        { id: 2, title: "សិក្សា Framework (React/Vue)", desc: "បង្កើតកម្មវិធីវេបសាយឱ្យមានលក្ខណៈរស់រវើក។" },
        { id: 3, title: "រៀន Backend (Node.js, Express)", desc: "គ្រប់គ្រងទិន្នន័យ និង API។" },
        { id: 4, title: "អនុវត្តគម្រោងជាក់ស្តែង", desc: "អភិវឌ្ឍន៍ Portfolio ឬវេបសាយផ្ទាល់ខ្លួន។" },
      ]
    },
    mobile: {
      steps: [
        { id: 1, title: "រៀន Dart & Flutter", desc: "ស្វែងយល់ពីការបង្កើត UI សម្រាប់ Mobile។" },
        { id: 2, title: "State Management", desc: "ការគ្រប់គ្រង Data ក្នុង App ធំៗ (Provider/Riverpod)។" },
        { id: 3, title: "Native Features", desc: "ប្រើប្រាស់ Camera, GPS និង Push Notifications។" },
        { id: 4, title: "App Store Deployment", desc: "របៀបដាក់ App លើ Play Store និង App Store។" },
      ]
    },
    software: {
      steps: [
        { id: 1, title: "Algorithms & Data Structures", desc: "ពង្រឹងមូលដ្ឋានគ្រឹះនៃការដោះស្រាយបញ្ហា។" },
        { id: 2, title: "System Design", desc: "រចនាសម្ព័ន្ធ Software ខ្នាតយក្ស និង Scalability។" },
        { id: 3, title: "Database Architecture", desc: "ការប្រើប្រាស់ SQL និង NoSQL ឱ្យមានប្រសិទ្ធភាព។" },
        { id: 4, title: "DevOps & Cloud", desc: "រៀនអំពី Docker, Kubernetes និង Cloud Services។" },
      ]
    }
  };

  const tabs = [
    { id: 'web', label: 'អ្នកអភិវឌ្ឍន៍វេបសាយ (Web Developer)' },
    { id: 'mobile', label: 'អ្នកអភិវឌ្ឍន៍ទូរស័ព្ទ (Mobile Developer)' },
    { id: 'software', label: 'វិស្វករសូហ្វវែរ (Software Engineer)' },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6 md:p-12 font-sans dark:bg-[#0e172b]">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e293b] dark:text-slate-100 mb-4 tracking-tight">
          ផែនទីអាជីពបច្ចេកវិទ្យា
        </h1>
        <div className="w-24 h-1.5 bg-[#ffbf48] mx-auto rounded-full mb-6"></div>
        <p className="text-slate-500 dark:text-slate-300 max-w-2xl mx-auto text-lg">
          ស្វែងរកជំហានដើម្បីក្លាយជាអ្នកជំនាញក្នុងវិស័យបច្ចេកវិទ្យាផ្សេងៗ!
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-20 max-w-8xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 transform ${
              activeTab === tab.id
                ? 'bg-[#1e293b] text-white shadow-2xl shadow-slate-400 -translate-y-1'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-[#1e293b] dark:bg-[#111827] dark:text-slate-300 dark:border-slate-700 dark:hover:bg-[#0f172a] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roadmap Container */}
      <div className="max-w-5xl mx-auto relative">
        
        {/* The Vertical Line (Centered to the dots) */}
        <div className="absolute left-5 md:left-6 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-blue-200 dark:border-blue-900 z-0"></div>

        <div className="flex flex-col gap-8">
          {roadmapData[activeTab].steps.map((step, index) => (
            <div 
              key={`${activeTab}-${step.id}`} 
              className="relative flex items-stretch gap-8 z-10 transition-all duration-500 animate-in fade-in slide-in-from-left-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Number Circle Holder */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-100 ring-4 ring-white dark:ring-[#0e172b] shrink-0">
                  {step.id}
                </div>
              </div>

              {/* Card Content - Force Full Width Alignment */}
              <div className="w-full bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-center dark:bg-[#111827] dark:border-slate-800">
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}