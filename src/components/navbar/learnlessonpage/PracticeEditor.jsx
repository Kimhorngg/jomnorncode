// import React, { useRef, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import practiceData from "./practice.json";

// const LANGUAGE_ALIASES = {
//   js: "javascript",
//   javascript: "javascript",
//   py: "python",
//   python: "python",
//   java: "java",
//   "c#": "csharp",
//   csharp: "csharp",
//   cs: "csharp",
//   "c++": "cpp",
//   cpp: "cpp",
//   php: "php",
//   php7: "php",
//   php8: "php",
//   sql: "sql",
//   html: "html",
//   css: "css",
// };

// const normalizeLanguage = (value) => {
//   const normalized = String(value || "").toLowerCase().trim();

//   if (normalized.includes("php")) return "php";
//   if (normalized.includes("python")) return "python";
//   if (normalized.includes("javascript")) return "javascript";
//   if (normalized === "js") return "javascript";
//   if (normalized.includes("java")) return "java";
//   if (normalized.includes("sql")) return "sql";
//   if (normalized.includes("c#") || normalized.includes("csharp")) return "csharp";
//   if (normalized.includes("c++") || normalized.includes("cpp")) return "cpp";
//   if (normalized.includes("html")) return "html";
//   if (normalized.includes("css")) return "css";

//   return LANGUAGE_ALIASES[normalized] || "html";
// };

// const detectLanguageFromSample = (sample = "") => {
//   const s = sample.toLowerCase();

//   if (
//     s.includes("#include") ||
//     s.includes("using namespace std") ||
//     s.includes("cout <<")
//   ) {
//     return "cpp";
//   }

//   if (
//     s.includes("select ") ||
//     s.includes("from ") ||
//     s.includes("create table") ||
//     s.includes("insert into") ||
//     s.includes("update ") ||
//     s.includes("delete from")
//   ) {
//     return "sql";
//   }

//   if (
//     s.includes("<?php") ||
//     (s.includes("echo ") && s.includes("$")) ||
//     /^\s*\$[a-z_]/im.test(sample)
//   ) {
//     return "php";
//   }

//   if (
//     s.includes("using system;") ||
//     s.includes("console.writeline") ||
//     s.includes("namespace ")
//   ) {
//     return "csharp";
//   }

//   if (
//     s.includes("public class") &&
//     s.includes("system.out.println")
//   ) {
//     return "java";
//   }

//   if (
//     s.includes("def ") ||
//     s.includes("print(") ||
//     s.includes("import math")
//   ) {
//     return "python";
//   }

//   if (
//     s.includes("console.log") ||
//     s.includes("let ") ||
//     s.includes("const ") ||
//     s.includes("function ")
//   ) {
//     return "javascript";
//   }

//   if (
//     s.includes("<html") ||
//     s.includes("<!doctype html") ||
//     s.includes("<body")
//   ) {
//     return "html";
//   }

//   if (
//     s.includes("{") &&
//     s.includes(":") &&
//     s.includes(";") &&
//     !s.includes("<html")
//   ) {
//     return "css";
//   }

//   return "html";
// };

// const toComment = (code, lang) => {
//   const normalizedLang = normalizeLanguage(lang);
//   if (!code) return "";

//   const lineComments = {
//     sql: "--",
//     python: "#",
//     javascript: "//",
//     java: "//",
//     cpp: "//",
//     csharp: "//",
//     php: "//",
//   };

//   if (normalizedLang === "css") return `/*\n${code}\n*/`;
//   if (normalizedLang === "html") return `<!--\n${code}\n-->`;

//   const prefix = lineComments[normalizedLang] || "//";

//   return code
//     .split("\n")
//     .map((line) => `${prefix} ${line}`)
//     .join("\n");
// };

// export default function PracticeEditor() {
//   const { lessonId, courseId } = useParams();
//   const practiceEditorRef = useRef(null);

//   const defaultStarterCode = `<!-- សរសេរកូដរបស់អ្នកនៅទីនេះ -->`;

//   const [instruction, setInstruction] = useState("");
//   // const [sampleCode, setSampleCode] = useState("");
//   const [practiceLanguage, setPracticeLanguage] = useState("html");
//   const [editorCode, setEditorCode] = useState(defaultStarterCode);
//   const [practiceRunCode, setPracticeRunCode] = useState("");
//   const [practiceHasRun, setPracticeHasRun] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem(`lesson-${lessonId}-practiceCompleted`);
//     setPracticeHasRun(saved === "true");
//   }, [lessonId]);

