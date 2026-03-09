import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PUBLIC_API_CANDIDATES = [
  "https://jomnorncode-api.cheat.casa/api/courses/public?all=true&page=0&size=20",
  "https://jomnorncode-api.cheat.casa/api/api/courses/public?all=true&page=0&size=20",
];
const AUTH_API_CANDIDATES = [
  ...PUBLIC_API_CANDIDATES,
  "https://jomnorncode-api.cheat.casa/api/courses",
];

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.courses)) return payload.courses;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.categoryCourses)) return payload.categoryCourses;
  if (Array.isArray(payload?.category?.courses))
    return payload.category.courses;
  return [];
};

const normalizeCourses = (rawCourses) =>
  rawCourses
    .map((course) => {
      const courseId = course.courseId ?? course.id;
      if (!courseId) return null;

      return {
        id: courseId,
        title: course.courseTitle ?? course.title ?? "គ្មានចំណងជើង",
        description: course.description ?? "",
        image:
          course.thumbnailUrl ?? course.image ?? "/default-course-image.jpg",
        lessonCount: course.lessonCount ?? 0,
        categoryId: course.category?.id ?? course.categoryId,
        categoryName: course.category?.name ?? course.categoryName ?? "",
      };
    })
    .filter(Boolean);

const isPopularCourse = (course) => {
  const categoryName = (course.categoryName || "").toLowerCase();
  return (
    Number(course.categoryId) === 15 ||
    categoryName.includes("ពេញនិយម") ||
    categoryName.includes("popular")
  );
};

export default function RenderPopularHomepageCard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAuthToken = () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        import.meta.env.VITE_API_TOKEN;
      if (!token) return null;

      try {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        );
        const now = Math.floor(Date.now() / 1000);
        if (payload?.exp && now >= payload.exp) return null;
      } catch {
        return token;
      }

      return token;
    };

    const token = getAuthToken();
    const apiCandidates = token ? AUTH_API_CANDIDATES : PUBLIC_API_CANDIDATES;

    const fetchJson = async (url) => {
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let response = await fetch(url, { method: "GET", headers });
      if ((response.status === 401 || response.status === 403) && token) {
        response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} on ${url}`);
      }

      return response.json();
    };

    const fetchPopularCourses = async () => {
      try {
        let allCourses = [];

        for (const url of apiCandidates) {
          try {
            const payload = await fetchJson(url);
            const parsed = normalizeCourses(extractList(payload));
            if (parsed.length) {
              allCourses = parsed;
              break;
            }
          } catch {
            // try next candidate URL
          }
        }

        if (!allCourses.length) {
          throw new Error("No courses found from available endpoints");
        }

        const popularCourses = allCourses.filter(isPopularCourse);
        setCourses(
          popularCourses.length ? popularCourses : allCourses.slice(0, 6),
        );
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("មិនអាចទាញវគ្គសិក្សាពេញនិយមបាន");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  if (loading) {
    return (
      <h1 className="text-center mt-20 mb-20 text-2xl">កំពុងដំណើរការ...</h1>
    );
  }

  if (error) {
    return (
      <h2 className="text-center mt-20 mb-20 text-xl text-red-600">{error}</h2>
    );
  }

  if (!courses.length) {
    return (
      <h2 className="text-center mt-20 mb-20 text-xl text-gray-600">
        មិនមានវគ្គសិក្សាទេ
      </h2>
    );
  }

  const displayedCourses = showAll ? courses : courses.slice(0, 3);

  return (
    <div className="bg-gray-100 dark:bg-[#0b1220] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-420 mx-auto px-6 lg:px-12">
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-[#112d4f] dark:text-white">
            វគ្គសិក្សាដែលពេញនិយម
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayedCourses.map((course, index) => (
            <div
              key={course.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white dark:bg-[#111827] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="h-72 flex items-center justify-center bg-gray-100 dark:bg-[#0f172a]">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-56 h-56 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/default-course-image.jpg";
                  }}
                />
              </div>

              <div className="p-6 text-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 line-clamp-1">
                  {course.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                  {(course.description || "គ្មានការពិពណ៌នា").slice(0, 80)}...
                </p>

                <p className="font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {course.lessonCount || 10} មេរៀន
                </p>

                <Link
                  to={`/coursedetail/${course.id}`}
                  className="block w-full bg-[#3f72af] hover:bg-[#112d50] text-white py-3 px-5 rounded-lg transition duration-300"
                >
                  ចុចដើម្បីរៀន
                </Link>
              </div>
            </div>
          ))}
        </div>

        {courses.length > 3 && (
          <div className="text-center mt-12" data-aos="fade-up">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-[#3f72af] hover:bg-[#0d223a] text-white px-8 py-3 rounded-lg transition duration-300"
            >
              {showAll ? "មេីលតិច" : "មេីលបន្ថែម"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
