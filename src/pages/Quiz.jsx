import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Quiz() {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // store user answers
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [fetchError, setFetchError] = useState(null);

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

        const formatted = (data?.content || [])
          .map((q) => {
            const baseChoices = (q.choices || []).filter(Boolean);
            const uniqueAnswers = Array.from(
              new Set([...baseChoices, q.correctAnswer].filter(Boolean)),
            );
            if (!uniqueAnswers.length) return null;
            return {
              question: q.question || "",
              correct: q.correctAnswer || "",
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
              <button
                onClick={() =>
                  navigate(
                    `/coursedetail/${courseId}/lesson/${parseInt(lessonId) + 1}`,
                  )
                }
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
              >
                ទៅមេរៀនបន្ទាប់
              </button>
            )}
          </div>
        </div>
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
          className="text-blue-900 font-medium hover:underline"
        >
          &lt; ត្រឡប់ទៅក្រោយ
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3">
          សំណួរ<span className="text-[#ffa500]">តេស្តមេរៀន</span>
        </h1>

        <p className="text-gray-500 text-center text-sm sm:text-base max-w-xl mb-6">
          សាកល្បងការយល់ដឹងរបស់អ្នក។ ត្រូវបានយ៉ាងហោចណាស់ 90% ដើម្បីជាប់។
        </p>

        {/* Progress */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow px-15 py-8 mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#102e50]">
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
        <div className="bg-white w-full max-w-2xl rounded-xl shadow p-15">
          <h2
            className="text-lg text-[#102e50] sm:text-xl font-semibold mb-6"
            dangerouslySetInnerHTML={{ __html: current.question }}
          />

          <div className="space-y-4">
            {current.answers.map((answer, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(answer)}
                dangerouslySetInnerHTML={{ __html: answer }}
                className={`w-full border border-[#d9d9d9] text-[#6c7080] rounded-lg py-3 transition
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
