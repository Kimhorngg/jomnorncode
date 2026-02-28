export default function Quiz (){
    return(
        // You can write your code here , this one just for testing
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between px-4 sm:px-8 lg:px-16 py-6">
      
      {/* Top Back */}
      <div>
        <button className="text-blue-900 font-medium hover:underline">
          &lt; ត្រឡប់ទៅក្រោយ
        </button>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3">
         សំណួរ<span className="text-[#ffa500]">តេស្តមេរៀន</span>
        </h1>

        <p className="text-gray-500 text-center text-sm sm:text-base max-w-xl mb-6">
        សាកល្បងការយល់ដឹងរបស់អ្នកអំពីអ្វីដែលបានរៀន។ អ្នកត្រូវទទួលបានពិន្ទុយ៉ាងហោចណាស់ ៧0% ដើម្បីប្រឡងជាប់។
        </p>

        {/* Progress Card */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow px-15 py-8 mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#102e50]">សំណួរ ៣ ចំនួន ៥</span>
            <span className="text-[#ffa500]">១៧%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full w-[60%]"></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow p-15">
          <h2 className="text-lg text-[#102e50] sm:text-xl font-semibold mb-6">
            តើ tag មួយណាដែលត្រូវប្រើសម្រាប់ចំណងជើង?
          </h2>

          <div className="space-y-4">
            <button className="w-full border border-[#d9d9d9] text-[#6c7080] rounded-lg py-3 hover:bg-gray-50 transition">
              {"<h1>"}
            </button>

            <button className="w-full border border-[#d9d9d9] text-[#6c7080] rounded-lg py-3 hover:bg-gray-50 transition">
              {"<h6>"}
            </button>

            <button className="w-full border border-[#d9d9d9] text-[#6c7080] rounded-lg py-3 hover:bg-gray-50 transition">
              {"<heading>"}
            </button>

            <button className="w-full border border-[#d9d9d9] text-[#6c7080] rounded-lg py-3 hover:bg-gray-50 transition">
              {"<head>"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
        
        {/* Previous Button */}
        <button className="bg-white shadow-md rounded-lg px-6 py-3 font-medium hover:bg-gray-50 transition">
          &lt; មុននេះ
        </button>

        {/* Dots */}
        <div className="flex space-x-3">
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        </div>

        {/* Next Button */}
        <button className="bg-blue-400 text-white shadow-md rounded-lg px-8 py-3 font-medium hover:bg-blue-500 transition">
          បន្តទៅមុខ
        </button>
      </div>
    </div>
)
}