import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Maximize2, Minimize2 } from "lucide-react";

import CodeData from "./code-monoco.json";
import {
  isLessonCompletedForUser,
  isQuizCompletedForUser,
  setLessonCompletedForUser,
} from "../../../utils/lessonProgress";

const LANGUAGE_ALIASES = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  py: "python",
  python: "python",
  java: "java",
  php: "php",
  sql: "sql",
  csharp: "csharp",
  "c#": "csharp",
  cs: "csharp",
  cpp: "cpp",
  "c++": "cpp",
  html: "html",
};

const normalizeLanguage = (value) => {
  const normalized = String(value || "")
    .toLowerCase()
    .trim();
  return LANGUAGE_ALIASES[normalized] || normalized || "plaintext";
};

const toRunnerLanguage = (language) => {
  switch (language) {
    case "cpp":
      return "c++";
    case "csharp":
      return "csharp";
    case "python":
      return "python";
    case "java":
      return "java";
    case "php":
      return "php";
    case "sql":
      return "sqlite3";
    default:
      return language;
  }
};

const JUDGE0_LANGUAGE_IDS = {
  cpp: 54, // C++ (GCC 9.2.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
  php: 68, // PHP (7.4.1)
  csharp: 51, // C# (Mono 6.6.0.161)
  sql: 82, // SQL (SQLite 3.27.2)
};

