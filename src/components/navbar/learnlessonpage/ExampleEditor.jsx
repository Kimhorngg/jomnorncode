import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function ExampleEditor() {
  const { lessonId } = useParams();
  const exampleEditorRef = useRef(null);

  const exampleCode = `<!-- HTML Example -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Webpage</title>
</head>
<body>
  <h1>Welcome to Example Editor</h1>
  <p>This is an example HTML page.</p>
</body>
</html>`;

  // State for iframe output and "has run" for UI
  const [exampleRunCode, setExampleRunCode] = useState(exampleCode);
  const [exampleHasRun, setExampleHasRun] = useState(false);

  // On mount, check if the lesson was already completed
  useEffect(() => {
    const saved = localStorage.getItem(`lesson-${lessonId}-lessonCompleted`);
    if (saved === "true") setExampleHasRun(true);
  }, [lessonId]);

  const handleEditorDidMount = (editor, monaco) => {
    exampleEditorRef.current = editor;

    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#0e172a" },
    });

    monaco.editor.setTheme("customTheme");
    editor.setValue(exampleCode);
  };

  const runExampleCode = () => {
    if (!exampleEditorRef.current) return;

    // Get the current code from the editor
    const currentCode = exampleEditorRef.current.getValue();

    // Add inline style for background & text color
    const styledCode = `
      <style>
        body { color: white; background-color: #0e172a; }
      </style>
      ${currentCode}
    `;

    // Update iframe output
    setExampleRunCode(styledCode);

    // Update local state for this component
    setExampleHasRun(true);

    // Save lesson progress to localStorage
    localStorage.setItem(`lesson-${lessonId}-lessonCompleted`, "true");

    // Notify the progress card to reload
    window.dispatchEvent(new Event("lessonProgressUpdated"));
  };

  return (
    <div className="bg-[#f2f2f2]">
      <div className="max-w-[1570px] mx-auto px-6 md:px-20 pb-6">
        <div className="bg-white rounded-2xl border border-[#d9d9d9]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-5 border-b border-[#d9d9d9] bg-gray-50 rounded-t-2xl gap-3 md:gap-0">
          <h2 className="text-xl font-semibold text-gray-700">ឧទាហរណ៍សរសេរកូដ</h2>
          <button
            onClick={runExampleCode}
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
                defaultValue={exampleCode}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 md:p-6 bg-gray-100">
            <div className="relative h-[400px] md:h-full rounded-xl bg-[#0e172a] flex items-center justify-center overflow-hidden shadow-inner">
              {!exampleHasRun ? (
                <div className="absolute inset-0 flex items-center justify-center text-[#6c7180] text-sm md:text-lg px-6 text-center">
                  ចុចបុតុង “ដំណើរការកូដ” ដើម្បីឃើញលទ្ធផល...
                </div>
              ) : (
                <iframe
                  title="example-preview"
                  srcDoc={exampleRunCode}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-[#0e172a]"
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
