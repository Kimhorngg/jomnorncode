import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LessonTopSection() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

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

   const buildHeaders = () => {
  // Your fixed token
  const fixedToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb21ub3JuY29kZUBnbWFpbC5jb20iLCJpYXQiOjE3NzI3MDkwNDUsImV4cCI6MTc3Mjc5NTQ0NX0.M8NUcwZXxOP7ALbuncUUFq-RrqIjJjFaEKfnsH12300";

  // Try to get token from localStorage or env
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    import.meta.env.VITE_API_TOKEN ||
    fixedToken; // fallback to your fixed token

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

    const requestJson = async (url) => {
      const authRes = await fetch(url, { method: "GET", headers: buildHeaders() });
      if (authRes.ok) return authRes.json();

      if (authRes.status === 401 || authRes.status === 403) {
        const publicRes = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
        });
        if (publicRes.ok) return publicRes.json();
      }

      throw new Error(`HTTP ${authRes.status}`);
    };

    const fetchLesson = async () => {
      try {
        const payload = await requestJson(
          `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
        );
        const lessons = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        let currentLesson =
          lessons.find((item) => String(item.lessonId) === String(lessonId)) ||
          lessons.find((item) => String(item.id) === String(lessonId)) ||
          lessons.find((item) => Number(item.sequenceNumber) === Number(lessonId));

        if (!currentLesson) {
          currentLesson = lessons[Number(lessonId) - 1];
        }

        setLesson(
          currentLesson || {
            sequenceNumber: lessonId,
            title: `មេរៀនទី ${lessonId}`,
            description: "គ្មានការពិពណ៌នា",
          },
        );
      } catch (error) {
        console.error("API error:", error);
        setLesson({
          sequenceNumber: lessonId,
          title: `មេរៀនទី ${lessonId}`,
          description: "គ្មានការពិពណ៌នា",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return <div className="text-center py-10">Loading Lesson...</div>;
  }

  return (
    <div className="w-full bg-[#f2f2f2]">
      <div className="max-w-[1570px] mx-auto px-6 md:px-20 pt-10 pb-4 text-slate-800">

        {/* Back */}
        <div className="text-[#102e50] font-semibold text-lg mb-4 cursor-pointer">
          {"< ត្រឡប់ទៅវគ្គសិក្សា"}
        </div>

        {/* Buttons */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 bg-blue-50 text-sm">
            {`</> មេរៀនទី ${lesson.sequenceNumber}`}
          </button>

          <button className="px-4 py-2 rounded-full border border-green-500 text-green-600 bg-green-50 text-sm">
            ងាយស្រួល
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#112d4f] mb-2 flex items-center gap-2">
          {lesson.title}
          <span className="text-[#ffa500]">●</span>
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-2">
          {lesson.description}
        </p>

      </div>
    </div>
  );
}
