import React from 'react'
import{Link} from 'react-router-dom'
export default function ConfirmCard() {
  return (
    <div className="flex items-center justify-center min-h-[30vh] bg-gray-100 p-10">
      <div className="bg-[#112d51] rounded-xl shadow-lg p-8 max-w-3xl w-full text-center">
        {/* Heading */}
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-5">
          ត្រៀមខ្លួនរួចរាល់ដើម្បីចាប់ផ្តើមរៀន?
        </h1>

        {/* Subheading */}
        <p className="text-gray-300 text-sm md:text-base mb-8">
          ចូលរួមជាមួយសហគមន៍របស់យើង ហើយចាប់ផ្តើមសរសេរកូដរបស់អ្នកនៅថ្ងៃនេះ
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-10">
          <Link to="/course" className="bg-[#3f72af] text-white px-12 py-4 rounded-lg hover:bg-[#f2f2f2] hover:text-[#112d4f] transition-colors font-medium">
            មេីលវគ្គសិក្សា
          </Link>
          <button className="bg-[#f2f2f2] text-[#112d4f] px-12 py-4 rounded-lg hover:bg-gray-400 transition-colors font-medium">
            បង្កេីតគណនី
          </button>
        </div>
      </div>
    </div>
  )
}
