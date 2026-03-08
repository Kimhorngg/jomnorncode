import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";

export default function LessonTopSection() {
  const { courseId, lessonId } = useParams();
  const reduxToken = useSelector((state) => state?.auth?.token);
  const location = useLocation();
  const routeLessonTitle = location.state?.lessonTitle;
  const routeSequenceNumber = location.state?.sequenceNumber;
  const [lesson, setLesson] = useState(
    routeLessonTitle
      ? {
          sequenceNumber: routeSequenceNumber ?? lessonId,
          title: routeLessonTitle,
          description: "គ្មានការពិពណ៌នា",
        }
      : null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (routeLessonTitle) {
      setLesson((prev) => ({
        sequenceNumber: routeSequenceNumber ?? prev?.sequenceNumber ?? lessonId,
        title: routeLessonTitle,
        description: prev?.description ?? "គ្មានការពិពណ៌នា",
      }));
    }

    const buildHeaders = () => {
      const token =
        reduxToken ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        import.meta.env.VITE_API_TOKEN;

      return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    };

    const requestJson = async (url) => {
      const authHeaders = buildHeaders();
      const authRes = await fetch(url, { method: "GET", headers: authHeaders });
      if (authRes.ok) return authRes.json();

      if (authRes.status === 401 || authRes.status === 403) {
        const publicRes = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (publicRes.ok) return publicRes.json();
      }

      throw new Error(`HTTP ${authRes.status}`);
    };

    const fetchLesson = async () => {
      try {
        const endpoints = [
          `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
          `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
        ];

        let payload = null;
        for (const url of endpoints) {
          try {
            payload = await requestJson(url);
            break;
          } catch {
            payload = null;
          }
        }

        const extractList = (data) => {
          if (Array.isArray(data)) return data;
          if (Array.isArray(data?.data)) return data.data;
          if (Array.isArray(data?.data?.data)) return data.data.data;
          if (Array.isArray(data?.data?.items)) return data.data.items;
          if (Array.isArray(data?.data?.content)) return data.data.content;
          if (Array.isArray(data?.data?.lessons)) return data.data.lessons;
          if (Array.isArray(data?.items)) return data.items;
          if (Array.isArray(data?.content)) return data.content;
          if (Array.isArray(data?.lessons)) return data.lessons;
          if (Array.isArray(data?.result)) return data.result;
          if (Array.isArray(data?.result?.data)) return data.result.data;
          if (Array.isArray(data?.result?.items)) return data.result.items;
          if (Array.isArray(data?.result?.content)) return data.result.content;
          if (Array.isArray(data?.result?.lessons)) return data.result.lessons;
          return [];
        };

        const lessons = extractList(payload);

        const numericLessonId = Number(lessonId);
        const toNumber = (value) => {
          const parsed = Number(value);
          return Number.isFinite(parsed) ? parsed : null;
        };

        let currentLesson =
          lessons.find((item) => String(item.lessonId) === String(lessonId)) ||
          lessons.find((item) => String(item.id) === String(lessonId)) ||
          lessons.find((item) => String(item.lesson_id) === String(lessonId)) ||
          lessons.find((item) => toNumber(item.sequenceNumber) === numericLessonId) ||
          lessons.find((item) => toNumber(item.sequence) === numericLessonId) ||
          lessons.find((item) => toNumber(item.order) === numericLessonId);

        if (!currentLesson && Number.isFinite(numericLessonId) && numericLessonId > 0) {
          const byOrder = [...lessons].sort((a, b) => {
            const aOrder =
              toNumber(a.sequenceNumber) ?? toNumber(a.sequence) ?? toNumber(a.order) ?? 0;
            const bOrder =
              toNumber(b.sequenceNumber) ?? toNumber(b.sequence) ?? toNumber(b.order) ?? 0;
            return aOrder - bOrder;
          });
          currentLesson = byOrder[numericLessonId - 1] || lessons[numericLessonId - 1];
        }

        if (currentLesson) {
          setLesson({
            sequenceNumber:
              currentLesson.sequenceNumber ??
              currentLesson.sequence ??
              currentLesson.order ??
              routeSequenceNumber ??
              lessonId,
            title:
              currentLesson.lessonTitle ??
              currentLesson.title ??
              currentLesson.lesson_name ??
              currentLesson.name ??
              routeLessonTitle ??
              `មេរៀនទី ${lessonId}`,
            description:
              currentLesson.description ??
              currentLesson.content ??
              "គ្មានការពិពណ៌នា",
          });
        } else {
          setLesson({
            sequenceNumber: routeSequenceNumber ?? lessonId,
            title: routeLessonTitle || `មេរៀនទី ${lessonId}`,
            description: "គ្មានការពិពណ៌នា",
          });
        }
      } catch (error) {
        console.error("API error:", error);
        setLesson({
          sequenceNumber: routeSequenceNumber ?? lessonId,
          title: routeLessonTitle || `មេរៀនទី ${lessonId}`,
          description: "គ្មានការពិពណ៌នា",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId, routeLessonTitle, routeSequenceNumber, reduxToken]);

  if (loading && !lesson) {
    return <div className="text-center py-10">Loading Lesson...</div>;
  }

  return (
    <div className="w-full bg-[#f2f2f2]">
      <div className="max-w-420 mx-auto px-6 lg:px-12 pt-10 pb-4 text-slate-800">

        {/* Back */}
        <Link
          to={`/coursedetail/${courseId}`}
          className="inline-block text-[#102e50] font-semibold text-lg mb-4 hover:text-[#3f71af] transition-colors"
        >
          {"< ត្រឡប់ទៅវគ្គសិក្សា"}
        </Link>

        {/* Buttons */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 bg-blue-50 text-sm">
            {`</> ${lesson.title || `មេរៀនទី ${lesson.sequenceNumber}`}`}
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
