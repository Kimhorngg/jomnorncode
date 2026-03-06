import React from "react";
import { useParams } from "react-router-dom";

import LessonTopSection from "../components/navbar/learnlessonpage/LessonTopSection";
import KeyPointsCard from "../components/navbar/learnlessonpage/KeyPointCard";
import LessonProgressCard from "../components/navbar/learnlessonpage/LessonProgressCard";
import ExampleEditor from "../components/navbar/learnlessonpage/ExampleEditor";
import PracticeEditor from "../components/navbar/learnlessonpage/PracticeEditor";
import DefinitionCard from "../components/navbar/learnlessonpage/DefinitionCard";

export default function LearnLesson() {
  const { lessonId } = useParams();
  const fallbackDefinition = "<p>គ្មានមាតិកាមេរៀន</p>";

  return (
    <>
      <div className="bg-[#f2f2f2]">
        <LessonTopSection />

        <div className="max-w-[1570px] mx-auto px-6 md:px-20 pt-4 pb-5 text-slate-800 flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 lg:flex-[2.5] space-y-4">
            <DefinitionCard content={fallbackDefinition} />
            <KeyPointsCard />
          </div>

          {/* Sidebar Area */}
          <div className="flex-1 lg:flex-[1]">
            <LessonProgressCard progress={Math.min(Number(lessonId || 1) * 10, 100)} />
          </div>
        </div>
      </div>

      <ExampleEditor />
      <PracticeEditor />
    </>
  );
}
