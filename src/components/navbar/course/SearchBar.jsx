import React, { useMemo, useState, useEffect, useRef } from "react";
import { IoSearchOutline, IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const DEFAULT_COURSE_LABEL = "ជ្រើសរើសវគ្គសិក្សា";
const PUBLIC_API_CANDIDATES = [
  "https://jomnorncode-api.cheat.casa/api/courses/public?all=true&page=0&size=200&sortBy=createdAt&direction=desc",
  "https://jomnorncode-api.cheat.casa/api/api/courses/public?all=true&page=0&size=200&sortBy=createdAt&direction=desc",
];

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.courses)) return payload.courses;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const SearchBar = ({ onTyping, onExecuteSearch, courses = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchJson = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} on ${url}`);
      }

      return response.json();
    };

    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let coursesArray = [];

        for (const url of PUBLIC_API_CANDIDATES) {
          try {
            const payload = await fetchJson(url);
            const list = extractList(payload);

            if (list.length) {
              coursesArray = list;
              break;
            }
          } catch {
            // try next URL
          }
        }

        setFetchedCourses(coursesArray);
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCourseOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCourseTitle = (course) => {
    if (!course) return "";

    return String(
      course?.courseTitle ||
        course?.course?.courseTitle ||
        course?.title ||
        course?.course?.title ||
        course?.name ||
        course?.course_name ||
        course?.courseName ||
        course?.course_title ||
        course?.courseNameEn ||
        course?.courseNameKh ||
        "",
    ).trim();
  };

  const getCourseId = (course) => {
    return (
      course?.courseId ||
      course?.id ||
      course?._id ||
      course?.course?.courseId ||
      course?.course?.id ||
      null
    );
  };

  const truncateTitle = (title = "", max = 20) => {
    return title.length > max ? `${title.substring(0, max)}...` : title;
  };

  // Use fetched courses first, fallback to props
  const sourceCourses = fetchedCourses.length > 0 ? fetchedCourses : courses;

  // Normalize course data
  const normalizedCourses = useMemo(() => {
    return sourceCourses
      .map((course, index) => {
        const title = getCourseTitle(course);
        const id = getCourseId(course);

        return {
          id: id ?? `course-${index}`,
          hasRouteId: id != null && String(id).trim() !== "",
          title,
          raw: course,
        };
      })
      .filter((course) => course.title);
  }, [sourceCourses]);

  // Remove duplicates by title
  const uniqueCourses = useMemo(() => {
    const seen = new Set();

    return normalizedCourses.filter((course) => {
      const key = course.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [normalizedCourses]);

  // Search suggestions
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return uniqueCourses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [uniqueCourses, searchTerm]);

  const handleSearchSubmit = () => {
    onExecuteSearch?.(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSearchTerm(course.title);
    setIsCourseOpen(false);
    onTyping?.(course.title);
    onExecuteSearch?.(course.title);

    if (course.hasRouteId) {
      navigate(`/coursedetail/${course.id}`);
    }
  };

  const handleReset = () => {
    setSelectedCourse(null);
    setSearchTerm("");
    setIsCourseOpen(false);
    onTyping?.("");
    onExecuteSearch?.("");
  };

  return (
    <div className="relative z-30 w-full bg-white dark:bg-[#0f172a] py-5 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-[1630px] mx-auto px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-y-6">
          <div className="flex flex-col sm:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
            <h2 className="text-2xl font-bold text-[#1e266d] dark:text-white whitespace-nowrap text-center sm:text-left">
              វគ្គសិក្សាទាំងអស់
            </h2>

            <div className="relative w-full sm:flex-1 lg:w-96">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IoSearchOutline className="text-gray-400 text-lg" />
              </div>

              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder:text-gray-400"
                placeholder="ស្វែងរកវគ្គសិក្សា..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  onTyping?.(value);
                }}
                onKeyDown={handleKeyDown}
              />

              {searchTerm && filteredCourses.length > 0 && (
                <div className="absolute right-0 lg:left-0 z-[260] w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="max-h-[168px] overflow-y-auto">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-200 border-b last:border-none border-gray-50 dark:border-gray-700 transition-colors"
                        onClick={() => handleSelectCourse(course)}
                      >
                        <div className="w-full truncate whitespace-nowrap overflow-hidden pr-2">
                          {truncateTitle(course.title, 45)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-3 w-full lg:w-auto">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-[#4477ce] text-white rounded-full text-sm lg:text-base font-medium hover:bg-blue-700 transition-all whitespace-nowrap shadow-sm"
            >
              ទាំងអស់
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCourseOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm lg:text-base text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors"
              >
                <span>
                  {truncateTitle(
                    selectedCourse?.title || DEFAULT_COURSE_LABEL,
                    25,
                  )}
                </span>
                <IoChevronDown
                  className={`transition-transform duration-200 ${
                    isCourseOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCourseOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-[260] py-2">
                  <div className="max-h-[168px] overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        កំពុងផ្ទុក...
                      </div>
                    ) : error ? (
                      <div className="px-4 py-3 text-sm text-red-500 dark:text-red-400">
                        កំហុស: {error}
                      </div>
                    ) : uniqueCourses.length > 0 ? (
                      uniqueCourses.map((course) => (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => handleSelectCourse(course)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-b last:border-none border-gray-100 dark:border-gray-700 transition-colors"
                        >
                          {truncateTitle(course.title, 40)}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        មិនមានវគ្គសិក្សា
                      </div>
                    )}
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
