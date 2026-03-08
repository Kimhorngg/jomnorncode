import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import KeyPointData from "./keypoint.json";
import CodeData from "./code-monoco.json";

export default function KeyPointsCard() {
  const { lessonId } = useParams();
  const [keyPoints, setKeyPoints] = useState([]);

  useEffect(() => {
    const numericLessonId = Number(lessonId);
    const codeItems = CodeData?.data || [];
    const keypointItems = KeyPointData?.data || [];

    let codeItem = codeItems.find((item) => Number(item.codeId) === numericLessonId);
    if (!codeItem && Number.isFinite(numericLessonId) && numericLessonId > 0) {
      codeItem = codeItems[numericLessonId - 1];
    }

    const normalizeText = (value) =>
      String(value || "")
        .replace(/\r/g, "")
        .trim();

    const targetSample = normalizeText(codeItem?.sample);

    const matched =
      keypointItems.find((item) => Number(item.codeId) === numericLessonId) ||
      (codeItem ? keypointItems.find((item) => Number(item.codeId) === Number(codeItem.codeId)) : null) ||
      (targetSample
        ? keypointItems.find(
            (item) => normalizeText(item.sample) === targetSample,
          )
        : null);

    const points = Array.isArray(matched?.keyPoints)
      ? matched.keyPoints.filter(Boolean)
      : normalizeText(matched?.sample)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    setKeyPoints(points);
  }, [lessonId]);

  return (
    <div className="bg-white max-w-[1610px] p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">🔑 ចំណុចសំខាន់ៗ</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-600">
        {keyPoints.length ? (
          keyPoints.map((point, index) => <li key={index}>{point}</li>)
        ) : (
          <li>មិនមានចំណុចសំខាន់ៗសម្រាប់មេរៀននេះទេ</li>
        )}
      </ul>
    </div>
  );
}
