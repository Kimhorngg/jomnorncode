import { Link } from "react-router";

export default function LogIn() {
  return (
    <div className="min-h-screen bg-[#102f4f] flex items-center justify-center">
      <div className="bg-[#f7f5f3] w-[470px] rounded-2xl shadow-xl p-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#163A5F] mb-2">
          សូមចូលគណនីរបស់អ្នក
        </h1>

        <p className="text-center text-gray-500 mb-8">
          មិនទាន់មានគណនី?{" "}
          <Link
            to="/signup"
            className="text-[#ffa500] cursor-pointer hover:underline"
          >
            បង្កើតគណនី
          </Link>
          {/* <span className="text-[#ffa500] cursor-pointer hover:underline">
            បង្កើតគណនី
          </span> */}
        </p>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm text-[#163A5F] mb-2">
            ឈ្មោះអ្នកប្រើ
          </label>

          <div className="relative">
            {/* User Icon */}
            <svg
              className="w-5 h-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
              />
            </svg>

            <input
              type="text"
              placeholder="បញ្ចូលឈ្មោះ"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163A5F]"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm text-[#163A5F] mb-2">
            អាសយដ្ឋានអ៊ីមែល
          </label>

          <div className="relative">
            {/* Email Icon */}
            <svg
              className="w-5 h-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0L12 13.5 2.25 6.75"
              />
            </svg>

            <input
              type="email"
              placeholder="បញ្ចូលអ៊ីមែល"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163A5F]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-sm text-[#163A5F] mb-2">
            ពាក្យសម្ងាត់
          </label>

          <div className="relative">
            {/* Lock Icon */}
            <svg
              className="w-5 h-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V7.875a4.125 4.125 0 10-8.25 0V10.5M5.25 10.5h13.5v9H5.25v-9z"
              />
            </svg>

            <input
              type="password"
              placeholder="បញ្ចូលពាក្យសម្ងាត់"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163A5F]"
            />
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="accent-[#163A5F]" />
            ចងចាំគណនី
          </label>

          <span className="text-[#ffa500] text-sm cursor-pointer hover:underline">
            ភ្លេចពាក្យសម្ងាត់?
          </span>
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#4B6FA5] hover:bg-[#3d5f90] text-white py-2 rounded-full font-medium transition duration-300">
          ចូលគណនី
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">ឬបន្តជាមួយ</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Button */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-50 transition mb-4">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          បន្តជាមួយ Google
        </button>

        {/* Facebook Button */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            alt="Facebook"
            className="w-5 h-5"
          />
          បន្តជាមួយ Facebook
        </button>
      </div>
    </div>
  );
}
