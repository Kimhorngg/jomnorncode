import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeroSectionCourseDetail from "../components/navbar/course-details/HeroSectionCourseDetail";
import WhatYouWillLearn from "../components/navbar/course-details/WhatYouWillLearn";
import CourseCurriculum from "../components/navbar/course-details/CourseCurriculum";

export default function CourseDetail() {
  const { courseId } = useParams(); // courseId from URL
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
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

    const buildHeaders = () => {
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb21ub3JuY29kZUBnbWFpbC5jb20iLCJpYXQiOjE3NzI3MjUwMjAsImV4cCI6MTc3MjgxMTQyMH0.6ZMD2SUNzgEKtCxzkicsKIfoH9uuwDRfO3c-bvRLQ14";
      return {
        Accept: "application/json",
        "Content-Type": "application/json",
        // ...(token ? { Authorization:`Bearer ${token}` } : {}),
        "Authorization": `Bearer ${token}`,
      };
    };

    const extractList = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.courses)) return payload.courses;
      return [];
    };

    const extractLessons = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.lessons)) return payload.lessons;
      return [];
    };

    const normalizeLessons = (rawLessons) =>
      rawLessons
        .map((lesson, index) => {
          const lessonId =
            lesson.lessonId ?? lesson.id ?? lesson.lesson_id ?? index + 1;
          const lessonTitle =
            lesson.lessonTitle ??
            lesson.title ??
            lesson.lesson_name ??
            `Lesson ${index + 1}`;
          const contents = Array.isArray(lesson.contents)
            ? lesson.contents
            : Array.isArray(lesson.content)
              ? lesson.content
              : [];

          return {
            id: lessonId,
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

    const fetchOrderedLessons = async () => {
      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/lesson/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/lesson/course/${courseId}/ordered/`,
        `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
      ];

      let lastError = null;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            headers: buildHeaders()
          });

          if (!response.ok) {
            let errorDetails = "";
            try {
              errorDetails = await response.text();
            } catch {
              errorDetails = "";
            }
            lastError = new Error(
              `Request failed (${response.status}) at ${url}${errorDetails ? `: ${errorDetails}` : ""}`,
            );
            continue;
          }

          const payload = await response.json();
          return extractLessons(payload);
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError || new Error("Failed to fetch ordered lessons");
    };

    const fetchCourseMetaById = async () => {
      const response = await fetch(
        "https://jomnorncode-api.cheat.casa/api/courses",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb21ub3JuY29kZUBnbWFpbC5jb20iLCJpYXQiOjE3NzI2NzkyNTksImV4cCI6MTc3Mjc2NTY1OX0.FfH-W2rBJhVOoIXezbkJAa7rZew3J9TO2Xch8_pzAfI`,
          },
        },
      );

      if (!response.ok) return null;
      const payload = await response.json();
      const allCourses = extractList(payload);

      return (
        allCourses.find(
          (course) => String(course.courseId ?? course.id) === String(courseId),
        ) || null
      );
    };

    const fetchCourseData = async () => {
      try {
        const [rawLessons, courseMeta] = await Promise.all([
          fetchOrderedLessons(),
          fetchCourseMetaById().catch(() => null),
        ]);
        const lessons = normalizeLessons(rawLessons);

        const firstRawLesson = rawLessons?.[0] || {};
        const courseTitle =
          courseMeta?.courseTitle ||
          courseMeta?.title ||
          firstRawLesson.courseTitle ||
          firstRawLesson.courseName ||
          firstRawLesson.course?.title ||
          `មេរៀនទី ${courseId}`;
        const courseDescription =
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

        setCourseData({
          title: courseTitle,
          description: courseDescription,
          image: courseImage,
          lessons,
        });

        setLoading(false);
      } catch (err) {
        console.error("Course detail fetch error:", err);
        setError(err.message || "មានបញ្ហាក្នុងការទាញទិន្នន័យ");
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

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

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      <HeroSectionCourseDetail
        title={courseData.title}
        description={courseData.description}
        image={courseData.image}
      />

      <WhatYouWillLearn
        title={courseData.title}
        description={courseData.description}
      />

      <CourseCurriculum courseId={courseId} lessons={courseData.lessons} />
    </div>
  );
}
