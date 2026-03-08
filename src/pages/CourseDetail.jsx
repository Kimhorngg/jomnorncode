import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import HeroSectionCourseDetail from "../components/navbar/course-details/HeroSectionCourseDetail";
import WhatYouWillLearn from "../components/navbar/course-details/WhatYouWillLearn";
import CourseCurriculum from "../components/navbar/course-details/CourseCurriculum";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    const buildHeaders = () => {
      return {
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      };
    };

    const requestJson = async (url) => {
      const headers = buildHeaders();
      let response = await fetch(url, { headers });
      if ((response.status === 401 || response.status === 403) && authToken) {
        response = await fetch(url, {
          headers: { Accept: "application/json" },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    };

    const extractList = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.data?.data)) return payload.data.data;
      if (Array.isArray(payload?.data?.items)) return payload.data.items;
      if (Array.isArray(payload?.data?.content)) return payload.data.content;
      if (Array.isArray(payload?.data?.lessons)) return payload.data.lessons;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.courses)) return payload.courses;
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

    const resolveCourseId = (course) =>
      course?.courseId ??
      course?.id ??
      course?.course_id ??
      course?.courseID ??
      course?.uuid;

    const resolveCourseTitle = (course) =>
      course?.courseTitle ??
      course?.title ??
      course?.course_name ??
      course?.courseName ??
      course?.name;

    const normalizeLessons = (rawLessons) =>
      rawLessons
        .map((lesson, index) => {
          const lessonId =
            lesson.lessonId ?? lesson.id ?? lesson.lesson_id ?? index + 1;
          const lessonTitle =
            lesson.lessonTitle ??
            lesson.title ??
            lesson.lesson_name ??
            lesson.name ??
            `Lesson ${index + 1}`;
          const contents = Array.isArray(lesson.contents)
            ? lesson.contents
            : Array.isArray(lesson.content)
              ? lesson.content
              : [];

          return {
            id: lessonId,
            sequenceNumber:
              lesson.sequenceNumber ??
              lesson.sequence ??
              lesson.order ??
              index + 1,
            title: lessonTitle,
            duration: lesson.duration ?? lesson.lessonDuration ?? "",
            contents: contents.map((topic, topicIndex) => ({
              title:
                topic.title ??
                topic.contentTitle ??
                topic.name ??
                `Topic ${topicIndex + 1}`,
              duration: topic.duration ?? topic.time ?? "",
            })),
          };
        })
        .filter((lesson) => lesson.id != null);

    const buildFallbackLessons = (courseMeta, fallbackCount = 0) => {
      const metaLessons =
        (Array.isArray(courseMeta?.lessons) && courseMeta.lessons) ||
        (Array.isArray(courseMeta?.courseLessons) &&
          courseMeta.courseLessons) ||
        (Array.isArray(courseMeta?.orderedLessons) &&
          courseMeta.orderedLessons) ||
        (Array.isArray(courseMeta?.lessonList) && courseMeta.lessonList) ||
        (Array.isArray(courseMeta?.curriculum) && courseMeta.curriculum) ||
        (Array.isArray(courseMeta?.chapters) && courseMeta.chapters) ||
        (Array.isArray(courseMeta?.sections) && courseMeta.sections) ||
        [];

      const normalizedMetaLessons = normalizeLessons(metaLessons);
      if (normalizedMetaLessons.length) return normalizedMetaLessons;
      return [];
    };

    const fetchOrderedLessons = async () => {
      if (!authToken) return [];

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
      ];

      for (const url of endpoints) {
        try {
          const payload = await requestJson(url);
          const list = extractList(payload);
          if (list.length) return list;
        } catch {
          // try next endpoint
        }
      }

      return [];
    };

    const fetchCourseMetaById = async () => {
      const courseListEndpoints = authToken
        ? [
            "https://jomnorncode-api.cheat.casa/api/courses",
            "https://jomnorncode-api.cheat.casa/api/courses/public?all=true&page=0&size=200",
          ]
        : [
            "https://jomnorncode-api.cheat.casa/api/courses/public?all=true&page=0&size=200",
          ];

      for (const url of courseListEndpoints) {
        try {
          const payload = await requestJson(url);
          const allCourses = extractList(payload);
          const matched = allCourses.find(
            (course) => String(resolveCourseId(course)) === String(courseId),
          );
          if (matched) return matched;

          // Some APIs return a single course object instead of array list.
          if (
            payload &&
            !Array.isArray(payload) &&
            String(resolveCourseId(payload)) === String(courseId)
          ) {
            return payload;
          }
          if (
            payload?.data &&
            !Array.isArray(payload.data) &&
            String(resolveCourseId(payload.data)) === String(courseId)
          ) {
            return payload.data;
          }
        } catch {
          // try next endpoint
        }
      }

      return null;
    };

    const fetchCourseData = async () => {
      try {
        const [rawLessons, courseMeta] = await Promise.all([
          fetchOrderedLessons(),
          fetchCourseMetaById(),
        ]);

        const lessonsFromApi = normalizeLessons(rawLessons);
        const firstRawLesson = rawLessons?.[0] || {};

        const courseTitle =
          resolveCourseTitle(courseMeta) ||
          firstRawLesson.courseTitle ||
          firstRawLesson.courseName ||
          firstRawLesson.course?.courseTitle ||
          firstRawLesson.course?.title ||
          firstRawLesson.course?.courseName ||
          firstRawLesson.course_name ||
          firstRawLesson.name ||
          `វគ្គសិក្សា ${courseId}`;
        const courseDescription =
          courseMeta?.description ||
          firstRawLesson.courseDescription ||
          firstRawLesson.description ||
          firstRawLesson.course?.description ||
          "Description not available";
        const courseImage =
          courseMeta?.thumbnailUrl ||
          courseMeta?.image ||
          firstRawLesson.course?.thumbnailUrl ||
          firstRawLesson.course?.image ||
          "/default-course-image.jpg";
        const lessons =
          lessonsFromApi.length > 0
            ? lessonsFromApi
            : buildFallbackLessons(courseMeta, rawLessons?.length || 0);

        setCourseData({
          title: courseTitle,
          description: courseDescription,
          image: courseImage,
          lessons,
        });
      } catch (err) {
        console.error("Course detail fetch error:", err);
        setError("មិនអាចទាញទិន្នន័យវគ្គសិក្សាបាន");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, reduxToken]);

  if (loading)
    return (
      <div className="bg-[#fafafa] text-center py-20 font-bold text-2xl text-[#112d4f]">
        កំពុងផ្ទុក...
      </div>
    );

  if (error)
    return (
      <div className="bg-[#fafafa] text-center py-20 font-bold text-2xl text-red-600">
        {error}
      </div>
    );

  const hasAuthToken =
    Boolean(reduxToken) ||
    Boolean(localStorage.getItem("token")) ||
    Boolean(localStorage.getItem("accessToken")) ||
    Boolean(localStorage.getItem("authToken"));

  const handleStartLearning = () => {
    const firstLessonId = courseData?.lessons?.[0]?.id;

    if (!hasAuthToken) {
      toast.error("សូមចូលគណនីជាមុនសិន");
      navigate("/login", {
        state: {
          from: firstLessonId
            ? `/coursedetail/${courseId}/lesson/${firstLessonId}`
            : `/coursedetail/${courseId}`,
        },
      });
      return;
    }

    if (!firstLessonId) {
      toast.error("មិនមានមេរៀនសម្រាប់វគ្គសិក្សានេះទេ");
      return;
    }

    navigate(`/coursedetail/${courseId}/lesson/${firstLessonId}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      <div data-aos="fade-up">
        <HeroSectionCourseDetail
          title={courseData?.title}
          description={courseData?.description}
          image={courseData?.image}
          onStartLearning={handleStartLearning}
        />
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <WhatYouWillLearn
          title={courseData?.title}
          description={courseData?.description}
        />
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <CourseCurriculum courseId={courseId} lessons={courseData?.lessons} />
      </div>
    </div>
  );
}
