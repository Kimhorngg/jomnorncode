import React from "react";
import { useParams } from "react-router-dom";

import LessonTopSection from "../components/navbar/learnlessonpage/LessonTopSection";
import KeyPointsCard from "../components/navbar/learnlessonpage/KeyPointCard";
import LessonProgressCard from "../components/navbar/learnlessonpage/LessonProgressCard";
import ExampleEditor from "../components/navbar/learnlessonpage/ExampleEditor";
import DefinitionCard from "../components/navbar/learnlessonpage/DefinitionCard";
import PracticeEditor from "../components/navbar/learnlessonpage/PracticeEditor";

export default function LearnLesson() {
  const { lessonId } = useParams();
  const fallbackDefinition = "<p>គ្មានមាតិកាមេរៀន</p>";

  return (
    <>
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
          <div className="flex-1 lg:flex-[1] space-y-8">
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
