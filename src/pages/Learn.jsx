import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CourseProgress from "../components/navbar/course/CourseProgress";
import {
  IoBookOutline,
  IoCheckmarkCircle,
  IoEllipseOutline,
  IoFlameOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

const API_BASE = "https://jomnorncode-api.cheat.casa/api";

const WEEK_DAYS = ["ច", "អ", "ព", "ព្រ", "សុ", "ស", "អា"];
const LEARN_ACTIVITY_DAYS_KEY = "learn-activity-days";
const LEARN_ACTIVITY_LOG_KEY = "learn-activity-log";
const LEARN_STARTED_COURSES_KEY = "learn-started-courses";

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
  if (Array.isArray(payload?.result?.content)) return payload.result.content;
  if (Array.isArray(payload?.result?.lessons)) return payload.result.lessons;
  return [];
};

const getEnrollmentProgress = (enrollment) => {
  const value =
    enrollment?.progress ??
    enrollment?.progressPercent ??
    enrollment?.progressPercentage ??
    enrollment?.completionPercent ??
    enrollment?.completionPercentage ??
    0;

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const toYmd = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const shiftDays = (date, amount) => {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
};

const formatDisplayDate = (ymd) => {
  if (!ymd) return "";
  const d = new Date(`${ymd}T00:00:00`);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const loadActivityDays = () => {
  try {
    const raw = localStorage.getItem(LEARN_ACTIVITY_DAYS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean).map(String);
  } catch {
    return [];
  }
};

const saveActivityDay = (ymd) => {
  const existing = loadActivityDays();
  if (existing.includes(ymd)) return existing;
  const next = [...existing, ymd].sort();
  localStorage.setItem(LEARN_ACTIVITY_DAYS_KEY, JSON.stringify(next));
  return next;
};

const loadActivityLog = () => {
  try {
    const raw = localStorage.getItem(LEARN_ACTIVITY_LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const loadStartedCourses = () => {
  try {
    const raw = localStorage.getItem(LEARN_STARTED_COURSES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveActivityLogEntry = (ymd, entry) => {
  const log = loadActivityLog();
  const currentEntries = Array.isArray(log[ymd]) ? log[ymd] : [];

  const exists = currentEntries.some(
    (item) =>
      String(item?.courseId) === String(entry?.courseId) &&
      String(item?.lessonId) === String(entry?.lessonId) &&
      String(item?.type) === String(entry?.type),
  );

  if (exists) return log;

  const next = {
    ...log,
    [ymd]: [...currentEntries, entry],
  };

  localStorage.setItem(LEARN_ACTIVITY_LOG_KEY, JSON.stringify(next));
  return next;
};

const getLessonId = (lesson) => {
  const id =
    lesson?.lessonId ??
    lesson?.id ??
    lesson?.lesson_id ??
    lesson?.lessonDetailId ??
    lesson?.lessonDetail?.id;

  return id != null ? String(id) : null;
};

const getLessonTitle = (lesson, index) =>
  lesson?.lessonTitle ??
  lesson?.title ??
  lesson?.lesson_name ??
  `Lesson ${index + 1}`;

const isLessonCompleted = (lessonId) =>
  localStorage.getItem(`lesson-${lessonId}-lessonCompleted`) === "true";

const isQuizCompleted = (lessonId) =>
  localStorage.getItem(`lesson-${lessonId}-quizCompleted`) === "true";

export default function Learn() {
  const storedUser = useMemo(() => loadStoredUser(), []);
  const [userEnrollment, setUserEnrollment] = useState([]);
  const [startedCourses, setStartedCourses] = useState(() => loadStartedCourses());
  const [userId, setUserId] = useState(
    () => storedUser?.userId ?? storedUser?.id ?? 0,
  );
  const [coursesById, setCoursesById] = useState({});
  const [courseProgressById, setCourseProgressById] = useState({});
  const [courseLessonsById, setCourseLessonsById] = useState({});
  const [progressRefreshKey, setProgressRefreshKey] = useState(0);

  const [activityDays, setActivityDays] = useState(() => loadActivityDays());
  const [activityLog, setActivityLog] = useState(() => loadActivityLog());
  const [selectedDayYmd, setSelectedDayYmd] = useState(() => toYmd(new Date()));

  const syncedProgressRef = useRef({});
  const knownUserIds = useMemo(() => {
    return [
      userId,
      storedUser?.userId,
      storedUser?.id,
      localStorage.getItem("userId"),
    ]
      .filter(Boolean)
      .map(String);
  }, [storedUser, userId]);

  const mergedEnrollments = useMemo(() => {
    const map = new Map();

    userEnrollment.forEach((enrollment) => {
      const courseId =
        enrollment?.courseId ??
        enrollment?.course?.id ??
        enrollment?.course?.courseId;
      if (!courseId) return;
      map.set(String(courseId), enrollment);
    });

    startedCourses
      .filter((item) => {
        if (!knownUserIds.length) return true;
        return knownUserIds.includes(String(item?.userId || "guest"));
      })
      .forEach((item) => {
      const courseId =
        item?.courseId ?? item?.course?.id ?? item?.course?.courseId;
      if (!courseId || map.has(String(courseId))) return;

      map.set(String(courseId), {
        id: `local-${courseId}`,
        courseId,
        status: item?.status || "IN_PROGRESS",
        source: "local-started-course",
      });
      });

    return Array.from(map.values());
  }, [knownUserIds, userEnrollment, startedCourses]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "https://jomnorncode-api.cheat.casa/api/api/users/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setUserId(data?.userId ?? data?.id ?? data?.data?.userId ?? data?.data?.id ?? 0);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserEnrollment = async () => {
      try {
        const response = await fetch(
          `https://jomnorncode-api.cheat.casa/api/api/enrollments/user/${userId}?page=0&size=10&sortBy=createdAt&direction=desc`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user enrollment data");
        }

        const data = await response.json();
        setUserEnrollment(extractList(data));
      } catch (error) {
        console.error("Error fetching user enrollment data:", error);
      }
    };

    fetchUserEnrollment();
  }, [userId]);

  useEffect(() => {
    if (!mergedEnrollments.length) return;

    const fetchCourses = async () => {
      try {
        const uniqueCourseIds = [
          ...new Set(
            mergedEnrollments
              .map(
                (item) =>
                  item?.courseId ?? item?.course?.id ?? item?.course?.courseId,
              )
              .filter(Boolean),
          ),
        ];

        const courseResponses = await Promise.all(
          uniqueCourseIds.map(async (courseId) => {
            const response = await fetch(`${API_BASE}/courses/${courseId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch course ${courseId}`);
            }

            const data = await response.json();
            return { courseId, data };
          }),
        );

        const mappedCourses = courseResponses.reduce((acc, item) => {
          acc[item.courseId] = item.data;
          return acc;
        }, {});

        setCoursesById(mappedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [mergedEnrollments]);

  useEffect(() => {
    if (!mergedEnrollments.length) {
      setCourseLessonsById({});
      return;
    }

    const fetchAllCourseLessons = async () => {
      try {
        const uniqueCourseIds = [
          ...new Set(
            mergedEnrollments
              .map(
                (item) =>
                  item?.courseId ?? item?.course?.id ?? item?.course?.courseId,
              )
              .filter(Boolean),
          ),
        ];

        const results = await Promise.all(
          uniqueCourseIds.map(async (courseId) => {
            const endpoints = [
              `${API_BASE}/api/lessons/course/${courseId}/ordered`,
              `${API_BASE}/lessons/course/${courseId}/ordered`,
            ];

            for (const url of endpoints) {
              try {
                const response = await fetch(url, {
                  method: "GET",
                  headers: getAuthHeaders(),
                });

                if (!response.ok) continue;

                const payload = await response.json();
                const lessons = extractList(payload);

                if (lessons.length) {
                  return [courseId, lessons];
                }
              } catch {
                // try next endpoint
              }
            }

            return [courseId, []];
          }),
        );

        setCourseLessonsById(Object.fromEntries(results));
      } catch (error) {
        console.error("Error fetching course lessons:", error);
      }
    };

    fetchAllCourseLessons();
  }, [mergedEnrollments]);

  useEffect(() => {
    if (!mergedEnrollments.length) {
      setCourseProgressById({});
      return;
    }

    const uniqueCourseIds = [
      ...new Set(
        mergedEnrollments
          .map(
            (item) =>
              item?.courseId ?? item?.course?.id ?? item?.course?.courseId,
          )
          .filter(Boolean),
      ),
    ];

    const enrollmentByCourseId = mergedEnrollments.reduce((acc, enrollment) => {
      const courseId =
        enrollment?.courseId ??
        enrollment?.course?.id ??
        enrollment?.course?.courseId;

      if (courseId && !acc[courseId]) {
        acc[courseId] = enrollment;
      }

      return acc;
    }, {});

    const fetchLessonIds = async (courseId) => {
      const existingLessons = courseLessonsById?.[courseId];
      if (Array.isArray(existingLessons) && existingLessons.length) {
        return existingLessons.map((lesson) => getLessonId(lesson)).filter(Boolean);
      }

      const endpoints = [
        `${API_BASE}/api/lessons/course/${courseId}/ordered`,
        `${API_BASE}/lessons/course/${courseId}/ordered`,
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
          });

          if (!response.ok) continue;

          const payload = await response.json();
          const lessons = extractList(payload);
          const ids = lessons.map((lesson) => getLessonId(lesson)).filter(Boolean);

          if (ids.length) return ids;
        } catch {
          // try next endpoint
        }
      }

      return [];
    };

    const syncEnrollmentProgress = async (enrollmentId, progressPercent) => {
      if (!enrollmentId) return null;

      const previousSynced = syncedProgressRef.current[enrollmentId];
      if (previousSynced === progressPercent) return progressPercent;

      const endpoints = [
        `${API_BASE}/api/enrollments/${enrollmentId}/progress?progressPercentage=${encodeURIComponent(
          progressPercent,
        )}`,
        `${API_BASE}/enrollments/${enrollmentId}/progress?progressPercentage=${encodeURIComponent(
          progressPercent,
        )}`,
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: getAuthHeaders(),
          });

          if (!response.ok) continue;

          syncedProgressRef.current[enrollmentId] = progressPercent;
          return progressPercent;
        } catch {
          // try next endpoint
        }
      }

      return null;
    };

    const calculateProgress = async () => {
      try {
        const results = await Promise.all(
          uniqueCourseIds.map(async (courseId) => {
            const enrollment = enrollmentByCourseId[courseId];
            const enrollmentId =
              enrollment?.id ?? enrollment?.enrollmentId ?? null;
            const backendPercent = getEnrollmentProgress(enrollment);
            const lessonIds = await fetchLessonIds(courseId);

            const totalLessons = lessonIds.length;
            const completedLessons = lessonIds.filter((lessonId) =>
              isLessonCompleted(lessonId),
            ).length;

            const completedQuizzes = lessonIds.filter((lessonId) =>
              isQuizCompleted(lessonId),
            ).length;

            const totalUnits = totalLessons * 2;
            const localPercent =
              totalUnits > 0
                ? Math.round(
                    ((completedLessons + completedQuizzes) / totalUnits) * 100,
                  )
                : null;

            const progressPercent =
              localPercent == null
                ? backendPercent
                : Math.max(localPercent, backendPercent);

            const shouldSync =
              enrollmentId &&
              localPercent != null &&
              progressPercent > backendPercent;

            if (shouldSync) {
              await syncEnrollmentProgress(enrollmentId, progressPercent);
            }

            return {
              courseId,
              progress: {
                enrollmentId,
                progressPercent,
                backendPercent,
                completedLessons,
                completedQuizzes,
                totalLessons,
                totalQuizzes: totalLessons,
              },
            };
          }),
        );

        const mappedProgress = results.reduce((acc, item) => {
          acc[item.courseId] = item.progress;
          return acc;
        }, {});

        setCourseProgressById(mappedProgress);
      } catch (error) {
        console.error("Error calculating course progress:", error);
      }
    };

    calculateProgress();
  }, [mergedEnrollments, progressRefreshKey, courseLessonsById]);

  useEffect(() => {
    setActivityDays(loadActivityDays());
    setActivityLog(loadActivityLog());

    const refreshProgress = () => {
      setProgressRefreshKey((prev) => prev + 1);
    };

    const handleProgressUpdated = (event) => {
      refreshProgress();
      setStartedCourses(loadStartedCourses());

      const today = toYmd(new Date());
      setActivityDays(saveActivityDay(today));

      const detail = event?.detail || {};
      const {
        courseId,
        courseTitle,
        lessonId,
        lessonTitle,
        type = "lesson",
      } = detail;

      if (courseId && lessonId) {
        const updatedLog = saveActivityLogEntry(today, {
          courseId,
          courseTitle: courseTitle || "",
          lessonId,
          lessonTitle: lessonTitle || `Lesson ${lessonId}`,
          type,
        });

        setActivityLog(updatedLog);
      } else {
        setActivityLog(loadActivityLog());
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshProgress();
      }
    };

    const handleCourseStarted = () => {
      refreshProgress();
      setStartedCourses(loadStartedCourses());
    };

    const handleStorage = () => {
      refreshProgress();
      setStartedCourses(loadStartedCourses());
    };

    window.addEventListener("lessonProgressUpdated", handleProgressUpdated);
    window.addEventListener("learnCourseStarted", handleCourseStarted);
    window.addEventListener("focus", refreshProgress);
    window.addEventListener("pageshow", refreshProgress);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener(
        "lessonProgressUpdated",
        handleProgressUpdated,
      );
      window.removeEventListener("learnCourseStarted", handleCourseStarted);
      window.removeEventListener("focus", refreshProgress);
      window.removeEventListener("pageshow", refreshProgress);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const courseProgressList = useMemo(
    () => Object.values(courseProgressById || {}),
    [courseProgressById],
  );

  const totalTrackedLessons = courseProgressList.reduce(
    (sum, item) => sum + Number(item?.totalLessons || 0),
    0,
  );

  const completedLessons = courseProgressList.reduce(
    (sum, item) => sum + Number(item?.completedLessons || 0),
    0,
  );

  const completedQuizzes = courseProgressList.reduce(
    (sum, item) => sum + Number(item?.completedQuizzes || 0),
    0,
  );

  const totalUnits = totalTrackedLessons * 2;
  const completedUnits = completedLessons + completedQuizzes;

  const overallProgressPercent =
    totalUnits > 0
      ? Math.round((completedUnits / totalUnits) * 100)
      : courseProgressList.length > 0
        ? Math.round(
            courseProgressList.reduce(
              (sum, item) => sum + Number(item?.progressPercent || 0),
              0,
            ) / courseProgressList.length,
          )
        : 0;

  useEffect(() => {
    if (completedUnits <= 0) return;
    const today = toYmd(new Date());
    setActivityDays(saveActivityDay(today));
  }, [completedUnits]);

  const activitySet = new Set(activityDays);
  const today = new Date();

  const weekDaysFromMonday = Array.from({ length: 7 }, (_, i) => {
    const date = shiftDays(today, i - ((today.getDay() + 6) % 7));
    return {
      ymd: toYmd(date),
      date,
    };
  });

  const completedDays = weekDaysFromMonday.filter((d) =>
    activitySet.has(d.ymd),
  ).length;

  let streakDays = 0;
  for (let i = 0; i < 365; i += 1) {
    const day = toYmd(shiftDays(today, -i));
    if (!activitySet.has(day)) break;
    streakDays += 1;
  }

  const selectedDayActivities = useMemo(() => {
    return Array.isArray(activityLog?.[selectedDayYmd])
      ? activityLog[selectedDayYmd]
      : [];
  }, [activityLog, selectedDayYmd]);

 const learningPlanItems = useMemo(() => {
  const todayYmd = toYmd(new Date());
  const isViewingToday = selectedDayYmd === todayYmd;

  if (!isViewingToday) {
    return selectedDayActivities.map((item, index) => ({
      id: `${item.courseId}-${item.lessonId}-${item.type}-${index}`,
      title: `${item.courseTitle || "Course"} - ${item.lessonTitle || "Lesson"}`,
      time: "បានបញ្ចប់",
      duration: item.type === "quiz" ? "Quiz" : "Lesson",
      done: true,
      nextLessonLink: null,
    }));
  }

  const timeSlots = ["09:00", "11:00", "15:00", "17:00", "19:00"];

  return mergedEnrollments
    .map((enrollment, index) => {
      const courseId =
        enrollment?.courseId ??
        enrollment?.course?.id ??
        enrollment?.course?.courseId;

      if (!courseId) return null;

      const course = coursesById?.[courseId];
      const lessons = Array.isArray(courseLessonsById?.[courseId])
        ? courseLessonsById[courseId]
        : [];
      const progress = courseProgressById?.[courseId];

      if (!lessons.length) {
        return {
          id: `empty-${courseId}`,
          title: `${course?.courseTitle || course?.title || "Course"} - No lessons found`,
          time: timeSlots[index] || "10:00",
          duration: "មិនមានមេរៀន",
          done: false,
          nextLessonLink: null,
        };
      }

      const completedLessonCount = Math.max(
        0,
        Math.min(Number(progress?.completedLessons || 0), lessons.length),
      );

      if (completedLessonCount >= lessons.length) {
        return {
          id: `done-${courseId}`,
          title: course?.courseTitle || course?.title || "Completed Course",
          time: timeSlots[index] || "10:00",
          duration: "បានបញ្ចប់រួចរាល់",
          done: true,
          nextLessonLink: null,
        };
      }

      const nextLessonIndex = completedLessonCount;
      const nextLesson = lessons[nextLessonIndex];
      const nextLessonId = getLessonId(nextLesson);
      const nextLessonTitle = getLessonTitle(nextLesson, nextLessonIndex);

      if (!nextLessonId) return null;

      return {
        id: `${courseId}-${nextLessonId}`,
        title: `${course?.courseTitle || course?.title || "Course"} - ${nextLessonTitle}`,
        time: timeSlots[index] || "10:00",
        duration: "បន្តមេរៀនបន្ទាប់",
        done: false,
        nextLessonLink: `/coursedetail/${courseId}/lesson/${nextLessonId}`,
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}, [
  selectedDayYmd,
  selectedDayActivities,
  mergedEnrollments,
  coursesById,
  courseLessonsById,
  courseProgressById,
]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#091220] px-4 sm:px-6 md:px-10 lg:px-20  xl:px-32 py-8 sm:py-12">
      <div className="mb-10" data-aos="fade-up">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e293b]">
          មកធ្វើឲ្យថ្ងៃនេះមាន<span className="text-[#ffa500]">លទ្ធផល</span>
        </h1>
        <p className="text-gray-500 mt-3 sm:mt-5 text-sm sm:text-base">
          តាមដានការរៀនរបស់អ្នក និងគ្រប់គ្រងដំណើរការរបស់អ្នក
        </p>
      </div>

      <div
        className="bg-[#dfe6f4] dark:bg-[#1c293e]  rounded-xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-3 mb-8 sm:mb-10"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <p className="text-[#1e293b]​ dark:text-white  font-medium text-base sm:text-lg text-center md:text-left">
          ចាប់ផ្តេីមចូលរៀនឥឡូវនេះជាឱកាសល្អសម្រាប់អ្នក
        </p>
        <button className="bg-green-200 text-green-700  px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:bg-green-300 transition-all font-semibold w-full md:w-auto inline-block text-center">
          ចុះឈ្មោះ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div
          className="bg-white   rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#112d51]">
              ដំណើរការសិក្សា
            </h2>
            <span className="rounded-full bg-slate-100 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-500">
              សប្ដាហ៍នេះ
            </span>
          </div>

          <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#204c98] to-[#2d69cd] p-4 sm:p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/20">
                  <IoFlameOutline className="text-2xl sm:text-3xl" />
                </div>
                <div>
                  <p className="text-sm sm:text-lg font-medium">
                    Streak សប្ដាហ៍នេះ
                  </p>
                  <p className="text-2xl font-black leading-none mt-2">
                    {streakDays} ថ្ងៃ
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-blue-100">គោលដៅ</p>
                <p className="text-xl sm:text-2xl font-black leading-none mt-1">
                  7 ថ្ងៃ
                </p>
              </div>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              ចំនួនថ្ងៃបានរៀនសប្ដាហ៍នេះ
            </p>
            <span className="text-2xl sm:text-4xl font-black text-[#204c98]">
              {completedDays}/{WEEK_DAYS.length}
            </span>
          </div>

          <div className="mb-3 flex items-center justify-between gap-1 sm:gap-2">
            {WEEK_DAYS.map((day, index) => {
              const dayData = weekDaysFromMonday[index];
              const isActive = activitySet.has(dayData?.ymd);
              const isSelected = selectedDayYmd === dayData?.ymd;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDayYmd(dayData?.ymd)}
                  className={`relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full font-semibold text-sm sm:text-lg transition-all ${
                    isSelected ? "ring-2 sm:ring-4 ring-blue-200" : ""
                  } ${
                    isActive
                      ? "bg-[#234ea3] text-white shadow-md"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {day}
                  {isActive && (
                    <span className="absolute -bottom-3 h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="h-3 mt-5 w-full overflow-hidden rounded-full bg-slate-200​​ ">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3167c6] to-[#4a83df] transition-all duration-500"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-xl sm:text-2xl font-bold text-slate-600">
            {overallProgressPercent}% បានបញ្ចប់
          </p>

          <div className="mt-5 ">
            <p className="mb-1 text-sm text-slate-500">
              កាលបរិច្ឆេទ: {formatDisplayDate(selectedDayYmd)}
            </p>

            <h3 className="mb-4 mt-4 text-lg sm:text-xl font-bold text-[#112d51]">
              កម្មវិធីថ្ងៃនេះ:
            </h3>

            <div className="space-y-3 ">
              {learningPlanItems.length === 0 && (
                <div className="rounded-2xl border border-dashed  border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  {selectedDayYmd === toYmd(new Date())
                    ? "មិនទាន់មានវគ្គសិក្សាដើម្បីបង្ហាញ"
                    : "មិនមានសកម្មភាពនៅថ្ងៃនេះទេ"}
                </div>
              )}

              {learningPlanItems.map((item) =>
                item.nextLessonLink ? (
                  <Link
                    key={item.id}
                    to={item.nextLessonLink}
                    className={`block rounded-2xl p-4 transition hover:shadow-md ${
                      item.done
                        ? "bg-[#e8edf7] border border-[#cfd8ea]"
                        : "bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3 ">
                      <span className="mt-0.5">
                        {item.done ? (
                          <IoCheckmarkCircle className="text-3xl text-[#234ea3] " />
                        ) : (
                          <IoEllipseOutline className="text-3xl text-slate-500" />
                        )}
                      </span>
                      <div className="min-w-0 ">
                        <p
                          className={`truncate text-base sm:text-lg font-semibold ${
                            item.done
                              ? "line-through text-slate-500"
                              : "text-[#1b2235] dark:text-white"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-slate-500">
                          <span>{item.duration}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 ${
                      item.done
                        ? "bg-[#e8edf7] border border-[#cfd8ea]"
                        : "bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5">
                        {item.done ? (
                          <IoCheckmarkCircle className="text-3xl text-[#234ea3]" />
                        ) : (
                          <IoEllipseOutline className="text-3xl text-slate-500" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`truncate text-base sm:text-lg font-semibold ${
                            item.done
                              ? "line-through text-slate-500"
                              : "text-[#1b2235]"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-slate-500">
                          <span>{item.time}</span>
                          <span>•</span>
                          <IoTimeOutline />
                          <span>{item.duration}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 ">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6ecf8] text-[#234ea3] ">
                <IoBookOutline className="text-2xl" />
              </div>
              <div>
                <p className="text-xl font-black text-[#ffa405]">
                  {completedLessons}
                </p>
                <p className="text-slate-500">មេរៀន</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6ecf8] text-[#234ea3]">
                <IoTrendingUpOutline className="text-2xl" />
              </div>
              <div>
                <p className="text-xl font-black text-[#ffa405]">
                  {overallProgressPercent}%
                </p>
                <p className="text-slate-500">ភាពរីកចម្រើន</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 min-h-[400px] "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button className="bg-[#4476cd] text-[#ffffff] border hover:bg-[#3f72af] border-[#3f72af] px-6 py-2 rounded-lg font-medium">
              កំពុងដំណេីរការ
            </button>

            
          </div>

          <div className="mb-6 rounded-xl bg-slate-50 border  border-slate-200 px-4 py-3">
                <p className="text-sm text-slate-600">
                  វគ្គសិក្សាកំពុងដំណើរការ:{" "}
                  <span className="font-bold text-slate-800">
                    {mergedEnrollments.length}
                  </span>
                </p>
          </div>

          {mergedEnrollments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              មិនមានវគ្គសិក្សាកំពុងដំណើរការ
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
              {mergedEnrollments.map((enrollment) => {
                const resolvedCourseId =
                  enrollment?.courseId ??
                  enrollment?.course?.id ??
                  enrollment?.course?.courseId;

                const course = coursesById[resolvedCourseId];
                const progress = courseProgressById[resolvedCourseId];

                return (
                  <div key={enrollment?.id} className="min-h-full ">
                    {course ? (
                      <CourseProgress course={course} progress={progress} />
                    ) : (
                      <div className="h-full rounded-2xl border border-slate-200 bg-white p-5  text-sm text-slate-500 shadow-sm">
                        កំពុងដំណេីរការវគ្គសិក្សា...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