//   useEffect(() => {
//     const items = Array.isArray(practiceData?.data) ? practiceData.data : [];
//     const match = items.find((item) => String(item.codeId) === String(lessonId));

//     if (!match) {
//       setPracticeLanguage("html");
//       setInstruction("");
//       // setSampleCode("");
//       setEditorCode(defaultStarterCode);
//       setPracticeRunCode("");
//       setPracticeHasRun(false);
//       return;
//     }

//     const sample = match?.sample?.trim() || "";
//     const inferredLanguage = detectLanguageFromSample(sample);
//     const declaredLanguage = normalizeLanguage(match?.language);

//     const finalLanguage =
//       inferredLanguage && inferredLanguage !== "html"
//         ? inferredLanguage
//         : declaredLanguage;

//     console.log("courseId:", courseId);
//     console.log("lessonId:", lessonId);
//     console.log("matched lesson:", match);
//     console.log("declaredLanguage:", declaredLanguage);
//     console.log("inferredLanguage:", inferredLanguage);
//     console.log("finalLanguage:", finalLanguage);

//     setPracticeLanguage(finalLanguage);
//     setInstruction(match?.instruction || "");
//     // setSampleCode(sample);

//     const nextCode = sample ? toComment(sample, finalLanguage) : defaultStarterCode;
//     setEditorCode(nextCode);
//     setPracticeRunCode("");
//     setPracticeHasRun(false);
//   }, [lessonId, courseId]);

//   const handleEditorDidMount = (editor, monaco) => {
//     practiceEditorRef.current = editor;

//     monaco.editor.defineTheme("customTheme", {
//       base: "vs-dark",
//       inherit: true,
//       rules: [],
//       colors: {
//         "editor.background": "#1e1e1e",
//       },
//     });

//     monaco.editor.setTheme("customTheme");
//   };

//   const runPracticeCode = () => {
//     const currentCode = practiceEditorRef.current
//       ? practiceEditorRef.current.getValue()
//       : editorCode;

//     const normalizedRunLanguage = normalizeLanguage(practiceLanguage);
//     let output = currentCode;

//     if (normalizedRunLanguage === "html") {
//       output = currentCode;
//     } else if (normalizedRunLanguage === "css") {
//       output = `
//         <style>${currentCode}</style>
//         <div style="color:#e2e8f0;font-family:sans-serif;padding:16px;">
//           <h1>CSS Preview</h1>
//           <p>This is a paragraph.</p>
//           <button>Test Button</button>
//           <div class="box">Sample Box</div>
//         </div>
//       `;
//     } else if (normalizedRunLanguage === "javascript") {
//       output = `
//         <div id="output" style="color:#e2e8f0;font-family:monospace;padding:16px;white-space:pre-wrap;"></div>
//         <script>
//           const output = document.getElementById("output");
//           const write = (...args) => {
//             output.textContent += args.join(" ") + "\\n";
//           };
//           console.log = write;
//           console.error = write;
//           console.warn = write;

//           try {
//             ${currentCode}
//           } catch (err) {
//             write("Runtime Error:", err.message);
//           }
//         </script>
//       `;
//     } else if (normalizedRunLanguage === "php") {
//       output = `
//         <div style="color:#e2e8f0;font-family:sans-serif;padding:16px;">
//           PHP cannot run directly in browser preview.<br/>
//           Run with command: <code style="color:#93c5fd;">php your_file.php</code>
//         </div>
//       `;
//     } else if (normalizedRunLanguage === "sql") {
//       output = `
//         <div style="color:#e2e8f0;font-family:sans-serif;padding:16px;">
//           SQL cannot run directly in browser preview.<br/>
//           Run with SQLite or your database tool.
//         </div>
//       `;
//     } else if (["cpp", "csharp", "python", "java"].includes(normalizedRunLanguage)) {
//       output = `
//         <div style="color:#e2e8f0;font-family:sans-serif;padding:16px;">
//           ${normalizedRunLanguage.toUpperCase()} cannot run directly in browser preview.<br/>
//           Run this code in your compiler, terminal, or backend runner.
//         </div>
//       `;
//     } else {
//       output = `
//         <div style="color:#e2e8f0;font-family:monospace;padding:16px;white-space:pre-wrap;">
//           ${currentCode}
//         </div>
//       `;
//     }

//     const styledCode = `
//       <style>
//         body {
//           color: white;
//           background-color: #1e1e1e;
//           font-family: sans-serif;
//           padding: 16px;
//           margin: 0;
//         }
//       </style>
//       ${output}
//     `;

//     setPracticeRunCode(styledCode);
//     setPracticeHasRun(true);