export default function ExampleEditor() {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [exampleCode, setExampleCode] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("html");
  const [runMode, setRunMode] = useState("html");
  const [exampleRunCode, setExampleRunCode] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState(null);
  const [exampleHasRun, setExampleHasRun] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const inferLanguage = (item) => {
    const declared = normalizeLanguage(item?.language || item?.lang);
    if (declared && declared !== "plaintext") return declared;

    const sample = item?.sample || "";
    if (sample.includes("#include") || sample.includes("int main("))
      return "cpp";
    if (/\bdef\s+\w+\s*\(/.test(sample) || /\bprint\s*\(/.test(sample))
      return "python";
    if (
      /\bpublic\s+class\b/.test(sample) ||
      /\bSystem\.out\.println/.test(sample)
    )
      return "java";
    if (/\bSELECT\b|\bFROM\b|\bWHERE\b/i.test(sample)) return "sql";
    if (/<\?php/i.test(sample) || /\becho\b/.test(sample)) return "php";
    if (/\bnamespace\b.*;|\bConsole\.Write(Line)?\b/.test(sample))
      return "csharp";
    if (
      sample.toLowerCase().includes("<!doctype html") ||
      sample.includes("<html")
    )
      return "html";
    if (/\bfunction\b|\bconst\b|\blet\b|\bconsole\.log\b/.test(sample))
      return "javascript";
    return "plaintext";
  };

  useEffect(() => {
    const items = CodeData?.data || [];
    const numericLessonId = Number(lessonId);

    let found = items.find((item) => Number(item.codeId) === numericLessonId);
    if (!found && Number.isFinite(numericLessonId) && numericLessonId > 0) {
      // Fallback to lesson order when codeId values don't match route lessonId.
      found = items[numericLessonId - 1];
    }

    const newCode = found?.sample || "<p>គ្មានមាតិកា</p>";
    const language = inferLanguage(found);

    setExampleCode(newCode);
    setEditorLanguage(language);
    setRunMode(language === "html" ? "html" : "text");
    setExampleHasRun(false);
    setRunError(null);
    setTextOutput("");
    setExampleRunCode("");
  }, [lessonId]);

  useEffect(() => {
    if (editorRef.current) {
      const current = editorRef.current.getValue();
      if (current !== exampleCode) {
        editorRef.current.setValue(exampleCode);
      }
    }
  }, [exampleCode]);

  useEffect(() => {
    if (isLessonCompletedForUser(lessonId)) setExampleHasRun(true);
  }, [lessonId]);

  useEffect(() => {
    const loadQuizProgress = () => {
      setQuizCompleted(isQuizCompletedForUser(lessonId));
    };

    loadQuizProgress();
    window.addEventListener("lessonProgressUpdated", loadQuizProgress);
    return () =>
      window.removeEventListener("lessonProgressUpdated", loadQuizProgress);
  }, [lessonId]);

  useEffect(() => {
    if (!courseId) return;

    const buildHeaders = () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        import.meta.env.VITE_API_TOKEN;
      return {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    };

    const extractList = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      if (Array.isArray(data?.data?.items)) return data.data.items;
      if (Array.isArray(data?.data?.content)) return data.data.content;
      if (Array.isArray(data?.data?.lessons)) return data.data.lessons;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.content)) return data.content;
      if (Array.isArray(data?.lessons)) return data.lessons;
      if (Array.isArray(data?.result)) return data.result;
      if (Array.isArray(data?.result?.data)) return data.result.data;
      if (Array.isArray(data?.result?.items)) return data.result.items;
      if (Array.isArray(data?.result?.content)) return data.result.content;
      if (Array.isArray(data?.result?.lessons)) return data.result.lessons;
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

    const fetchLessons = async () => {
      setLessonsLoading(true);
      const headers = buildHeaders();
      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
      ];

      try {
        for (const url of endpoints) {
          let response = await fetch(url, { headers });
          if (
            (response.status === 401 || response.status === 403) &&
            headers.Authorization
          ) {
            response = await fetch(url, {
              headers: { Accept: "application/json" },
            });
          }
          if (!response.ok) continue;

          const payload = await response.json();
          const parsed = normalizeLessons(extractList(payload));
          if (parsed.length) {
            setLessons(parsed);
            setLessonsLoading(false);
            return;
          }
        }
        setLessons([]);
      } catch {
        setLessons([]);
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const { prevLesson, nextLesson } = useMemo(() => {
    if (!lessons.length) return { prevLesson: null, nextLesson: null };

    const numericLessonId = Number(lessonId);
    const toNumber = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const sorted = [...lessons].sort((a, b) => {
      const aOrder = toNumber(a.sequenceNumber) ?? 0;
      const bOrder = toNumber(b.sequenceNumber) ?? 0;
      return aOrder - bOrder;
    });

    let currentIndex = sorted.findIndex(
      (item) => String(item.id) === String(lessonId),
    );

    if (
      currentIndex === -1 &&
      Number.isFinite(numericLessonId) &&
      numericLessonId > 0
    ) {
      currentIndex = sorted.findIndex(
        (item) => toNumber(item.sequenceNumber) === numericLessonId,
      );
    }

    if (
      currentIndex === -1 &&
      Number.isFinite(numericLessonId) &&
      numericLessonId > 0
    ) {
      currentIndex = numericLessonId - 1;
    }

    return {
      prevLesson: currentIndex > 0 ? sorted[currentIndex - 1] : null,
      nextLesson:
        currentIndex >= 0 && currentIndex < sorted.length - 1
          ? sorted[currentIndex + 1]
          : null,
    };
  }, [lessons, lessonId]);

  const handleNavigate = (lesson) => {
    if (!lesson || !quizCompleted) return;
    navigate(`/coursedetail/${courseId}/lesson/${lesson.id}`, {
      state: {
        lessonTitle: lesson.title,
        sequenceNumber: lesson.sequenceNumber,
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#0e172a" },
    });

    monaco.editor.setTheme("customTheme");

    if (exampleCode) {
      editor.setValue(exampleCode);
    }
  };

  const runExampleCode = async () => {
    if (!editorRef.current) return;

    const currentCode = editorRef.current.getValue();
    const currentLanguage = (editorLanguage || "html").toLowerCase();

    setRunError(null);
    setExampleHasRun(false);

    if (currentLanguage === "html") {
      const styledCode = `
        <style>
          body { color: white; background-color: #0e172a; }
        </style>
        ${currentCode}
      `;

      setRunMode("html");
      setExampleRunCode(styledCode);
      setExampleHasRun(true);
      setLessonCompletedForUser(lessonId, true);
      window.dispatchEvent(new Event("lessonProgressUpdated"));
      return;
    }

    if (currentLanguage === "javascript" || currentLanguage === "js") {
      const looksLikeHtml =
        /<!doctype html/i.test(currentCode) ||
        /<html[\s>]/i.test(currentCode) ||
        /<body[\s>]/i.test(currentCode) ||
        /<script[\s>]/i.test(currentCode);

      if (looksLikeHtml) {
        const styledHtml = `
          <style>
            body { color: white; background-color: #0e172a; }
          </style>
          ${currentCode}
        `;

        setRunMode("html");
        setExampleRunCode(styledHtml);
        setExampleHasRun(true);
        setLessonCompletedForUser(lessonId, true);
        window.dispatchEvent(new Event("lessonProgressUpdated"));
        return;
      }

      const escapedCode = currentCode.replace(/<\/script/gi, "<\\/script");
      const jsPreviewDoc = `
        <!doctype html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>JavaScript Preview</title>
            <style>
              body { margin: 0; padding: 16px; color: #e2e8f0; background: #0e172a; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
              #output { white-space: pre-wrap; line-height: 1.6; }
            </style>
          </head>
          <body>
            <h3>JavaScript Output</h3>
            <div id="output"></div>
            <script>
              const output = document.getElementById("output");
              const write = (...args) => {
                output.textContent += args.map((v) => typeof v === "string" ? v : JSON.stringify(v)).join(" ") + "\\n";
              };
              console.log = write;
              console.error = write;
              console.warn = write;
              try {
                const code = ${JSON.stringify(escapedCode)};
                new Function(code)();
              } catch (err) {
                write("Runtime Error:", err?.message || err);
              }
            </script>
          </body>
        </html>
      `;

      setRunMode("html");
      setExampleRunCode(jsPreviewDoc);
      setExampleHasRun(true);
      setLessonCompletedForUser(lessonId, true);
      window.dispatchEvent(new Event("lessonProgressUpdated"));
      return;
    }

    try {
      setRunning(true);
      const customRunnerUrl = import.meta.env.VITE_CODE_RUNNER_URL;
      let output = "";

      if (customRunnerUrl) {
        const response = await fetch(customRunnerUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: toRunnerLanguage(currentLanguage),
            sourceCode: currentCode,
          }),
        });

        if (!response.ok) {
          throw new Error(`Runner HTTP ${response.status}`);
        }

        const result = await response.json();
        output = result.stdout || result.output || result.stderr || "No output";
      } else {
        const runWithJudge0 = async () => {
          const languageId = JUDGE0_LANGUAGE_IDS[currentLanguage];
          if (!languageId) {
            throw new Error(
              `Judge0 does not support language: ${currentLanguage}`,
            );
          }

          const response = await fetch(
            "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                language_id: languageId,
                source_code: currentCode,
                stdin: "",
              }),
            },
          );

          if (!response.ok) {
            let details = "";
            try {
              details = await response.text();
            } catch {
              details = "";
            }
            throw new Error(
              `Judge0 HTTP ${response.status}${details ? `: ${details}` : ""}`,
            );
          }

          const result = await response.json();
          return (
            result.stdout ||
            result.stderr ||
            result.compile_output ||
            result.message ||
            "No output"
          );
        };

        const runWithPiston = async () => {
          const response = await fetch(
            "https://emkc.org/api/v2/piston/execute",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                language: toRunnerLanguage(currentLanguage),
                version: "*",
                files: [{ content: currentCode }],
              }),
            },
          );

          if (!response.ok) {
            let details = "";
            try {
              details = await response.text();
            } catch {
              details = "";
            }
            throw new Error(
              `Piston HTTP ${response.status}${details ? `: ${details}` : ""}`,
            );
          }

          const result = await response.json();
          return (
            result?.run?.stdout ||
            result?.run?.stderr ||
            result?.message ||
            "No output"
          );
        };

        try {
          output = await runWithJudge0();
        } catch (judgeError) {
          try {
            output = await runWithPiston();
          } catch (pistonError) {
            throw new Error(
              `All fallback runners failed.\n${judgeError.message}\n${pistonError.message}`,
            );
          }
        }
      }

      setRunMode("text");
      setTextOutput(output);
      setExampleHasRun(true);
      setLessonCompletedForUser(lessonId, true);
      window.dispatchEvent(new Event("lessonProgressUpdated"));
    } catch (error) {
      setRunMode("text");
      setRunError(error.message || "Failed to run code");
      setTextOutput("Runner error");
      setExampleHasRun(true);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-[#f2f2f2]" style={{ zoom: "100%" }}>
      <div className="max-w-[1750px] mx-auto px-6 md:px-20 pb-6 ">
        <div className="bg-white rounded-2xl border border-[#d9d9d9] dark:border[#1c293f] ">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#d9d9d9] bg-gray-50 rounded-t-2xl gap-3 md:gap-0">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
              ឧទាហរណ៍សរសេរកូដ
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const currentCode =
                    editorRef.current?.getValue() || exampleCode;
                  navigate("/fullscreen-editor", {
                    state: {
                      code: currentCode,
                      language: editorLanguage,
                    },
                  });
                }}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition shadow-sm flex items-center gap-2"
                title="Open full-screen editor"
              >
                <Maximize2 size={18} />
                <span className="hidden md:inline text-sm">ពង្រីក</span>
              </button>
              <button
                onClick={runExampleCode}
                disabled={running}
                className="px-5 py-2 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-sm"
                title="Run code"
              >
                {running ? "កំពុងដំណើរការ..." : "▶ ដំណើរការកូដ"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:h-[600px]">
            {/* Editor */}
            <div className="p-4 md:p-6 bg-gray-100 border-b md:border-b-0 md:border-r border-[#d9d9d9]">
              <div className="h-[400px] md:h-full rounded-xl overflow-hidden shadow-inner">
                <Editor
                  height="100%"
                  language={editorLanguage}
                  value={exampleCode}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    readOnly: true,
                  }}
                />
              </div>
            </div>

            {/* Preview – unchanged */}
            <div className="p-4 md:p-6 bg-gray-100">
              <div className="relative h-[400px] md:h-full rounded-xl bg-[#0e172a] flex items-center justify-center overflow-hidden shadow-inner">
                {!exampleHasRun ? (
                  <div className="absolute inset-0 flex items-center justify-center text-[#6c7180] text-sm md:text-lg px-6 text-center">
                    ចុចបុតុង “ដំណើរការកូដ” ដើម្បីឃើញលទ្ធផល...
                  </div>
                ) : runMode === "html" ? (
                  <iframe
                    title="example-preview"
                    srcDoc={exampleRunCode}
                    sandbox="allow-scripts"
                    className="w-full h-full bg-[#0e172a]"
                  />
                ) : (
                  <div className="w-full h-full overflow-auto p-4 text-white bg-[#0e172a]">
                    {runError ? (
                      <p className="text-red-400 whitespace-pre-wrap">
                        {runError}
                      </p>
                    ) : (
                      <pre className="whitespace-pre-wrap">{textOutput}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {(prevLesson || nextLesson) && !lessonsLoading && (
          <div className="px-4 md:px-8 pb-6 pt-4 flex flex-col sm:flex-row gap-3 justify-end">
            {prevLesson && (
              <button
                type="button"
                onClick={() => handleNavigate(prevLesson)}
                disabled={!quizCompleted}
                className={`px-6 py-3 rounded-lg text-center font-medium transition
                  ${
                    quizCompleted
                      ? "border border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                ត្រឡប់ទៅវីញ
              </button>
            )}
            {nextLesson && (
              <button
                type="button"
                onClick={() => handleNavigate(nextLesson)}
                disabled={!quizCompleted}
                className={`px-6 py-3 rounded-lg text-center font-medium transition
                  ${
                    quizCompleted
                      ? "border border-indigo-500 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      : "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                មេរៀនបន្ទាប់
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Modal - Full Viewport Coverage */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col w-screen h-screen overflow-hidden">
          {/* Fullscreen Header */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-gray-300 bg-gray-50 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-700">
              ឧទាហរណ៍សរសេរកូដ - ឡើងលើអាកាស
            </h3>
            <div className="flex gap-3 items-center">
              <button
                onClick={runExampleCode}
                disabled={running}
                className="px-5 py-2 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-sm"
              >
                {running ? "កំពុងដំណើរការ..." : "▶ ដំណើរការកូដ"}
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>

          {/* Fullscreen Content - Fill Remaining Space */}
          <div className="flex-1 grid grid-cols-2 overflow-hidden gap-0">
            {/* Editor */}
            <div className="overflow-hidden bg-gray-100 border-r border-gray-300">
              <Editor
                height="100%"
                language={editorLanguage}
                value={exampleCode}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  readOnly: true,
                }}
              />
            </div>

            {/* Preview */}
            <div className="overflow-hidden bg-gray-100">
              <div className="relative w-full h-full bg-[#0e172a] flex items-center justify-center">
                {!exampleHasRun ? (
                  <div className="flex items-center justify-center text-[#6c7180] text-lg px-6 text-center">
                    ចុចបុតុង "ដំណើរការកូដ" ដើម្បីឃើញលទ្ធផល...
                  </div>
                ) : runMode === "html" ? (
                  <iframe
                    title="example-preview-fullscreen"
                    srcDoc={exampleRunCode}
                    sandbox="allow-scripts"
                    className="w-full h-full bg-[#0e172a]"
                  />
                ) : (
                  <div className="w-full h-full overflow-auto p-4 text-white bg-[#0e172a]">
                    {runError ? (
                      <p className="text-red-400 whitespace-pre-wrap">
                        {runError}
                      </p>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">
                        {textOutput}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
