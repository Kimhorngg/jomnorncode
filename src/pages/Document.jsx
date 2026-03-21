// import DatabaseCard from "../components/navbar/documentpage/DatabaseCard";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroBanner from "../components/navbar/documentpage/HeroBanner";
import StepCard from "../components/navbar/documentpage/StepCard";

const Document = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const stepsData = [
    {
      title: "ស្វែងរកវគ្គសិក្សា",
      stepNumber: "១",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      steps: [
        "ចូលទៅកាន់ទំព័រ វគ្គសិក្សា។",
        "មើលវគ្គសិក្សាដែលមាន។",
        "ចុចលើវគ្គណាមួយដើម្បីមើលព័ត៌មានបន្ថែម។",
      ],
    },
    {
      title: "មេីលបញ្ជីមេរៀន",
      stepNumber: "២",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      steps: [
        "មើលបញ្ជីមេរៀនក្នុងវគ្គ",
        "មេរៀនខ្លះនឹងត្រូវបានបិទ (Locked)",
        "ត្រូវចុះឈ្មោះ ឬចូលគណនីសិន ដើម្បីរៀនបន្ត",
      ],
    },
    {
      title: "បង្កើតគណនី",
      stepNumber: "៣",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      description: "នៅលើទំព័រវគ្គសិក្សា សិស្សអាចមើលឃើញ៖",
      steps: [
        "ចុចលើ Register / Sign Up",
        "បញ្ចូលព័ត៌មាន (Email, Password, Google)",
        "បង្កើតគណនីដោយឥតគិតថ្លៃ",
      ],
    },
    {
      title: "ចូលគណនី",
      stepNumber: "៤",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      steps: ["បញ្ចូល Email និង Password", "ចូលប្រើគណនីរបស់អ្នក"],
    },
    {
      title: "ចាប់ផ្តើមរៀនចាប់ផ្តើមរៀន",
      stepNumber: "៥",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      description: "ប្រសិនបើគ្រប់យ៉ាងត្រឹមត្រូវ៖",
      steps: [
        "ជ្រើសមេរៀនដែលចង់រៀន",
        "រៀនតាមជំហានដោយភាសាខ្មែរ",
        "អនុវត្តតាមឧទាហរណ៍ មេរៀន ការធ្វេីតេស្តផ្សេងៗ",
      ],
    },
    {
      title: "ធ្វើតេស្ត និងអនុវត្ត",
      stepNumber: "៦",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      description: "ប្រសិនបើគ្រប់យ៉ាងត្រឹមត្រូវ៖",
      steps: [
        "ធ្វើ Quiz បន្ទាប់ពីមេរៀន",
        "ប្រើ Code Playground ដើម្បីអនុវត្ត",
        "ពិនិត្យចំណេះដឹងរបស់អ្នក",
      ],
    },
    {
      title: "តាមដាន និងទទួលវិញ្ញាបនបត្រ",
      stepNumber: "៧",
      bgColor: "#93d1fa",
      borderColor: "#0099ff",
      textColor: "#112d51",
      listColor: "#0099ff",
      description: "ប្រសិនបើគ្រប់យ៉ាងត្រឹមត្រូវ៖",
      steps: [
        "មើលការរីកចម្រើន (Progress)",
        "ដឹងថាអ្នករៀនដល់ណា",
        "បញ្ចប់វគ្គ ដើម្បីទទួលបានវិញ្ញាបនបត្រ",
      ],
    },
  ];

  const totalPages = Math.ceil(stepsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSteps = stepsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#0f172a] min-h-screen pb-20">
      {/* HeroBanner */}
      <div data-aos="fade-up">
        <HeroBanner />
      </div>

      <div className="max-w-420 mx-auto px-6 lg:px-12">
        {/* Render paginated steps */}
        {paginatedSteps.map((step, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={`${(index + 1) * 100}`}
          >
            <StepCard
              title={step.title}
              stepNumber={step.stepNumber}
              bgColor={step.bgColor}
              borderColor={step.borderColor}
              textColor={step.textColor}
              listColor={step.listColor}
              description={step.description}
              steps={step.steps}
            />
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                : "bg-[#0099ff] text-white hover:bg-[#0077cc] active:scale-95"
            }`}
          >
            <ChevronLeft size={20} />
            មុន
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? "bg-[#0099ff] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                : "bg-[#0099ff] text-white hover:bg-[#0077cc] active:scale-95"
            }`}
          >
            បន្ទាប់
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Page info */}
        <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
          ទំព័រ {currentPage} នៃ {totalPages}
        </div>

        {/* បន្ថែម Database Card នៅទីនេះ */}
        {/* <DatabaseCard/> */}
      </div>
    </div>
  );
};

export default Document;
