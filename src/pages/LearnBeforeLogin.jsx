import { Link } from "react-router-dom";
export default function LearnBeforeLogin() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 sm:px-8 md:px-16 lg:px-40 py-10 sm:py-14 md:py-16">
      {/* Header */}
      <div
        className="mb-8 sm:mb-10 text-center md:text-left"
        data-aos="fade-up"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b]">
          មកធ្វើឲ្យថ្ងៃនេះមាន<span className="text-[#ffa500]">លទ្ធផល</span>
        </h1>

        <p className="text-gray-500 mt-6 text-sm sm:text-base max-w-xl mx-auto md:mx-0">
          តាមដានការរៀនរបស់អ្នក និងគ្រប់គ្រងដំណើរការរបស់អ្នក
        </p>
      </div>

      {/* Announcement Box */}
      <div
        className="bg-[#dfe6f4] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-8 sm:mb-10 text-center md:text-left"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <p className="text-[#1e293b] font-medium text-base sm:text-lg">
          ចាប់ផ្តេីមចូលរៀនឥឡូវនេះជាឱកាសល្អសម្រាប់អ្នក
        </p>

        <Link
          to="/signup"
          className="bg-[#e1f6e5] text-green-700 border border-green-500 px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:bg-green-300 transition-all font-semibold w-full md:w-auto inline-block text-center"
        >
          ចុះឈ្មោះ
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Card */}
        <div
          className="bg-white rounded-xl p-6 shadow-sm"
          data-aos="fade-up"
          data-aos-delay="200"
        >
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
        <div
          className="md:col-span-2 bg-white rounded-xl p-5 sm:p-6 shadow-sm"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link
              to="/learn"
              className="bg-[#98bae3] text-[#3f72af] border border-[#3f72af] px-4 sm:px-6 py-2 rounded-lg font-medium w-full sm:w-auto"
            >
              កំពុងដំណេីរការ
            </Link>

            <button className="bg-[#d9d9d9] text-[#6c7080] border border-[#6c7080] px-4 sm:px-6 py-2 rounded-lg font-medium w-full sm:w-auto">
              បានបញ្ចប់
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-[#dfe6f4] rounded-2xl p-6 sm:p-8 max-w-full sm:max-w-xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-black text-[#1e293b]">
              <span className="text-[#ffa500]">ស្វាគមន៍</span>{" "}
              មកកាន់ការគ្រប់គ្រងការសិក្សា
            </h3>

            <p className="text-[#6c7080] mt-4 sm:mt-5 leading-relaxed text-sm sm:text-base">
              អ្នកនឹងឃើញវឌ្ឍនភាពរបស់អ្នកនៅពេលដែលអ្នកចាប់ផ្តើមរៀនវគ្គសិក្សាសរសេរកូដ
              របស់យើង។ តាមដានវគ្គសិក្សាដែលអ្នកបានបញ្ចប់ សំណួរសាកល្បង និងទទួលបាន
              វិញ្ញាបនបត្រតាមផ្លូវ។
            </p>

            <button className="mt-6 sm:mt-8 bg-[#112d4f] text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#0d223d] transition w-full sm:w-auto">
              ចុះឈ្មោះឥឡូវនេះ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
