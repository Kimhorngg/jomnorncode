import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DefinitionCard() {
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
      const token = getAuthToken();
      return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    };

    const requestJson = async (url) => {
      let res = await fetch(url, { method: "GET", headers: buildHeaders() });
      if (res.status === 401 || res.status === 403) {
        res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    };

    const fetchLesson = async () => {
      try {
        setLoading(true);

        const endpoints = [
          `https://jomnorncode-api.cheat.casa/api/lesson/course/${courseId}/ordered`,
          `https://jomnorncode-api.cheat.casa/api/lesson/course/${courseId}/ordered/`,
          `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
          `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
          `https://jomnorncode-api.cheat.casa/api/api/lesson/course/${courseId}/ordered`,
        ];

        let lessons = [];
        for (const url of endpoints) {
          try {
            const data = await requestJson(url);
            lessons = Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data?.items)
                  ? data.items
                  : Array.isArray(data?.lessons)
                    ? data.lessons
                    : [];
            if (lessons.length) break;
          } catch {
            lessons = [];
          }
        }

        const numericLessonId = Number(lessonId);
        const currentLesson =
          lessons.find((item) => String(item.lessonId) === String(lessonId)) ||
          lessons.find((item) => String(item.id) === String(lessonId)) ||
          lessons.find((item) => String(item.lesson_id) === String(lessonId)) ||
          lessons.find((item) => Number(item.sequenceNumber) === numericLessonId) ||
          lessons.find((item) => Number(item.sequence) === numericLessonId) ||
          lessons.find((item) => Number(item.order) === numericLessonId) ||
          (numericLessonId > 0 ? lessons[numericLessonId - 1] : null);

        setLesson(currentLesson || null);
      } catch (error) {
        console.error(error);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return <div className="text-center mt-10">Loading Definition...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#1c293f] p-6 md:p-10 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold mb-3 text-[#102d4f] dark:text-white">
        {lesson?.lessonTitle || lesson?.title || "មិនមានចំណងជើង"}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {lesson?.content || lesson?.description || "គ្មានមាតិកាមេរៀន"}
      </p>
    </div>
  );
}
