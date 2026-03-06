import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoBookOutline, IoTimeOutline, IoPeopleOutline } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";

export default function RenderHomepageCards({ searchTerm }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllAvailable, setShowAllAvailable] = useState(false);

  useEffect(() => {
    const getAuthToken = () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        import.meta.env.VITE_API_TOKEN;
      if (!token) return null;

      try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        const now = Math.floor(Date.now() / 1000);
        if (payload?.exp && now >= payload.exp) return null;
      } catch {
        return token;
      }

      return token;
    };

    const buildHeaders = () => {
      const token = getAuthToken();
      return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://jomnorncode-api.cheat.casa/api/courses/public?all=true&page=0&size=1&sort=%5B%22string%22%5D",
          {
            method: "GET",
            headers: buildHeaders(),
          },
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <h1 className="text-center mt-20 mb-20 text-2xl font-bold text-[#112d4f]">
        កំពុងដំណើរការ...
      </h1>
    );
  }

  // Early return if no courses
  if (!courses.length) {
    return (
      <h2 className="text-center mt-20 mb-20 text-xl text-gray-600">
        មិនមានវគ្គសិក្សាទេ
      </h2>
    );
  }

  const filteredCourses = searchTerm
    ? courses.filter(
        (c) =>
          c.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : courses;

  // ⭐ Popular (highest rating)
const popularCourses = filteredCourses
  .filter(c => c.category?.name === "វគ្គសិក្សាពេញនិយម")
  .slice(0, 3);

  // 🆕 New (highest ID)
const newCourses = filteredCourses
  .sort((a, b) => b.courseId - a.courseId)
  .slice(1, 4);

  // 📚 Available (first 6)
  const availableCourses = showAllAvailable ? filteredCourses : filteredCourses.slice(0, 6);

  const formatNumber = (num) => {
    if (!num) return "០";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderCourseCard = (course) => {
    const resolvedCourseId = course.courseId ?? course.id;
    if (!resolvedCourseId) return null;

    return (
    <div
      key={`course-${resolvedCourseId}`} // More specific key
      className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col border border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="relative h-52 bg-gray-100 flex items-center justify-center p-8">
        <img
          src={
            course.thumbnailUrl || course.image || "/default-course-image.jpg"
          } // Add fallback
          alt={course.courseTitle || course.title || "Course thumbnail"}
          className="h-full w-full object-contain"
          onError={(e) => {
            e.target.src = "/default-course-image.jpg"; // Fallback for broken images
          }}
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <AiFillStar className="text-yellow-400" />
          <span className="text-xs font-bold text-gray-700">
            {(course.rating?.rate || 0).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-3 line-clamp-1">
          {course.courseTitle || course.title || "គ្មានចំណងជើង"}
        </h2>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2">
          {course.description || "គ្មានការពិពណ៌នា"}
        </p>

        <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
          <div className="flex items-center gap-1.5">
            <IoBookOutline className="text-orange-400 text-lg" />
            <span>{course.lessonCount || 10} មេរៀន</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IoTimeOutline className="text-orange-400 text-lg" />
            <span>{course.duration || 15} ម៉ោង</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IoPeopleOutline className="text-orange-400 text-lg" />
            <span>{formatNumber(course.students || 5000)} នាក់</span>
          </div>
        </div>

        <Link
          to={`/coursedetail/${resolvedCourseId}`}
          className="mt-auto w-full bg-[#4477ce] text-white font-medium py-3 rounded-xl text-center hover:bg-[#3563b0] transition-colors"
        >
          ចូលរៀន
        </Link>
      </div>
    </div>
    );
  };

const renderSection = (title, data, showViewMore = false) => {
  if (!data.length) return null;

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-[#112d4f] mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(renderCourseCard)}
      </div>

      {showViewMore && filteredCourses.length > 6 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllAvailable(!showAllAvailable)}
            className="px-6 py-3 bg-[#4477ce] text-white font-medium rounded-xl hover:bg-[#3563b0] transition-colors"
          >
            {showAllAvailable ? "បង្ហាញតិចតួច" : "បង្ហាញបន្ថែម"}
          </button>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="w-full py-11">
      <div className="max-w-[1490px] mx-auto px-4 sm:px-6 lg:px-8">
        {renderSection("វគ្គសិក្សាពេញនិយម", popularCourses)}
        {renderSection("វគ្គសិក្សាថ្មីៗ", newCourses)}
        {renderSection("វគ្គសិក្សាដែលមាន", availableCourses, true)}

        {/* Show message if no courses match search */}
        {searchTerm && filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            មិនមានវគ្គសិក្សាដែលត្រូវនឹងការស្វែងរកទេ
          </p>
        )}
      </div>
    </div>
  );
}