//     localStorage.setItem(`lesson-${lessonId}-practiceCompleted`, "true");
//     window.dispatchEvent(new Event("lessonProgressUpdated"));
//   };

//   return (
//     <div className="bg-[#f2f2f2]">
//       <div className="max-w-[1730px] mx-auto px-6 md:px-20 pb-8">
//         <div className="bg-white rounded-2xl border border-[#d9d9d9]">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#d9d9d9] bg-gray-50 rounded-t-2xl gap-3 md:gap-0">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-700">
//                 អនុវត្តជាមួយកូដ
//               </h2>
//               <p className="text-sm text-blue-600 mt-1">
//                 Course ID: {courseId}
//               </p>
//               <p className="text-sm text-blue-600 mt-1">
//                 Lesson ID: {lessonId}
//               </p>
//               <p className="text-sm text-blue-600 mt-1">
//                 Language: {practiceLanguage}
//               </p>
//               {instruction && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   សំណួរ: {instruction}
//                 </p>
//               )}
//             </div>

//             <button
//               onClick={runPracticeCode}
//               className="px-5 py-2 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-sm"
//             >
//               ▶ ដំណើរការកូដ
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 md:h-[600px]">
//             <div className="p-4 md:p-6 bg-gray-100 border-b md:border-b-0 md:border-r border-[#d9d9d9]">
//               <div className="h-[400px] md:h-full rounded-xl overflow-hidden shadow-inner">
//                 <Editor
//                   key={`${lessonId}-${practiceLanguage}`}
//                   height="100%"
//                   language={practiceLanguage}
//                   value={editorCode}
//                   onChange={(value) => setEditorCode(value ?? "")}
//                   onMount={handleEditorDidMount}
//                   options={{
//                     fontSize: 14,
//                     minimap: { enabled: true },
//                     automaticLayout: true,
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="p-4 md:p-6 bg-gray-100">
//               <div className="relative h-[400px] md:h-full rounded-xl bg-[#1e1e1e] flex items-center justify-center overflow-hidden shadow-inner">
//                 {!practiceHasRun ? (
//                   <div className="absolute inset-0 flex items-center justify-center text-[#6c7180] text-sm md:text-lg px-6 text-center whitespace-pre-line">
//                     {practiceLanguage === "php"
//                       ? "PHP cannot run directly in browser preview.\nRun command: php your_file.php"
//                       : 'ចុចបុតុង "ដំណើរការកូដ" ដើម្បីឃើញលទ្ធផល...'}
//                   </div>
//                 ) : (
//                   <iframe
//                     title="practice-preview"
//                     srcDoc={practiceRunCode}
//                     sandbox="allow-scripts"
//                     className="w-full h-full bg-[#1e1e1e]"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

import CodeData from "./code-monoco.json";

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

export default function PracticEditor() {
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

  const inferLanguage = (item) => {
    const declared = normalizeLanguage(item?.language || item?.lang);
    if (declared && declared !== "plaintext") return declared;

    const sample = item?.practice || "";
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

    const newCode = found?.practice;
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
    const saved = localStorage.getItem(`lesson-${lessonId}-lessonCompleted`);
    if (saved === "true") setExampleHasRun(true);
  }, [lessonId]);

  useEffect(() => {
    const loadQuizProgress = () => {
      setQuizCompleted(
        localStorage.getItem(`lesson-${lessonId}-quizCompleted`) === "true",
      );
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
      localStorage.setItem(`lesson-${lessonId}-lessonCompleted`, "true");
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
        localStorage.setItem(`lesson-${lessonId}-lessonCompleted`, "true");
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
      localStorage.setItem(`lesson-${lessonId}-lessonCompleted`, "true");
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
      localStorage.setItem(`lesson-${lessonId}-lessonCompleted`, "true");
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
    <div className="bg-[#f2f2f2]">
      <div className="max-w-[1750px] mx-auto px-6 md:px-20 pb-6">
        <div className="bg-white rounded-2xl border border-[#d9d9d9]">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#d9d9d9] bg-gray-50 rounded-t-2xl gap-3 md:gap-0">
            <h2 className="text-xl font-semibold dark:text-white text-gray-700">
              អនុវត្តជាមួយកូដ
            </h2>
            <button
              onClick={runExampleCode}
              disabled={running}
              className="px-5 py-2 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-sm"
            >
              {running ? "កំពុងដំណើរការ..." : "▶ ដំណើរការកូដ"}
            </button>
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
                    readOnly: false,
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
                  <div className="w-full h-full overflow-auto p-4 text-green-300 bg-[#0e172a]">
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
    </div>
  );
}
