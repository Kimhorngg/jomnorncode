import React, { useState } from "react";
import { IoSearchOutline, IoChevronDown } from "react-icons/io5";

const SearchBar = ({ onTyping, onExecuteSearch, courses = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState("កម្រិត");
  const [selectedLang, setSelectedLang] = useState("ភាសាកម្មវិធី");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onExecuteSearch(searchTerm);
    }
  };

  const truncateTitle = (title) => {
    return title.length > 15 ? title.substring(0, 15) + "..." : title;
  };
  const searchBartruncateTitle = (title) => {
    return title.length > 45 ? title.substring(0, 45) + "..." : title;
  };

  const dynamicLanguages = [
    ...new Set(courses.map((course) => course.title || course.courseTitle).filter(Boolean)),
  ];

  const filteredCourses = courses.filter((course) =>
    (course.title || course.courseTitle || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const levels = ["កម្រិតដំបូង", "កម្រិតមធ្យម", "កម្រិតខ្ពស់"];

  return (
    <div className="w-full bg-white dark:bg-[#0f172a] py-5 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-[1490px] mx-auto px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-y-6">
          <div className="flex flex-col sm:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
            <h2 className="text-2xl font-bold text-[#1e266d] dark:text-white whitespace-nowrap text-center sm:text-left">
              វគ្គសិក្សាទាំងអស់
            </h2>

            <div className="relative w-full sm:flex-1 lg:w-96">
              <div className="absolute inset-y-0 left-3 flex items-center align-middle pointer-events-none">
                <IoSearchOutline className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder:text-gray-400"
                placeholder="ស្វែងរកវគ្គសិក្សា..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onTyping(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />

              {/* --- SEARCH RESULTS DROPDOWN --- */}
              {searchTerm && (
                <div className="absolute right-0 lg:left-0 z-[100] w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  {filteredCourses.length > 0 ? (
                    <div className="max-h-[220px] overflow-y-auto">
                      {filteredCourses.map((course) => (
                        <div
                          key={course.courseId ?? course.id}
                          className="px-4 py-2 mt-2 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 border-b last:border-none border-gray-50 dark:border-gray-700 transition-colors"
                          onClick={() => {
                            const selectedTitle =
                              course.title || course.courseTitle || "";
                            setSearchTerm(selectedTitle);
                            onExecuteSearch(selectedTitle);
                          }}
                        >
                          <div className="w-full truncate whitespace-nowrap overflow-hidden pr-2">
                            {searchBartruncateTitle(
                              course.title || course.courseTitle || "",
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-gray-400 text-sm italic">
                     
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start md:justify-start gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
             
                setSelectedLang("ភាសាកម្មវិធី");
                setSearchTerm("");
                onExecuteSearch("");
              }}
              className="px-6 py-2 bg-[#4477ce] text-white rounded-full text-sm lg:text-base font-medium hover:bg-blue-700 transition-all whitespace-nowrap shadow-sm"
            >
              ទាំងអស់
            </button>

            {/* Level Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLevelOpen(!isLevelOpen);
                  setIsLangOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm lg:text-base text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors"
              >
                <span>{selectedLevel}</span>
                <IoChevronDown
                  className={`transition-transform duration-200 ${isLevelOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isLevelOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2">
                  {levels.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedLevel(item);
                        setIsLevelOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsLevelOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm lg:text-base text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors"
              >
                <span>{truncateTitle(selectedLang)}</span>
                <IoChevronDown
                  className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 py-2">
                  <div className="max-h-[180px] overflow-y-auto">
                    {dynamicLanguages.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedLang(item);
                          setIsLangOpen(false);
                          onExecuteSearch(item);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b last:border-none border-gray-50 dark:border-gray-700"
                      >
                        {truncateTitle(item)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
