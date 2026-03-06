import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function KeyPointsCard() {
  const { lessonId } = useParams();
  const [keyPoints, setKeyPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        // Split body into fake key points
        const points = data.body.split("\n");
        setKeyPoints(points);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">🔑 ចំណុចសំខាន់ៗ</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-600">
        {keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
}