import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import {
  IoBookOutline,
  IoPeopleOutline,
  IoTimeOutline as IoClock,
} from "react-icons/io5";

const formatNumber = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString();
};

export default function CourseProgress({ course, progress }) {
  const resolvedCourseId = course?.courseId ?? course?.id;
  if (!resolvedCourseId) return null;
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(Number(progress?.progressPercent ?? 0))),
  );
  const totalLessons = Number(progress?.totalLessons ?? 0);
  const completedLessons = Number(progress?.completedLessons ?? 0);
  const completedQuizzes = Number(progress?.completedQuizzes ?? 0);

  return (
    <Link
      to={`/coursedetail/${resolvedCourseId}`}
      className="group h-full bg-white dark:bg-[#1c293e] rounded-2xl overflow-hidden shadow-sm flex flex-col border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4477ce] focus-visible:ring-offset-2"
    >
      <div className="relative h-48 bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <img
          src={
            course?.thumbnailUrl || course?.image || "/default-course-image.jpg"
          }
          alt={course?.courseTitle || "Course thumbnail"}
          className="h-full w-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/default-course-image.jpg";
          }}
        />

        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <AiFillStar className="text-yellow-400" />
          <span className="text-xs font-bold text-gray-700">
            {(course?.rating?.rate || 4.5).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-lg font-extrabold text-[#112d51] line-clamp-2 min-h-[3.5rem]">
          {course?.courseTitle || "គ្មានចំណងជើង"}
        </h2>

        <p className="text-slate-500 text-sm mb-10 line-clamp-2 min-h-[2.5rem]">
          {course?.description || "គ្មានការពិពណ៌នា"}
        </p>

        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>ភាគរយដែលសម្រេច</span>
            <span className="text-[#2f67c8]">{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3f72af] to-[#5b93da] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {totalLessons > 0 && (
            <p className="mt-2 text-[11px] text-slate-500">
              មេរៀន {completedLessons}/{totalLessons} • Quiz {completedQuizzes}/
              {totalLessons}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-1.5">
            <IoBookOutline className="text-orange-400 text-lg" />
            <span>{course?.lessonCount || 10} មេរៀន</span>
          </div>

          <div className="flex items-center gap-1.5">
            <IoClock className="text-orange-400 text-lg" />
            <span>{course?.duration || 15} ម៉ោង</span>
          </div>

          <div className="flex items-center gap-1.5">
            <IoPeopleOutline className="text-orange-400 text-lg" />
            <span>{formatNumber(course?.students || 5000)} នាក់</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
