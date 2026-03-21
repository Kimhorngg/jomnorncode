import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { X, Play } from "lucide-react";

const FullscreenEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("html");
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);

  // Get data from location state or localStorage
  useEffect(() => {
    if (location.state) {
      setCode(location.state.code || "");
      setLanguage(location.state.language || "html");
    } else {
      // Fallback to localStorage
      const savedCode = localStorage.getItem("fullscreen-editor-code");
      const savedLanguage = localStorage.getItem("fullscreen-editor-language");
      if (savedCode) setCode(savedCode);
      if (savedLanguage) setLanguage(savedLanguage);
    }
  }, [location.state]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#0e172a" },
    });
    monaco.editor.setTheme("customTheme");
  };

  const runCode = async () => {
    if (!editorRef.current) return;

    const currentCode = editorRef.current.getValue();
    let currentLanguage = (language || "html").toLowerCase();

    // Auto-detect HTML content even if language is marked as JavaScript
    const looksLikeHTML =
      /<!doctype html/i.test(currentCode) ||
      /<html[\s>]/i.test(currentCode) ||
      /<head[\s>]/i.test(currentCode) ||
      /<body[\s>]/i.test(currentCode);

    if (looksLikeHTML) {
      currentLanguage = "html";
    }

    setRunning(true);

    try {
      if (currentLanguage === "html") {
        const styledCode = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <style>
                * {
                  margin: 0;
                  padding: 0;
                }
                html, body {
                  color: white !important;
                  background-color: #0e172a !important;
                  font-family: Arial, sans-serif;
                }
                body > * {
                  color: inherit;
                }
              </style>
            </head>
            <body>
              ${currentCode}
            </body>
          </html>
        `;
        setOutput(styledCode);
        setHasRun(true);
        return;
      }

      if (currentLanguage === "javascript" || currentLanguage === "js") {
        const escapedCode = currentCode.replace(/<\/script/gi, "<\\/script");
        const jsPreviewDoc = `
          <!doctype html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>JavaScript Preview</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  color: #e2e8f0; 
                  background: #0e172a; 
                  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                  font-size: 14px;
                }
                #output { 
                  white-space: pre-wrap; 
                  line-height: 1.6;
                  border: 1px solid #333;
                  padding: 10px;
                  border-radius: 4px;
                  background: #111;
                }
              </style>
            </head>
            <body>
              <h3 style="margin-top: 0;">JavaScript Output:</h3>
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
        setOutput(jsPreviewDoc);
        setHasRun(true);
        return;
      }

      if (currentLanguage === "css") {
        const cssPreviewDoc = `
          <!doctype html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>CSS Preview</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  color: #e2e8f0; 
                  background: #0e172a; 
                  font-family: Arial, sans-serif;
                }
                /* User CSS Code */
                ${currentCode}
              </style>
            </head>
            <body>
              <h3 style="color: #e2e8f0; margin-top: 0;">CSS Preview:</h3>
              
              <div class="test-box">Test Box with Custom Styles</div>
              
              <button class="test-btn">Test Button</button>
              
              <p class="test-text">Test paragraph with custom styles</p>
              
              <div class="card">
                <h4>Card Example</h4>
                <p>This is a sample card to showcase your CSS</p>
              </div>
            </body>
          </html>
        `;
        setOutput(cssPreviewDoc);
        setHasRun(true);
        setRunning(false);
        return;
      }

      // For unsupported languages
      const unsupportedMsg = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                color: #e2e8f0; 
                background: #0e172a; 
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>
            <h3>⚠️ ${currentLanguage.toUpperCase()} Cannot Run in Browser</h3>
            <p>This language requires a server or external compiler to run.</p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">Supported languages for browser preview: HTML, JavaScript, CSS</p>
          </body>
        </html>
      `;
      setOutput(unsupportedMsg);
      setHasRun(true);
      setRunning(false);
      return;
    } catch (error) {
      setOutput(`<div style="padding: 20px; color: #ff6b6b; background: #0e172a;">
        <h3>Error:</h3>
        <p>${error.message}</p>
      </div>`);
      setHasRun(true);
    } finally {
      setRunning(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div
      className="w-screen h-screen bg-white flex flex-col overflow-hidden"
      style={{ zoom: "100%" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-300 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Full Screen Editor
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Language:{" "}
            <span className="font-semibold">{language.toUpperCase()}</span>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={runCode}
            disabled={running}
            className="px-6 py-2.5 bg-[#3f72af] hover:bg-[#112d4f] text-white rounded-lg transition shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={18} />
            <span className="font-semibold">
              {running ? "Running..." : "Run Code"}
            </span>
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition shadow-md flex items-center gap-2"
          >
            <X size={20} />
            <span className="font-semibold">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden gap-0">
        {/* Editor Side */}
        <div className="overflow-hidden bg-gray-100 border-r border-gray-300">
          <Editor
            defaultLanguage={language}
            value={code}
            onChange={(value) => {
              setCode(value || "");
              localStorage.setItem("fullscreen-editor-code", value || "");
            }}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 16,
              minimap: { enabled: true },
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Output Side */}
        <div className="overflow-hidden bg-gray-100 flex flex-col">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-300 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Output</h2>
          </div>
          <div className="flex-1 overflow-auto bg-[#0e172a]">
            {!hasRun ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center px-6">
                <div>
                  <p className="text-lg mb-2">No output yet</p>
                  <p className="text-sm">Click "Run Code" to see the result</p>
                </div>
              </div>
            ) : (
              <iframe
                key={output} // Force iframe to refresh when output changes
                title="fullscreen-output"
                srcDoc={output}
                sandbox="allow-scripts"
                className="w-full h-full border-0"
                style={{ backgroundColor: "#0e172a" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenEditor;
