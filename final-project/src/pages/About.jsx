import React from 'react'


export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner / Hero */}
      <div className="bg-[#3f72af] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
           ឯកសារលំអិត និង ការណែនាំទៅកាន់ប្រើប្រាស់
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-90">
           ចូលរួមជាមួយសិស្សជាង ១០០០ នាក់ផ្សេងទៀតក្នុងការកសាងអនាគតបច្ចេកវិទ្យារបស់អ្នក។
          </p>

          <div className="max-w-2xl mx-auto">
            {/* <input
              type="text"
              placeholder="ស្វែងរកវគ្គសិក្សា..."
              className="w-full px-6 py-5 text-lg rounded-full outline-none focus:ring-4 focus:ring-blue-300 text-gray-800"
            /> */}
            <button className="mt-5 bg-white w-full hover:bg-[#d97706] text-[#f49d0d] text-xl font-bold px-10 py-5 rounded-full transition-colors duration-200 shadow-lg">
             ចុះឈ្មោះឥឡូវនេះ
            </button>
          </div>
        </div>
      </div>
      {/* Second Section - Introduction */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left text */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-8 leading-tight">
                វគ្គសិក្សា ឥតគិតថ្លៃ សម្រាប់អ្នកចង់ក្លាយជាអ្នកសរសេរកូដ
              </h2>
              
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                យើងផ្តល់ជូនវគ្គសិក្សាគ្រប់ជំនាញសំខាន់ៗទាក់ទងនឹងការសរសេរកម្មវិធី 
                (Programming) ដោយប្រើភាសាខ្មែរ និងគម្រោងជាក់ស្តែងជាច្រើន 
                សម្រាប់អ្នកចាប់ផ្តើម រហូតដល់អ្នកចង់បង្កើនជំនាញអាជីពខ្ពស់។
              </p>

              <button className="bg-[#1e40af] hover:bg-blue-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
                មើលវគ្គសិក្សាទាំងអស់ →
              </button>
            </div>

            {/* Right image + card */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800"
                  alt="Girl coding"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-8 -right-4 md:-right-12 bg-white rounded-xl shadow-xl p-6 max-w-xs hidden md:block">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  រៀនឥតគិតថ្លៃ គ្រប់មុខវិជ្ជា
                </h3>
                <p className="text-gray-600">
                  ចាប់ពីមូលដ្ឋានរហូតដល់កម្រិតអាជីព ជាមួយគម្រោងពិតប្រាកដ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
