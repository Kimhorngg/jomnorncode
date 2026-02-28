
export default function Learn() {
    return(
        // You can write your code here , this one just for testing
        <>
        <div  className="min-h-screen bg-[#f3f4f6] px-4 sm:px-8 md:px-16 lg:px-40 py-10 sm:py-14 md:py-16">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b]">
          មកធ្វើឲ្យថ្ងៃនេះមាន<span className="text-[#ffa500]">លទ្ធផល</span>
        </h1>
        <p className="text-gray-500 mt-5">
          តាមដានការរៀនរបស់អ្នក និងគ្រប់គ្រងដំណើរការរបស់អ្នក
        </p>
      </div>

      {/* Announcement Box */}
      <div className="bg-[#dfe6f4] rounded-xl p-6 flex flex-col md:flex-row justify-between items-center mb-10">
        <p className="text-[#1e293b] font-medium text-lg">
        ចាប់ផ្តេីមចូលរៀនឥឡូវនេះជាឱកាសល្អសម្រាប់អ្នក
        </p>
         <button className="bg-[#e1f6e5] border-2 border-gray-500 text-green-700 border border-green-500 px-6 py-2 rounded-lg hover:bg-green-300 text-base sm:text-lg font-semibold px-8 py-4 sm:px-10 sm:py-5 rounded-xl transition-all">
                   ចុះឈ្មោះ
                  </button>
        {/* <button className="mt-4 md:mt-0 bg-[#e1f6e5] text-green-700 border border-green-500 px-6 py-2 rounded-lg hover:bg-green-300 transition">
         ចុះឈ្មោះ
        </button> */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-[#112d4f] mb-6">
           ផែនការក្នុងការសិក្សា
          </h2>

          <div className="flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div
                key={index}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#3f72af] text-white font-semibold"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Right Big Card */}
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm min-h-[400px]">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button className="bg-[#98bae3] text-[#3f72af] border border-[#3f72af] px-6 py-2 rounded-lg font-medium">
              កំពុងដំណេីរការ
            </button>

            <button className="bg-[#d9d9d9] text-[#6c7080] border border-[#6c7080] px-6 py-2 rounded-lg font-medium">
             បានបញ្ចប់
            </button>
          </div>

          {/* Empty State */}
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            មិនទាន់មានទិន្នន័យនៅឡើយទេ
          </div>
        </div>

      </div>
    </div>
         
      
        </>
   
)
}