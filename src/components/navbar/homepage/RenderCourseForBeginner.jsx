import{Link} from "react-router-dom";
export default function RenderCourseForBeginner() {
  return (
    <>
      {/* Section Header */}
      <div className="flex justify-between items-center mb-16  gap-4 px-6 sm:px-10  flex-wrap dark:bg-[#0e172b]">
        <div className="flex-1 min-w-[200px] md:pl-23">
          <h2 className="text-3xl md:text-4xl font-bold text-[#112d4f] lg:pl-8 flex items-center gap-2">
            វគ្គសិក្សាកូដសម្រាប់អ្នកចាប់ផ្តើម
            <span className="w-3 h-3 bg-[#ffa500] rounded-full mt-2"></span>
          </h2>
          <p className="text-gray-500 mt-5 text-lg lg:pl-8">
            ជាឱកាសល្អបំផុតសម្រាប់អ្នកចាប់ផ្តើមដំបូង
          </p>
        </div>

        <Link to="/course" className="bg-[#3f72af] md:mr-30 border-2 border-gray-500 hover:bg-[#0e468b] text-white text-base sm:text-lg font-semibold px-8 py-4 sm:px-10 sm:py-5 rounded-xl transition-all whitespace-nowrap">
          មើលបន្ថែម
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-30 px-4  md:px-40 dark:bg-[#0e172b]">
        {/* Card 1 */}
        <div className="bg-white w-full rounded-2xl shadow-lg pt-10 pb-10 px-6 text-center relative min-h-[20rem]">
          <div className="flex justify-center -mt-16">
            <img
              src="https://miro.medium.com/1*dVRNj-7iK3PJgfJIpCNr5Q.jpeg"
              alt="HTML Logo"
              className="w-24 h-24 object-cover rounded-xl shadow-md mx-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mt-6">HTML</h1>
          <p className="text-gray-600 leading-relaxed text-base mt-8">
            វគ្គសិក្សានេះបង្កើតឡើងសម្រាប់អ្នកចង់ចាប់ផ្តើមរៀនបង្កើតគេហទំព័រដំបូង។ អ្នកនឹងសិក្សាពី HTML ដែលជាមូលដ្ឋានសំខាន់សម្រាប់គេហទំព័រទាំងអស់។
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white w-full rounded-2xl shadow-lg pt-10 pb-10 px-6 text-center relative min-h-[20rem]">
          <div className="flex justify-center -mt-16">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKZdbmTKy7h3cd-gxj7dKBQpTUJkt5tpmtQ&s"
              alt="C Logo"
              className="w-24 h-24 object-cover rounded-xl shadow-md mx-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mt-6">C</h1>
          <p className="text-gray-600 leading-relaxed text-base mt-8">
            វគ្គសិក្សានេះសម្រាប់អ្នកចង់រៀនមូលដ្ឋាននៃការសរសេរកូដ​កម្មវិធីប្រើភាសា C ដែលជាភាសាសំខាន់ក្នុងវិស័យកុំព្យូទ័រ និងជាមូលដ្ឋានសម្រាប់រៀនភាសាផ្សេងៗ។
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white w-full rounded-2xl shadow-lg pt-10 pb-10 px-6 text-center relative min-h-[20rem]">
          <div className="flex justify-center -mt-16">
            <img
              src="https://images.seeklogo.com/logo-png/18/2/css3-logo-png_seeklogo-186678.png"
              alt="CSS Logo"
              className="w-24 h-24 object-cover rounded-xl shadow-md mx-auto"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mt-6">CSS</h1>
          <p className="text-gray-600 leading-relaxed text-base mt-8">
            វគ្គសិក្សានេះសម្រាប់អ្នកចង់ធ្វើអោយគេហទំព័រ​មាន​ភាពស្រស់ស្អាត។ CSS ជួយកំណត់ពណ៍ ទំហំ ទម្រង់ និងការរៀបចំ Layout នៃគេហទំព័រ។
          </p>
        </div>
      </div>
    </>
  );
}