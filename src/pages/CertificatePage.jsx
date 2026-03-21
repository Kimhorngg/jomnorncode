import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Certificate from "./Certificate";
import { createApiClient } from "./Tracking";

function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function pickEnrollmentCourseId(enrollment) {
  return (
    enrollment?.courseId ??
    enrollment?.course?.id ??
    enrollment?.course?.courseId ??
    enrollment?.course_id ??
    null
  );
}

function pickEnrollmentProgress(enrollment) {
  return Number(
    enrollment?.progressPercentage ??
      enrollment?.progressPercent ??
      enrollment?.progress ??
      0,
  );
}

function loadEnrollmentForm(userId, courseId) {
  try {
    const raw = localStorage.getItem(`enrollment-form-${userId}-${courseId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function pickDisplayName(user = null) {
  if (!user) return "";

  const fullName =
    user?.fullName ||
    user?.displayName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  if (fullName) return fullName;

  if (user?.email) {
    return String(user.email).split("@")[0];
  }

  if (user?.username) return user.username;

  return "";
}

export default function CertificatePage() {
  const { courseId } = useParams();
  const auth = useSelector((state) => state?.auth || {});
  const reduxToken = auth?.token || null;
  const reduxUser = auth?.user || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [eligibility, setEligibility] = useState({
    isEnrolled: false,
    isProgressComplete: false,
    isEnrollmentCompleted: false,
  });

  const token = useMemo(
    () =>
      reduxToken ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      "",
    [reduxToken],
  );

  const userId = useMemo(
    () =>
      reduxUser?.id ||
      reduxUser?.userId ||
      (() => {
        try {
          const raw = localStorage.getItem("user");
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          return parsed?.id || parsed?.userId || null;
        } catch {
          return null;
        }
      })(),
    [reduxUser],
  );
  const enrollmentForm = useMemo(
    () => (userId && courseId ? loadEnrollmentForm(userId, courseId) : null),
    [userId, courseId],
  );
  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCertificate = async () => {
      setLoading(true);
      setError("");

      if (!token || !userId || !courseId) {
        if (isMounted) {
          setError("សូមចូលគណនីជាមុនសិន");
          setLoading(false);
        }
        return;
      }

      try {
        const api = createApiClient(token);

        // 1) Check enrollment
        const enrollmentPayload = await api.getEnrollmentsByUser(userId);
        const enrollmentList = toList(enrollmentPayload);

        const enrollment = enrollmentList.find(
          (item) => String(pickEnrollmentCourseId(item)) === String(courseId),
        );

        console.log("The isEnrollmentComplete: ", enrollment);
        const isEnrolled = !!enrollment;
        const progressPercentage = pickEnrollmentProgress(enrollment);
        const isProgressComplete = progressPercentage >= 100;
        // Check if enrollment is completed - either by progressPercentage >= 100 or by completed flag
        const isEnrollmentCompleted =
          progressPercentage >= 100 ||
          enrollment?.completed === true ||
          enrollment?.isCompleted === true ||
          String(enrollment?.status || "").toLowerCase() === "completed";

        if (isMounted) {
          setEligibility({
            isEnrolled,
            isProgressComplete,
            isEnrollmentCompleted,
          });
        }

        if (!isEnrolled) {
          if (isMounted) {
            setError("អ្នកមិនទាន់បាន enroll វគ្គសិក្សានេះទេ");
          }
          return;
        }

        if (!isProgressComplete) {
          if (isMounted) {
            setError("អ្នកត្រូវបញ្ចប់វគ្គសិក្សាទាំងស្រុងជាមុនសិន");
          }
          return;
        }

        if (!isEnrollmentCompleted) {
          if (isMounted) {
            setError("សូម Complete Enrollment ជាមុនសិន មុនទទួលបាន Certificate");
          }
          return;
        }

        // 2) Load certificate
        const certPayload = await api.getCertificatesByUser(userId);
        const certList = toList(certPayload);

        let certificate = certList.find((item) => {
          const itemCourseId =
            item?.courseId || item?.course?.id || item?.course?.courseId;
          return String(itemCourseId) === String(courseId);
        });

        // Ensure certificate has userId and courseId
        if (certificate) {
          certificate = {
            ...certificate,
            userId: certificate?.userId || Number(userId),
            courseId: certificate?.courseId || Number(courseId),
          };
        }

        // fallback display only after eligibility passes
        if (!certificate) {
          let course = null;
          try {
            course = await api.getCourseById(courseId);
          } catch {
            course = null;
          }

          certificate = {
            userId,
            userName: pickDisplayName(reduxUser) || "Student",
            courseId: Number(courseId),
            courseName:
              course?.courseTitle ||
              course?.courseName ||
              course?.title ||
              `Course ${courseId}`,
            source: "local-fallback",
          };
        }

        if (isMounted) {
          setCertificateData(certificate);
        }
      } catch (err) {
        if (isMounted) {
          setError("មិនអាចទាញយកទិន្នន័យ Certificate បាន");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCertificate();

    return () => {
      isMounted = false;
    };
  }, [token, userId, courseId, reduxUser]);

  if (loading) {
    return <div className="p-8 text-center">កំពុងទាញយក Certificate...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-600">{error}</div>

        {!eligibility.isEnrolled ? (
          <Link
            to={`/coursedetail/${courseId}`}
            className="inline-block rounded-xl bg-[#4477ce] px-5 py-3 font-semibold text-white"
          >
            ទៅកាន់ Course
          </Link>
        ) : !eligibility.isProgressComplete ? (
          <Link
            to={`/coursedetail/${courseId}`}
            className="inline-block rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            បន្តរៀន
          </Link>
        ) : !eligibility.isEnrollmentCompleted ? (
          <Link
            to={`/enrollment/${courseId}`}
            className="inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
          >
            Complete Enrollment
          </Link>
        ) : null}
      </div>
    );
  }

  const name =
    [enrollmentForm?.firstName, enrollmentForm?.lastName]
      .filter(Boolean)
      .join(" ") ||
    pickDisplayName(reduxUser) ||
    pickDisplayName(storedUser) ||
    certificateData?.userName ||
    "Student";

  const course =
    certificateData?.courseName ||
    certificateData?.course?.courseTitle ||
    certificateData?.title ||
    `Course ${courseId}`;

  return (
    <Certificate name={name} course={course} certificate={certificateData} />
  );
}
