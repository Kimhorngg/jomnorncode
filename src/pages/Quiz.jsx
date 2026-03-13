import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const API_BASE = "https://jomnorncode-api.cheat.casa/api";

export default function Quiz() {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const authUser = useSelector((state) => state?.auth?.user);
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // store user answers
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState(null);
  const [enrollError, setEnrollError] = useState(null);
  const [nextLessonPath, setNextLessonPath] = useState(null);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

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

  const resolveUserId = (user) =>
    user?.userId || user?.id || user?._id || user?.uid || user?.uuid || null;

  const extractUser = (payload) => {
    if (!payload) return null;
    if (payload?.data) return payload.data;
    if (payload?.user) return payload.user;
    return payload;
  };

  const parseEnrollments = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.content)) return payload.data.content;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.result)) return payload.result;
    return [];
  };

  const isEnrollmentComplete = (enrollment) => {
    const status = String(enrollment?.status || "").toLowerCase();
    const progress =
      enrollment?.progress ??
      enrollment?.progressPercent ??
      enrollment?.progressPercentage ??
      0;
    return (
      enrollment?.completed === true ||
      enrollment?.isCompleted === true ||
      status === "completed" ||
      Number(progress) >= 100
    );
  };

  const loadCourseLessons = async (headers) => {
    const endpoints = [
      `${API_BASE}/api/lessons/course/${courseId}/ordered`,
      `${API_BASE}/lessons/course/${courseId}/ordered`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) continue;
        const data = await res.json();
        const list =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.content) && data.content) ||
          (Array.isArray(data?.items) && data.items) ||
          [];

        const normalizedLessons = list
          .map((lesson, index) => ({
            id: lesson?.lessonId ?? lesson?.id ?? lesson?.lesson_id ?? null,
            title:
              lesson?.lessonTitle ??
              lesson?.title ??
              lesson?.lesson_name ??
              `Lesson ${index + 1}`,
          }))
          .filter((lesson) => lesson.id != null);

        if (normalizedLessons.length) return normalizedLessons;
      } catch {
        // try next endpoint
      }
    }

    return [];
  };

  const loadCourseLessonIds = async (headers) => {
    const lessons = await loadCourseLessons(headers);
    return lessons.map((lesson) => lesson.id).filter(Boolean);
  };

  const handleCertificateClick = async () => {
    if (!authToken) {
      toast.error("សូមចូលគណនីជាមុនសិន");
      navigate("/login");
      return;
    }

    const headers = {
      Accept: "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };

    const lessonIds = await loadCourseLessonIds(headers);
    if (!lessonIds.length) {
      toast.error("មិនអាចពិនិត្យមេរៀនបាន");
      return;
    }

    const lessonsDone = lessonIds.every(
      (id) => localStorage.getItem(`lesson-${id}-lessonCompleted`) === "true",
    );
    const quizzesDone = lessonIds.every(
      (id) => localStorage.getItem(`lesson-${id}-quizCompleted`) === "true",
    );

    if (!lessonsDone || !quizzesDone) {
      toast.error("សូមបញ្ចប់មេរៀនទាំងអស់ជាមុនសិន");
      return;
    }

    let userId = resolveUserId(authUser);
    if (!userId) {
      try {
        const meEndpoints = [`${API_BASE}/api/users/me`, `${API_BASE}/users/me`];

        for (const url of meEndpoints) {
          const meRes = await fetch(url, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (meRes.ok) {
            const mePayload = extractUser(await meRes.json());
            userId = resolveUserId(mePayload);
            if (userId) break;
          }
        }
      } catch {
        // ignore and fall through
      }
    }

    if (!userId) {
      toast.error("សូមចូលគណនីជាមុនសិន");
      navigate("/login");
      return;
    }

    try {
      const enrollmentEndpoints = [
        `${API_BASE}/api/enrollments/user/${userId}?page=0&size=10&sortBy=createdAt&direction=desc`,
        `${API_BASE}/enrollments/user/${userId}?page=0&size=10&sortBy=createdAt&direction=desc`,
        `${API_BASE}/api/enrollments/user/${userId}`,
        `${API_BASE}/enrollments/user/${userId}`,
      ];

      let payload = null;
      let matchedResponse = false;

      for (const url of enrollmentEndpoints) {
        const response = await fetch(url, { headers });
        if (!response.ok) continue;
        payload = await response.json();
        matchedResponse = true;
        break;
      }

      if (!matchedResponse) {
        setEnrollStatus("error");
        setEnrollError("មិនអាចពិនិត្យការចុះឈ្មោះបាន");
        setEnrollModalOpen(true);
        return;
      }

      const enrollments = parseEnrollments(payload);
      const matched = enrollments.find((enrollment) => {
        const enrolledCourseId =
          enrollment?.courseId ||
          enrollment?.course?.courseId ||
          enrollment?.course?.id ||
          enrollment?.course_id;
        const enrolledUserId =
          enrollment?.userId || enrollment?.user?.id || enrollment?.student?.id;
        if (String(enrolledUserId) !== String(userId)) return false;
        return String(enrolledCourseId) === String(courseId);
      });

      if (!matched) {
        setEnrollStatus("not-enrolled");
        setEnrollError(null);
        setEnrollModalOpen(true);
        return;
      }

      if (!isEnrollmentComplete(matched)) {
        setEnrollStatus("incomplete");
        setEnrollError(null);
        setEnrollModalOpen(true);
        return;
      }

      setEnrollStatus("ready");
      setEnrollError(null);
      setEnrollModalOpen(true);
    } catch {
      setEnrollStatus("error");
      setEnrollError("មិនអាចពិនិត្យការចុះឈ្មោះបាន");
      setEnrollModalOpen(true);
    }
  };

  const handleCompleteEnrollment = () => {
    setEnrollModalOpen(false);
    navigate(`/enrollment/${courseId}`);
  };

  const handleOpenCertificate = () => {
    setEnrollModalOpen(false);
    navigate(`/certificate/${courseId}`);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setFetchError(null);
      setLoading(true);

      const token = authToken;
      if (!token) {
        setFetchError("សូមចូលគណនីជាមុនសិន");
        setLoading(false);
        return;
      }

      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const orderedLessons = await loadCourseLessons(headers);
      const currentLessonIndex = orderedLessons.findIndex(
        (lesson) => String(lesson.id) === String(lessonId),
      );
      const nextLesson = currentLessonIndex >= 0
        ? orderedLessons[currentLessonIndex + 1] ?? null
        : null;

      setNextLessonPath(
        nextLesson
          ? `/coursedetail/${courseId}/lesson/${nextLesson.id}`
          : null,
      );

      // fetch("https://opentdb.com/api.php?amount=5&type=multiple")

      try {
        const quizRes = await fetch(
          `https://jomnorncode-api.cheat.casa/api/api/quizzes/lesson/${lessonId}`,
          { headers },
        );
        if (!quizRes.ok) throw new Error(`HTTP ${quizRes.status}`);
        const quizData = await quizRes.json();

        const quizId = quizData?.content?.[0]?.id;
        if (!quizId) {
          setFetchError("មិនមានតេស្តសម្រាប់មេរៀននេះទេ");
          setLoading(false);
          return;
        }

        const questionsRes = await fetch(
          `https://jomnorncode-api.cheat.casa/api/api/questions/quiz/${quizId}?page=0&size=10`,
          { headers },
        );
        if (!questionsRes.ok) throw new Error(`HTTP ${questionsRes.status}`);
        const data = await questionsRes.json();

        const cleanAnswer = (value) =>
          String(value || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/gi, " ")
            .trim();

        const formatted = (data?.content || [])
          .map((q) => {
            const baseChoices = (q.choices || [])
              .filter((choice) => cleanAnswer(choice))
              .map((choice) => String(choice));
            const correctAnswer = cleanAnswer(q.correctAnswer)
              ? String(q.correctAnswer)
              : "";
            const uniqueAnswers = Array.from(
              new Set([...baseChoices, correctAnswer].filter(Boolean)),
            );
            if (!uniqueAnswers.length) return null;
            return {
              question: q.question || "",
              correct: correctAnswer,
              answers: shuffle([...uniqueAnswers]),
            };
          })
          .filter(Boolean);

        if (!formatted.length) {
          setFetchError("មិនមានសំណួរទេ");
          setLoading(false);
          return;
        }

        setQuestions(formatted);
        setLoading(false);
      } catch (error) {
        setFetchError("មិនអាចទាញសំណួរបាន");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);

    setSelectedAnswer(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  if (loading) return <div className="text-center mt-20">កំពុងដំណើរការ...</div>;

  if (fetchError) {
    return <div className="text-center mt-20 text-red-600">{fetchError}</div>;
  }

  if (!questions.length) {
    return <div className="text-center mt-20 text-gray-500">មិនមានសំណួរទេ</div>;
  }

  // ================= RESULTS =================
  if (showResult) {
    let score = 0;
    const mistakes = [];

    questions.forEach((q, i) => {
      if (answers[i] === q.correct) {
        score++;
      } else {
        mistakes.push({
          question: q.question,
          correct: q.correct,
          user: answers[i],
        });
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 90;

    if (passed) {
      localStorage.setItem(`lesson-${lessonId}-quizCompleted`, "true");
      window.dispatchEvent(new Event("lessonProgressUpdated"));
    }

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            លទ្ធផលតេស្ត 🎉
          </h2>

          <p className="text-lg text-center mb-4">
            ពិន្ទុរបស់អ្នក: <b>{percentage}%</b>
          </p>

          {passed ? (
            <p className="text-green-600 text-center mb-6 font-medium">
              អ្នកបានជាប់! ✅
            </p>
          ) : (
            <p className="text-red-600 text-center mb-6 font-medium">
              អ្នកមិនទាន់ជាប់ 😥 ត្រូវបានយ៉ាងហោចណាស់ 90%
            </p>
          )}

          {/* Mistakes */}
          {mistakes.length > 0 && (
            <div className="space-y-6 mb-8">
              <h3 className="font-semibold text-lg">សំណួរដែលអ្នកខុស:</h3>

              {mistakes.map((m, i) => (
                <div key={i} className="border p-4 rounded-lg bg-gray-50">
                  <p
                    className="font-medium mb-2"
                    dangerouslySetInnerHTML={{ __html: m.question }}
                  />

                  <p className="text-red-500">
                    ចម្លើយអ្នក:{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: m.user || "មិនបានជ្រើស",
                      }}
                    />
                  </p>

                  <p className="text-green-600">
                    ចម្លើយត្រឹមត្រូវ:{" "}
                    <span dangerouslySetInnerHTML={{ __html: m.correct }} />
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!passed && (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                ធ្វើតេស្តម្តងទៀត
              </button>
            )}

            {passed && (
              <>
                <button
                  onClick={() =>
                    navigate(nextLessonPath || `/coursedetail/${courseId}`)
                  }
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                  {nextLessonPath ? "ទៅមេរៀនបន្ទាប់" : "ត្រឡប់ទៅវគ្គសិក្សា"}
                </button>
                <button
                  onClick={handleCertificateClick}
                  className="bg-[#1f3a5f] text-white px-6 py-3 rounded-lg hover:bg-[#162a44]"
                >
                  ទទួលវិញ្ញាបនបត្រ
                </button>
              </>
            )}
          </div>
        </div>
        {enrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setEnrollModalOpen(false)}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[#1f3a5f] dark:text-white">
                ចង់ទទួលវិញ្ញាបនបត្រមែនទេ?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
                {enrollStatus === "ready" &&
                  "អ្នកបានបញ្ចប់វគ្គសិក្សារួចរាល់ហើយ។ អ្នកអាចបន្តទៅកាន់វិញ្ញាបនបត្ររបស់អ្នកបាន។"}
                {enrollStatus === "error" &&
                  "មិនអាចពិនិត្យការចុះឈ្មោះបាន។ សូមសាកល្បងម្ដងទៀត"}
                {enrollStatus === "not-enrolled" &&
                  "បើអ្នកចង់ទទួលវិញ្ញាបនបត្រ អ្នកត្រូវបំពេញការចុះឈ្មោះជាមុនសិន។ ចុចខាងក្រោមដើម្បីទៅកាន់ទំព័រ Enrollment។"}
                {enrollStatus === "incomplete" &&
                  "បើអ្នកចង់ទទួលវិញ្ញាបនបត្រ អ្នកត្រូវបំពេញ Enrollment ជាមុនសិន។ ចុចខាងក្រោមដើម្បីបន្ត។"}
              </p>
              {enrollError && (
                <p className="mt-2 text-sm text-red-600">{enrollError}</p>
              )}
              <div className="mt-5 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-white text-slate-600 dark:text-white"
                >
                  បិទ
                </button>
                {enrollStatus === "ready" && (
                  <button
                    onClick={handleOpenCertificate}
                    className="px-4 py-2 text-sm rounded-lg bg-[#1f3a5f] text-white"
                  >
                    ទៅកាន់វិញ្ញាបនបត្រ
                  </button>
                )}
                {(enrollStatus === "not-enrolled" ||
                  enrollStatus === "incomplete") && (
                  <button
                    onClick={handleCompleteEnrollment}
                    className="px-4 py-2 text-sm rounded-lg bg-[#1f3a5f] text-white disabled:opacity-50"
                  >
                    ទៅកាន់ Enrollment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= QUIZ =================

  const current = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between px-4 sm:px-8 lg:px-50 py-6">
      <div>
        <Link
          to={`/coursedetail/${courseId}/lesson/${lessonId}`}
          className="text-blue-900 font-medium hover:underline dark:text-white"
        >
          &lt; ត្រឡប់ទៅក្រោយ
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl sm:text-3xl​​​ text-[#112d51] lg:text-4xl font-bold text-center mb-3">
          សំណួរ<span className="text-[#ffa500]">តេស្តមេរៀន</span>
        </h1>

        <p className="text-gray-500 text-center text-sm sm:text-base max-w-xl mb-6">
          សាកល្បងការយល់ដឹងរបស់អ្នក។ ត្រូវបានយ៉ាងហោចណាស់ 90% ដើម្បីជាប់។
        </p>

        {/* Progress */}
        <div className="bg-white dark:bg-[#1c293f] w-full max-w-2xl rounded-xl shadow px-15 py-8 mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#102e50] dark:text-white">
              សំណួរ {currentIndex + 1} ចំនួន {questions.length}
            </span>
            <span className="text-[#ffa500]">{progress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow p-15 dark:bg-[#1c293f]">
          <h2
            className="text-lg dark:text-white text-[#102e50] sm:text-xl font-semibold mb-6"
            dangerouslySetInnerHTML={{ __html: current.question }}
          />

          <div className="space-y-4">
            {current.answers.map((answer, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(answer)}
                dangerouslySetInnerHTML={{ __html: answer }}
                className={`w-full border border-[#d9d9d9] dark:text-white dark:focus:text-[#6c7080] hover:text-[#6c7080] text-[#6c7080] rounded-lg py-3 transition
                  ${
                    selectedAnswer === answer
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          className="bg-white shadow-md rounded-lg px-6 py-3 font-medium hover:bg-gray-50"
        >
          &lt; មុននេះ
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="bg-blue-400 text-white shadow-md rounded-lg px-8 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          បន្តទៅមុខ
        </button>
      </div>
    </div>
  );
}
