import { useNavigate } from "react-router-dom";

export default function NextLessonButton() {
  const navigate = useNavigate();
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 mb-6 justify-end flex">
      <button
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition"
        onClick={() => navigate("/next-lesson")}
      >
        Next Lesson →
      </button>
    </div>
  );
}