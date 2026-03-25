import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import {
  isLessonCompletedForUser,
  isQuizCompletedForUser,
} from "../../../utils/lessonProgress";

const LEARN_STARTED_COURSES_KEY = "learn-started-courses";

export default function CourseCurriculum({ courseId, lessons = [] }) {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const reduxUser = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [fallbackLessons, setFallbackLessons] = useState([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState({});

  const getAuthToken = () => {
    const token =
      reduxToken ||
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

  const authToken = getAuthToken();

  const effectiveLessons = useMemo(
    () => (lessons?.length ? lessons : fallbackLessons),
    [lessons, fallbackLessons],
  );
  const visibleLessons = showAll
    ? effectiveLessons
    : effectiveLessons.slice(0, 3);

  const loadCompletedLessons = () => {
    const nextState = effectiveLessons.reduce((acc, lesson) => {
      const lessonId = String(lesson.id);
      acc[lessonId] =
        isLessonCompletedForUser(lessonId) && isQuizCompletedForUser(lessonId);
      return acc;
    }, {});

    setCompletedLessonIds(nextState);
  };

  const toKhmerNumber = (num) => {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num)
      .split("")
      .map((digit) => khmerDigits[parseInt(digit, 10)])
      .join("");
  };

  useEffect(() => {
    if (lessons?.length) return;
    const token = authToken;
    if (!token) {
      setFallbackLessons([]);
      setFallbackError(null);
      setFallbackLoading(false);
      return;
    }
    const headers = {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const extractList = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.data?.data)) return payload.data.data;
      if (Array.isArray(payload?.data?.items)) return payload.data.items;
      if (Array.isArray(payload?.data?.content)) return payload.data.content;
      if (Array.isArray(payload?.data?.lessons)) return payload.data.lessons;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.content)) return payload.content;
      if (Array.isArray(payload?.lessons)) return payload.lessons;
      if (Array.isArray(payload?.result)) return payload.result;
      if (Array.isArray(payload?.result?.data)) return payload.result.data;
      if (Array.isArray(payload?.result?.items)) return payload.result.items;
      if (Array.isArray(payload?.result?.content))
        return payload.result.content;
      if (Array.isArray(payload?.result?.lessons))
        return payload.result.lessons;
      return [];
    };

    const normalizeLessons = (raw) =>
      raw
        .map((lesson, index) => ({
          id: lesson.lessonId ?? lesson.id ?? lesson.lesson_id ?? index + 1,
          sequenceNumber:
            lesson.sequenceNumber ??
            lesson.sequence ??
            lesson.order ??
            index + 1,
          title:
            lesson.lessonTitle ??
            lesson.title ??
            lesson.lesson_name ??
            lesson.name ??
            `Lesson ${index + 1}`,
        }))
        .filter((item) => item.id != null && item.title);

    const fetchFallbackLessons = async () => {
      setFallbackLoading(true);
      setFallbackError(null);

      const urls = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
      ];

      try {
        for (const url of urls) {
          let response = await fetch(url, { headers });
          if ((response.status === 401 || response.status === 403) && token) {
            response = await fetch(url, {
              headers: { Accept: "application/json" },
            });
          }
          if (!response.ok) continue;

          const payload = await response.json();
          const parsed = normalizeLessons(extractList(payload));
          if (parsed.length) {
            setFallbackLessons(parsed);
            setFallbackLoading(false);
            return;
          }
        }
        setFallbackLessons([]);
        setFallbackError("មិនអាចទាញមេរៀនបាន");
      } catch {
        setFallbackError("មិនអាចទាញមេរៀនបាន");
      } finally {
        setFallbackLoading(false);
      }
    };

    fetchFallbackLessons();
  }, [courseId, lessons?.length, authToken]);

  useEffect(() => {
    loadCompletedLessons();
    window.addEventListener("lessonProgressUpdated", loadCompletedLessons);

    return () => {
      window.removeEventListener("lessonProgressUpdated", loadCompletedLessons);
    };
  }, [effectiveLessons, authToken]);

  // Reload completed lessons when component mounts or lessons change
  useEffect(() => {
    if (effectiveLessons.length > 0) {
      loadCompletedLessons();
    }
  }, [effectiveLessons.length, courseId]);

  const handleLearnClick = (event, lesson) => {
    event.preventDefault();

    if (!authToken) {
      toast.error("សូមចូលគណនីជាមុនសិន");
      navigate("/login", {
        state: { from: `/coursedetail/${courseId}/lesson/${lesson.id}` },
      });
      return;
    }

    const storedUser = (() => {
      try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    const user = reduxUser || storedUser || null;
    const userId = user?.id || user?.userId || "guest";

    try {
      const raw = localStorage.getItem(LEARN_STARTED_COURSES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];

      const nextEntry = {
        userId,
        courseId,
        courseTitle: lesson?.courseTitle || lesson?.courseName || "",
        startedAt: new Date().toISOString(),
        status: "IN_PROGRESS",
      };

      const nextList = [
        nextEntry,
        ...list.filter(
          (item) =>
            !(
              String(item?.userId || "guest") === String(userId) &&
              String(item?.courseId) === String(courseId)
            ),
        ),
      ];

      localStorage.setItem(LEARN_STARTED_COURSES_KEY, JSON.stringify(nextList));
      window.dispatchEvent(new Event("learnCourseStarted"));
    } catch {
      // ignore local persistence failure and still continue to lesson
    }

    navigate(`/coursedetail/${courseId}/lesson/${lesson.id}`, {
      state: {
        lessonTitle: lesson.title,
        sequenceNumber: lesson.sequenceNumber,
      },
    });
  };

  return (
    <div className="max-w-[1530px] mx-auto dark:bg-[#0e172a]  bg-white px-6 sm:px-10 md:px-14 py-8 sm:py-10 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#112d4f] font-bold text-center mb-8 sm:mb-10">
        មេរៀនសម្រាប់សិក្សា
      </h2>

      {fallbackLoading && !effectiveLessons.length && (
        <p className="text-center text-gray-500">កំពុងទាញមេរៀន...</p>
      )}

      {!fallbackLoading && !effectiveLessons.length && (
        <p className="text-center text-gray-500">មិនមានមេរៀនទេ</p>
      )}

      {fallbackError && !effectiveLessons.length && (
        <p className="text-center text-red-500 text-sm">{fallbackError}</p>
      )}

      {visibleLessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className="flex flex-col dark:bg-[#1c293f] sm:flex-row justify-between items-start sm:items-center bg-[#fafafa] rounded-xl px-4 py-5 sm:py-6 shadow-sm gap-4 sm:gap-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex text-xl sm:text-2xl items-center justify-center bg-gray-200 text-[#ffa405] font-bold rounded-full">
              {toKhmerNumber(index + 1)}
            </div>
            <span className="text-[#6c7180] text-lg sm:text-xl">
              {lesson.title}
            </span>
          </div>
          
          {authToken ? (
            <Link
              to={`/coursedetail/${courseId}/lesson/${lesson.id}`}
              onClick={(event) => handleLearnClick(event, lesson)}
              state={{
                lessonTitle: lesson.title,
                sequenceNumber: lesson.sequenceNumber ?? index + 1,
              }}
              className={`mt-3 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium shadow-md transition-all duration-200 hover:scale-105 ${
                completedLessonIds[String(lesson.id)]
                  ? "bg-[#ffa207] hover:bg-[#e88e07] text-white"
                  : "bg-[#3f71af] hover:bg-[#112d4f] text-white"
              }`}
            >
              ចូលរៀន
            </Link>
          ) : (
            <button
              onClick={() => {
                toast.error("សូមចូលគណនីជាមុនសិន");
                navigate("/login");
              }}
              className="mt-3 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium shadow-md transition-all duration-200 bg-gray-400 text-white cursor-not-allowed opacity-75 hover:opacity-90"
            >
              <Lock size={18} />
              ចូលរៀន
            </button>
          )}
        </div>
      ))}

      {effectiveLessons.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white text-[#3f71af] border border-[#3f71af] hover:bg-[#3f71af] hover:text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105"
          >
            {showAll ? "បង្ហាញតិចតួច" : "បង្ហាញច្រើន"}
          </button>
        </div>
      )}
    </div>
  );
}
