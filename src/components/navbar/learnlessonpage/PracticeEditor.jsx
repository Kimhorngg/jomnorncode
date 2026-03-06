import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function PracticeEditor() {
  const { lessonId } = useParams();
  const practiceEditorRef = useRef(null);

  const starterCode = `<!-- សរសេរកូដរបស់អ្នកនៅទីនេះ -->`;

  const [practiceRunCode, setPracticeRunCode] = useState(starterCode);
  const [practiceHasRun, setPracticeHasRun] = useState(false);

  // Only mark as completed if user actually clicks Run
  useEffect(() => {
    const saved = localStorage.getItem(`lesson-${lessonId}-practiceCompleted`);
    if (saved === "true") setPracticeHasRun(true);
  }, [lessonId]);

  const handleEditorDidMount = (editor, monaco) => {
    practiceEditorRef.current = editor;

    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#1e1e1e" },
    });

    monaco.editor.setTheme("customTheme");
    editor.setValue(starterCode);
  };

 const runPracticeCode = () => {
  if (!practiceEditorRef.current) return;

  const currentCode = practiceEditorRef.current.getValue();

  const styledCode = `
    <style>
      body { color: white; background-color: #1e1e1e; }
    </style>
    ${currentCode}
  `;

  // ✅ update the iframe
  setPracticeRunCode(styledCode);

  setPracticeHasRun(true);

  localStorage.setItem(`lesson-${lessonId}-practiceCompleted`, "true");
  window.dispatchEvent(new Event("lessonProgressUpdated"));
};

  return (
    <div className="bg-[#f2f2f2]">
      <div className="max-w-[1570px] mx-auto px-6 md:px-20 pb-8">
        <div className="bg-white rounded-2xl border border-[#d9d9d9]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#d9d9d9] bg-gray-50 rounded-t-2xl gap-3 md:gap-0">
          <h2 className="text-xl font-semibold text-gray-700">អនុវត្តជាមួយកូដ</h2>
          <button
            onClick={runPracticeCode}
            className="px-5 py-2 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-sm"
          >
            ▶ ដំណើរការកូដ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:h-[600px]">
          {/* Editor */}
          <div className="p-4 md:p-6 bg-gray-100 border-b md:border-b-0 md:border-r border-[#d9d9d9]">
            <div className="h-[400px] md:h-full rounded-xl overflow-hidden shadow-inner">
              <Editor
                height="100%"
                defaultLanguage="html"
                defaultValue={starterCode}
                onMount={handleEditorDidMount}
                options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 md:p-6 bg-gray-100">
            <div className="relative h-[400px] md:h-full rounded-xl bg-[#1e1e1e] flex items-center justify-center overflow-hidden shadow-inner">
              {!practiceHasRun ? (
                <div className="absolute inset-0 flex items-center justify-center text-[#6c7180] text-sm md:text-lg px-6 text-center">
                  ចុចបុតុង “ដំណើរការកូដ” ដើម្បីឃើញលទ្ធផល...
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
