import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DefinitionCard() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);

        // Fixed token
        const fixedToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb21ub3JuY29kZUBnbWFpbC5jb20iLCJpYXQiOjE3NzI3MDkwNDUsImV4cCI6MTc3Mjc5NTQ0NX0.M8NUcwZXxOP7ALbuncUUFq-RrqIjJjFaEKfnsH12300";

        const res = await fetch(
          `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${fixedToken}`,
            },
          }
        );

        const data = await res.json();

        const lessons = Array.isArray(data) ? data : data?.data || [];

        // find the lesson using sequenceNumber
        const currentLesson = lessons.find(
          (item) => Number(item.sequenceNumber) === Number(lessonId)
        );

        setLesson(currentLesson || null);
      } catch (error) {
        console.error(error);
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
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold mb-3 text-[#102d4f]">
        {lesson?.title || "មិនមានចំណងជើង"}
      </h3>

      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {lesson?.content || "គ្មានមាតិកាមេរៀន"}
      </p>
    </div>
  );
}