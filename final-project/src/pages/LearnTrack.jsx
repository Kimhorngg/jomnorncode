export default function LearnTrack(){
    return(
        // You can write your code here , this one just for testing
    <div className="min-h-screen bg-[#f2f2f2] py-10">
      <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-35">
        {/* ===== Header Section ===== */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a5f]">
         មកធ្វើឲ្យថ្ងៃនេះមាន <span className="text-[#ffa500]">លទ្ធផល</span>
        </h1>
        <p className="text-gray-500 mt-5 text-sm sm:text-base">
         តាមដានការរៀនរបស់អ្នក និងគ្រប់គ្រងដំណើរការរបស់អ្នក
        </p>
      </div>

      {/* ===== Top Info Box ===== */}
      <div className="border border-[#3f72af] rounded-xl p-6 bg-blue-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[#102d4f] text-sm sm:text-base text-center sm:text-left">
          ចាប់ផ្តេីមចូលរៀនឥឡូវនេះជាឱកាសល្អសម្រាប់អ្នក
        </p>

        <button className="bg-[#e1f7e5] text-[#17A94F] px-6 py-2 rounded-lg border border-[#17A94F] hover:bg-green-300 transition">
          ចុះឈ្មោះ
        </button>
      </div>

      {/* ===== Main Grid Section ===== */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ==== Left Card ==== */}
        <div className="border border-blue-400 rounded-xl p-6 bg-white">
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-6">
          ផែនការក្នុងការសិក្សា
          </h2>

          <div className="flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div
                key={index}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#3f72af] text-white rounded-full cursor-pointer hover:bg-blue-600 transition"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* ==== Right Large Card ==== */}
        <div className="border border-blue-400 rounded-xl p-6 bg-white lg:col-span-2 min-h-[300px]">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 rounded-lg bg-blue-300 text-blue-900 border border-blue-500">
              កំពុងដំណេីរការ
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 border">
              បានបញ្ចប់
            </button>
          </div>

          <div className="flex items-center justify-center h-48 text-gray-400">
            មិនទាន់មានទិន្នន័យបង្ហាញ
          </div>
        </div>

      </div>
      </div>
      
    </div>
)
}