import { Link } from "react-router";
export default function SignUp() {
  return (
   <div className="min-h-screen bg-[#0f2f4f] flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-[#f7f5f2] rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1f3a5f]">
          បង្កើតគណនីថ្មី
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2">
          មានគណនីរួចហើយ?
          <Link
            to="/login"
            className="text-[#ffa500] cursor-pointer hover:underline"
          >
            ចូលគណនី
          </Link>
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#1f3a5f] mb-1">
              ឈ្មោះអ្នកប្រើ
            </label>
            <input
              type="text"
              placeholder="បញ្ចូលឈ្មោះ"
              className="w-full px-4 py-2 rounded-lg border border-[#1f3a5f] focus:outline-none focus:ring-2 focus:ring-[#1f3a5f]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#1f3a5f] mb-1">
              ពាក្យសម្ងាត់
            </label>
            <input
              type="password"
              placeholder="យ៉ាងហោចណាស់ ៨តួរអក្សរ"
              className="w-full px-4 py-2 rounded-lg border border-[#1f3a5f] focus:outline-none focus:ring-2 focus:ring-[#1f3a5f]"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#1f3a5f] mb-1">
              ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់
            </label>
            <input
              type="password"
              placeholder="ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់"
              className="w-full px-4 py-2 rounded-lg border border-[#1f3a5f] focus:outline-none focus:ring-2 focus:ring-[#1f3a5f]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1f3a5f] mb-1">
              អាសយដ្ឋានអ៊ីមែល
            </label>
            <input
              type="email"
              placeholder="បញ្ចូលអាសយដ្ឋានអ៊ីមែល"
              className="w-full px-4 py-2 rounded-lg border border-[#1f3a5f] focus:outline-none focus:ring-2 focus:ring-[#1f3a5f]"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-4 text-sm text-[#1f3a5f]">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#1f3a5f]" />
              អ្នកសិក្សា
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#1f3a5f]" />
              គ្រូបង្រៀន
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#4573a7] text-white py-2 rounded-full font-medium hover:bg-[#355c87] transition"
          >
            បង្កើត
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">ឬបន្តជាមួយ</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            បន្តជាមួយ Google
          </button>

          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            បន្តជាមួយ Facebook
          </button>
        </div>
      </div>
    </div>
  )
}
