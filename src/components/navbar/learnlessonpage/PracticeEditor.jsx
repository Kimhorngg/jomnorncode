import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import practiceData from "./practice.json";

const LANGUAGE_ALIASES = {
  js: "javascript",
  javascript: "javascript",
  py: "python",
  python: "python",
  "c#": "csharp",
  csharp: "csharp",
  cs: "csharp",
  "c++": "cpp",
  cpp: "cpp",
  php: "php",
  php7: "php",
  php8: "php",
  sql: "sql",
  html: "html",
  css: "css",
};

const normalizeLanguage = (value) => {
  const normalized = String(value || "")
    .toLowerCase()
    .trim();
  if (normalized.includes("php")) return "php";
  if (normalized.includes("python")) return "python";
  if (normalized.includes("javascript")) return "javascript";
  if (normalized.includes("sql")) return "sql";
  if (normalized.includes("c#") || normalized.includes("csharp"))
    return "csharp";
  if (normalized.includes("c++") || normalized.includes("cpp")) return "cpp";
  return LANGUAGE_ALIASES[normalized] || normalized || "html";
};

export default function PracticeEditor() {
  const { lessonId } = useParams();
  const practiceEditorRef = useRef(null);

  const defaultStarterCode = `<!-- សរសេរកូដរបស់អ្នកនៅទីនេះ -->`;

  const [instruction, setInstruction] = useState("");
  const [practiceLanguage, setPracticeLanguage] = useState("html");
  const [editorCode, setEditorCode] = useState(defaultStarterCode);
  const [practiceRunCode, setPracticeRunCode] = useState(defaultStarterCode);
  const [practiceHasRun, setPracticeHasRun] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`lesson-${lessonId}-practiceCompleted`);
    setPracticeHasRun(saved === "true");
  }, [lessonId]);

  useEffect(() => {
    const items = Array.isArray(practiceData?.data) ? practiceData.data : [];
    const match = items.find(
      (item) => String(item.codeId) === String(lessonId),
    );

    const sample = match?.sample?.trim() || "";
    const sampleLower = sample.toLowerCase();
    const inferred =
      (sample.includes("#include") && "cpp") ||
      (sampleLower.includes("select ") && "sql") ||
      (sampleLower.includes("from ") && "sql") ||
      (sampleLower.includes("create table") && "sql") ||
      (sampleLower.includes("insert into") && "sql") ||
      (sampleLower.includes("php") && "php") ||
      (sampleLower.includes("<?php") && "php") ||
      (sampleLower.includes("echo ") && sampleLower.includes("$") && "php") ||
      (/^\s*\$[a-z_]/im.test(sample) && "php") ||
      (sample.includes("<html") && "html") ||
      (sample.includes("console.log") && "javascript") ||
      "html";
    const language = normalizeLanguage(match?.language || inferred);

    setPracticeLanguage(language);
    setInstruction(match?.instruction || "");

    const toComment = (code, lang) => {
      const normalizedLang = normalizeLanguage(lang);
      if (!code) return "";

      const lineComments = {
        sql: "--",
        python: "#",
        javascript: "//",
        js: "//",
        csharp: "//",
        php: "//",
      };

      if (normalizedLang === "css") return `/*\n${code}\n*/`;
      if (normalizedLang === "html") return `<!--\n${code}\n-->`;

      const prefix = lineComments[normalizedLang] || "//";

      return code
        .split("\n")
        .map((line) => `${prefix} ${line}`)
        .join("\n");
    };
    const nextCode = sample ? toComment(sample, language) : defaultStarterCode;

    setEditorCode(nextCode);
    setPracticeRunCode(nextCode);
    setPracticeHasRun(false);
  }, [lessonId]);

  const handleEditorDidMount = (editor, monaco) => {
    practiceEditorRef.current = editor;

    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
      },
    });

    monaco.editor.setTheme("customTheme");
  };

  const runPracticeCode = () => {
    const currentCode = practiceEditorRef.current
      ? practiceEditorRef.current.getValue()
      : editorCode;

    let output = currentCode;

    const normalizedRunLanguage = normalizeLanguage(practiceLanguage);

    if (normalizedRunLanguage === "html") {
      output = currentCode;
    } else if (normalizedRunLanguage === "css") {
      output = `
        <style>
          ${currentCode}
        </style>
        <div style="color: #e2e8f0; font-family: sans-serif; padding: 16px;">
          CSS loaded. Add HTML in the editor to see styled output.
        </div>
      `;
    } else if (normalizedRunLanguage === "javascript") {
      output = `
        <div style="color: #e2e8f0; font-family: sans-serif; padding: 16px;">
          Open console to see JavaScript output.
        </div>
        <script>
          ${currentCode}
        </script>
      `;
    } else if (normalizedRunLanguage === "php") {
      output = `
        <div style="color: #e2e8f0; font-family: sans-serif; padding: 16px;">
          PHP cannot run directly in browser preview.<br/>
          Run with command: <code style="color:#93c5fd;">php your_file.php</code>
        </div>
        <pre style="color: #e2e8f0; font-family: monospace; padding: 16px; white-space: pre-wrap;">${currentCode}</pre>
      `;
    } else {
      output = `
        <div style="color: #e2e8f0; font-family: monospace; padding: 16px; white-space: pre-wrap;">
          ${currentCode}
        </div>
      `;
    }

    const styledCode = `
      <style>
        body {
          color: white;
          background-color: #1e1e1e;
          font-family: sans-serif;
          padding: 16px;
        }
      </style>
      ${output}
    `;

    setPracticeRunCode(styledCode);
    setPracticeHasRun(true);

    localStorage.setItem(`lesson-${lessonId}-practiceCompleted`, "true");
    window.dispatchEvent(new Event("lessonProgressUpdated"));
  };

  return (
    <div className="bg-[#f2f2f2]">
      <div className="max-w-[1730px] mx-auto px-6 md:px-20 pb-8">
        <div className="bg-white rounded-2xl border border-[#d9d9d9]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#d9d9d9] bg-gray-50 rounded-t-2xl gap-3 md:gap-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                អនុវត្តជាមួយកូដ
              </h2>
              {instruction && (
                <p className="text-sm text-gray-600 mt-1">
                  សំណួរ: {instruction}
                </p>
              )}
            </div>

            <button
              onClick={runPracticeCode}
              className="px-5 py-2 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-sm"
            >
              ▶ ដំណើរការកូដ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:h-[600px]">
            <div className="p-4 md:p-6 bg-gray-100 border-b md:border-b-0 md:border-r border-[#d9d9d9]">
              <div className="h-[400px] md:h-full rounded-xl overflow-hidden shadow-inner">
                <Editor
                  key={lessonId}
                  height="100%"
                  defaultLanguage={practiceLanguage}
                  value={editorCode}
                  onChange={(value) => setEditorCode(value ?? "")}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            <div className="p-4 md:p-6 bg-gray-100">
              <div className="relative h-[400px] md:h-full rounded-xl bg-[#1e1e1e] flex items-center justify-center overflow-hidden shadow-inner">
                {!practiceHasRun ? (
                  <div className="absolute inset-0 flex items-center justify-center text-[#6c7180] text-sm md:text-lg px-6 text-center whitespace-pre-line">
                    {normalizeLanguage(practiceLanguage) === "php"
                      ? "PHP cannot run directly in browser preview.\nRun command: php your_file.php"
                      : "ចុចបុតុង “ដំណើរការកូដ” ដើម្បីឃើញលទ្ធផល..."}
                  </div>
                ) : (
                  <iframe
                    title="practice-preview"
                    srcDoc={practiceRunCode}
                    sandbox="allow-scripts"
                    className="w-full h-full bg-[#1e1e1e]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
