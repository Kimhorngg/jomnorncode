import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

import LessonTopSection from "../components/navbar/learnlessonpage/LessonTopSection";
import KeyPointsCard from "../components/navbar/learnlessonpage/KeyPointCard";
import LessonProgressCard from "../components/navbar/learnlessonpage/LessonProgressCard";
import ExampleEditor from "../components/navbar/learnlessonpage/ExampleEditor";
import DefinitionCard from "../components/navbar/learnlessonpage/DefinitionCard";
import PracticeEditor from "../components/navbar/learnlessonpage/PracticeEditor";
import LockOverlay from "../components/LockOverlay";

export default function LearnLesson() {
  const { lessonId } = useParams();
  const fallbackDefinition = "<p>គ្មានមាតិកាមេរៀន</p>";
  const [zoomLevel, setZoomLevel] = useState(100);

  // Load zoom level from localStorage on mount
  useEffect(() => {
    const savedZoom = localStorage.getItem("lessonPageZoom");
    if (savedZoom) {
      setZoomLevel(Number(savedZoom));
    }
  }, []);

  // Apply zoom to entire document and save to localStorage
  useEffect(() => {
    document.documentElement.style.zoom = `${zoomLevel}%`;
    localStorage.setItem("lessonPageZoom", zoomLevel);
  }, [zoomLevel]);

  // Cleanup zoom on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.zoom = "100%";
    };
  }, []);

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <>
      <LockOverlay />
      {/* Zoom Controls - Fixed Position */}
      <div className="fixed top-4 right-4 z-40 flex gap-2 bg-white rounded-lg shadow-lg p-2 md:p-3 border border-gray-300">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= 70}
          className="p-2 hover:bg-gray-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut size={20} className="text-gray-700" />
        </button>
        <div className="flex items-center px-3 py-2 bg-gray-50 rounded min-w-[70px] justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {zoomLevel}%
          </span>
        </div>
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= 200}
          className="p-2 hover:bg-gray-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn size={20} className="text-gray-700" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Reset zoom"
        >
          <RotateCcw size={20} className="text-gray-700" />
        </button>
      </div>

      <div className="bg-[#f2f2f2]">
        <div data-aos="fade-up">
          <LessonTopSection />
        </div>

        <div
          className="max-w-420 mx-auto px-6 lg:px-12 pt-4 pb-8 text-slate-800 flex flex-col lg:flex-row gap-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* Main Content Area */}
          <div className="flex-1 lg:flex-[2.5] space-y-8">
            <DefinitionCard content={fallbackDefinition} />
            <KeyPointsCard />
          </div>

          {/* Sidebar Area */}
          <div className="flex-1 lg:flex-1 space-y-8">
            <LessonProgressCard
              progress={Math.min(Number(lessonId || 1) * 10, 100)}
            />
          </div>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="200">
        <ExampleEditor />
      </div>
      <div data-aos="fade-up" data-aos-delay="250">
        <PracticeEditor />
      </div>
    </>
  );
}
