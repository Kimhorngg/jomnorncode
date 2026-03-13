import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const API_BASE = "https://jomnorncode-api.cheat.casa/api";
const ENROLLMENT_FORM_KEY = "enrollment-form";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getDisplayName(user) {
  if (!user) return "";
  if (user.fullName) return user.fullName;
  if (user.displayName) return user.displayName;
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  if (user.username) return user.username;
  return "";
}

function splitName(fullName = "") {
  const trimmed = String(fullName).trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function loadEnrollmentForm(userId, courseId) {
  try {
    const raw = localStorage.getItem(
      `${ENROLLMENT_FORM_KEY}-${userId}-${courseId}`,
    );
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveEnrollmentForm(userId, courseId, value) {
  localStorage.setItem(
    `${ENROLLMENT_FORM_KEY}-${userId}-${courseId}`,
    JSON.stringify(value),
  );
}

function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getAuthToken(reduxToken) {
  return (
    reduxToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      typeof payload === "string"
        ? payload || `HTTP ${res.status}`
        : JSON.stringify(payload),
    );
  }

  return payload;
}

async function getUserEnrollmentByCourse({ courseId, userId, token }) {
  const payload = await fetchJson(
    `${API_BASE}/api/enrollments/user/${userId}?page=0&size=10&sortBy=createdAt&direction=desc`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const items = toList(payload);
  return (
    items.find((item) => {
      const itemCourseId =
        item?.courseId ??
        item?.course?.id ??
        item?.course?.courseId ??
        item?.course_id;
      return String(itemCourseId) === String(courseId);
    }) || null
  );
}

async function createEnrollment({ courseId, userId, token }) {
  const payloads = [
    { courseId },
    { courseId: Number(courseId) },
    { userId, courseId },
    { userId: Number(userId), courseId: Number(courseId) },
  ];

  for (const body of payloads) {
    try {
      return await fetchJson(`${API_BASE}/api/enrollments`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch {
      // try next payload shape
    }
  }

  throw new Error("មិនអាចបង្កើត enrollment បាន");
}

async function completeEnrollment({ enrollmentId, token }) {
  const endpoints = [
    `${API_BASE}/api/enrollments/${enrollmentId}/complete`,
    `${API_BASE}/enrollments/${enrollmentId}/complete`,
  ];

  for (const url of endpoints) {
    try {
      return await fetchJson(url, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // try next endpoint
    }
  }

  throw new Error("មិនអាច complete enrollment បាន");
}

export default function EnrollmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth || {});
  const reduxUser = auth?.user || null;
  const reduxToken = auth?.token || "";

  const storedUser = useMemo(() => getStoredUser(), []);
  const token = useMemo(() => getAuthToken(reduxToken), [reduxToken]);

  const user = reduxUser || storedUser || null;
  const userId = user?.id || user?.userId || "";
  const derivedName = splitName(getDisplayName(user));

  const [form, setForm] = useState({
    firstName: derivedName.firstName,
    lastName: derivedName.lastName,
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || user?.phone || "",
  });
  const [courseTitle, setCourseTitle] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !courseId) return;
    const saved = loadEnrollmentForm(userId, courseId);
    if (saved) {
      setForm((prev) => ({ ...prev, ...saved }));
    }
  }, [userId, courseId]);

  useEffect(() => {
    let active = true;

    const loadCourse = async () => {
      if (!courseId) {
        setLoadingCourse(false);
        return;
      }

      setLoadingCourse(true);
      try {
        const payload = await fetchJson(`${API_BASE}/api/courses/${courseId}`, {
          headers: { Accept: "application/json" },
        });
        if (active) {
          setCourseTitle(
            payload?.courseTitle || payload?.title || `Course ${courseId}`,
          );
        }
      } catch {
        if (active) {
          setCourseTitle(`Course ${courseId}`);
        }
      } finally {
        if (active) {
          setLoadingCourse(false);
        }
      }
    };

    loadCourse();
    return () => {
      active = false;
    };
  }, [courseId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token || !userId) {
      toast.error("សូមចូលគណនីជាមុនសិន");
      navigate("/login");
      return;
    }

    if (!courseId) {
      setError("រកមិនឃើញ course id");
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("សូមបំពេញ First Name, Last Name និង Email");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      saveEnrollmentForm(userId, courseId, {
        ...form,
        userId,
        courseId,
        savedAt: new Date().toISOString(),
      });

      let enrollment = await getUserEnrollmentByCourse({
        courseId,
        userId,
        token,
      });

      if (!enrollment) {
        enrollment = await createEnrollment({ courseId, userId, token });
      }

      const enrollmentId =
        enrollment?.id ??
        enrollment?.enrollmentId ??
        enrollment?.data?.id ??
        enrollment?.data?.enrollmentId;

      if (!enrollmentId) {
        throw new Error("Cannot resolve enrollment id");
      }

      await completeEnrollment({ enrollmentId, token });
      toast.success("Enrollment completed");
      navigate(`/certificate/${courseId}`);
    } catch (err) {
      setError(err?.message || "មិនអាច complete enrollment បាន");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !userId) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#112d4f]">Complete Enrollment</h1>
          <p className="mt-4 text-slate-500">សូមចូលគណនីជាមុនសិន ដើម្បីបន្ត</p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-[#4477ce] px-5 py-3 font-semibold text-white"
          >
            ទៅកាន់ Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#112d51]">
           បំពេញព័ត៌មានសម្រាប់វិញ្ញាបនបត្រ (Certificate)
          </h1>
          <p className="mt-3 text-slate-500">
            បំពេញព័ត៌មានរបស់អ្នកសិនមុនទទួលបាន Certificate។
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            មុខវិជ្ជា: {loadingCourse ? "កំពុងផ្ទុក..." : courseTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              ឈ្មោះ (First Name)
            </span>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4477ce]"
              placeholder="First name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              នាមត្រកូល (Last Name)
            </span>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4477ce]"
              placeholder="Last name"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4477ce]"
              placeholder="Email address"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </span>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4477ce]"
              placeholder="Phone number"
            />
          </label>

          {error && (
            <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "កំពុងដំណើរការ..." : "Complete Enrollment"}
            </button>

            <Link
              to={`/coursedetail/${courseId}`}
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
            >
              ត្រឡប់ទៅ Course
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
