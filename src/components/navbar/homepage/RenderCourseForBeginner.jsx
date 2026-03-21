import { Link } from "react-router-dom";
export default function RenderCourseForBeginner() {
  return (
    <>
      <div className="bg-[#fcfcfc] dark:bg-[#091220] py-16 transition-colors duration-300">
        <div className="max-w-420 mx-auto px-6 lg:px-12">
          <div
            className="flex justify-between items-center mb-16 gap-4 flex-wrap"
            data-aos="fade-up"
          >
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#112d4f] dark:text-blue-300 flex items-center gap-2">
                វគ្គសិក្សាកូដសម្រាប់អ្នកចាប់ផ្តើម
                <span className="w-3 h-3 bg-[#ffa500] rounded-full mt-2"></span>
              </h2>
              <p className="text-gray-500 text-xl  dark:text-blue-200 mt-5 ">
                ជាឱកាសល្អបំផុតសម្រាប់អ្នកចាប់ផ្តើមដំបូង
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div
              className="bg-white border border-gray-200 dark:border-[#314057] dark:bg-[#1c293d] dark:border-2 dark:border-blue-500 w-full rounded-2xl shadow-lg dark:shadow-[0_14px_36px_-12px_rgba(148,163,184,0.45)] pt-8 pb-8 px-4 md:pt-10 md:pb-10 md:px-6 text-center relative min-h-[18rem] md:min-h-[20rem] transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="flex justify-center -mt-16">
                <img
                  src="https://miro.medium.com/1*dVRNj-7iK3PJgfJIpCNr5Q.jpeg"
                  alt="HTML Logo"
                  className="w-24 h-24 object-cover rounded-xl shadow-md mx-auto"
                />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-blue-900 dark:text-white mt-4 md:mt-6">
                HTML
              </h1>
              <p className="text-gray-600 dark:text-white leading-relaxed text-sm md:text-base mt-4 md:mt-8">
                វគ្គសិក្សានេះបង្កើតឡើងសម្រាប់អ្នកចង់ចាប់ផ្តើមរៀនបង្កើតគេហទំព័រដំបូង។
                អ្នកនឹងសិក្សាពី HTML ដែលជាមូលដ្ឋានសំខាន់សម្រាប់គេហទំព័រទាំងអស់។
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="bg-white border border-gray-200 dark:border-[#314057] dark:bg-[#1c293d] dark:border-2 dark:border-blue-500 w-full rounded-2xl shadow-lg dark:shadow-[0_14px_36px_-12px_rgba(148,163,184,0.45)] pt-8 pb-8 px-4 md:pt-10 md:pb-10 md:px-6 text-center relative min-h-[18rem] md:min-h-[20rem] transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex justify-center -mt-16">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKZdbmTKy7h3cd-gxj7dKBQpTUJkt5tpmtQ&s"
                  alt="C Logo"
                  className="w-24 h-24 object-cover rounded-xl shadow-md mx-auto"
                />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-blue-900 dark:text-white mt-4 md:mt-6">
                C
              </h1>
              <p className="text-gray-600 dark:text-white leading-relaxed text-sm md:text-base mt-4 md:mt-8">
                វគ្គសិក្សានេះសម្រាប់អ្នកចង់រៀនមូលដ្ឋាននៃការសរសេរកូដ​កម្មវិធីប្រើភាសា
                C ដែលជាភាសាសំខាន់ក្នុងវិស័យកុំព្យូទ័រ
                និងជាមូលដ្ឋានសម្រាប់រៀនភាសាផ្សេងៗ។
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="bg-white border border-gray-200 dark:border-[#314057] dark:bg-[#1c293d] dark:border-2 dark:border-blue-500 w-full rounded-2xl shadow-lg dark:shadow-[0_14px_36px_-12px_rgba(148,163,184,0.45)] pt-8 pb-8 px-4 md:pt-10 md:pb-10 md:px-6 text-center relative min-h-[18rem] md:min-h-[20rem] transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex justify-center -mt-16">
                <img
                  src="https://images.seeklogo.com/logo-png/18/2/css3-logo-png_seeklogo-186678.png"
                  alt="CSS Logo"
                  className="w-24 h-24 object-cover rounded-xl shadow-md mx-auto"
                />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-blue-900 dark:text-white mt-4 md:mt-6">
                CSS
              </h1>
              <p className="text-gray-600 dark:text-white leading-relaxed text-sm md:text-base mt-4 md:mt-8">
                វគ្គសិក្សានេះសម្រាប់អ្នកចង់ធ្វើអោយគេហទំព័រ​មាន​ភាពស្រស់ស្អាត។
                CSS ជួយកំណត់ពណ៍ ទំហំ ទម្រង់ និងការរៀបចំ Layout នៃគេហទំព័រ។
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
