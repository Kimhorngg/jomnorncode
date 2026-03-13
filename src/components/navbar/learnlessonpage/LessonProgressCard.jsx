import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function LessonProgressCard() {
  const { courseId, lessonId } = useParams();
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const loadProgress = () => {
    setLessonCompleted(
      localStorage.getItem(`lesson-${lessonId}-lessonCompleted`) === "true",
    );
    setQuizCompleted(
      localStorage.getItem(`lesson-${lessonId}-quizCompleted`) === "true",
    );
  };

  useEffect(() => {
    loadProgress(); // load initial progress
    window.addEventListener("lessonProgressUpdated", loadProgress); // listen for editor updates
    return () =>
      window.removeEventListener("lessonProgressUpdated", loadProgress);
  }, [lessonId]);

  const canUnlockQuiz = lessonCompleted;

  return (
    <div className="flex-1">
      <div className="bg-white dark:bg-[#1c293f] p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#102d4f] dark:text-white">ដំណើរការមេរៀន</h3>

        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span
              className={lessonCompleted ? "text-green-500" : "text-gray-400"}
            >
              {lessonCompleted ? "✔" : "○"}
            </span>
            បញ្ចប់មេរៀននិងដំណេីរការកូដ
          </li>
          <li className="flex items-center gap-2">
            <span
              className={quizCompleted ? "text-green-500" : "text-gray-400"}
            >
              {quizCompleted ? "✔" : "○"}
            </span>
            ធ្វើតេស្ត
          </li>
        </ul>

        <Link
          to={`/coursedetail/${courseId}/lesson/${lessonId}/quiz`}
          className={`w-full py-3 rounded-lg text-center block font-medium transition
            ${
              canUnlockQuiz
                ? "border border-green-500 bg-green-50 text-green-600"
                : "border border-gray-300 bg-gray-100 text-gray-400 pointer-events-none"
            }`}
        >
          ធ្វើតេស្ត
        </Link>
      </div>
    </div>
  );
}
