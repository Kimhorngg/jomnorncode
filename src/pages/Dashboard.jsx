import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import jomnornCodeLogo from "../assets/jomnorncode_logo.png";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "courses",
    label: "Course Management",
    icon: BookOpen,
    children: [
      { id: "all-courses", label: "All Courses" },
      { id: "create-course", label: "Create Lesson" },
      { id: "lessons-documents", label: "Lesson" },
    ],
  },
  {
    id: "quizzes",
    label: "Quiz Management",
    icon: FileText,
    children: [
      { id: "all-quizzes", label: "All Quizzes" },
      { id: "create-quiz", label: "Create Quiz" },
    ],
  },
  {
    id: "users",
    label: "User & Tracking",
    icon: Users,
    children: [
      { id: "view-users", label: "View Users" },
      { id: "track-progress", label: "Track Progress" },
      { id: "certificates", label: "Certificates" },
    ],
  },
];

const COURSE_PUBLIC_API_CANDIDATES = [
  "https://jomnorncode-api.cheat.casa/api/courses/public?all=true&page=0&size=50",
  "https://jomnorncode-api.cheat.casa/api/api/courses/public?all=true&page=0&size=50",
];

const COURSE_AUTH_API_CANDIDATES = [
  ...COURSE_PUBLIC_API_CANDIDATES,
  "https://jomnorncode-api.cheat.casa/api/api/courses",
];

const USER_API_CANDIDATES = [
  "https://jomnorncode-api.cheat.casa/api/api/users?all=true&page=0&size=200&sortBy=createdAt&direction=desc",
  "https://jomnorncode-api.cheat.casa/api/users?all=true&page=0&size=200&sortBy=createdAt&direction=desc",
];

const ENROLLMENT_API_CANDIDATES = [
  "https://jomnorncode-api.cheat.casa/api/api/enrollments?all=true&page=0&size=500&sortBy=createdAt&direction=desc",
  "https://jomnorncode-api.cheat.casa/api/enrollments?all=true&page=0&size=500&sortBy=createdAt&direction=desc",
];

const extractCourseList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.courses)) return payload.courses;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const extractUserList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

const extractLessonList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.lessons)) return payload.lessons;
  return [];
};

const extractEnrollmentList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};

const extractCertificateList = (payload) => {
  // Certificates might come back as array or wrapped in data/content/items
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.certificates)) return payload.certificates;
  // If it's a single object that looks like a certificate, wrap it
  if (payload?.userId || payload?.courseId) return [payload];
  return [];
};

const isAdminUser = (user) => {
  const roleValue =
    user?.role ??
    user?.userRole ??
    user?.authorities?.[0]?.authority ??
    user?.authorities?.[0] ??
    user?.roles?.[0]?.name ??
    user?.roles?.[0] ??
    "";

  return String(roleValue).toLowerCase().includes("admin");
};

const getCourseLessonCount = (course) => {
  const value =
    course?.dashboardLessonCount ??
    course?.lessonCount ??
    course?.lessonsCount ??
    course?.lesson_count ??
    course?.totalLessons ??
    course?.lessonTotal ??
    course?.lessons?.length ??
    course?.orderedLessons?.length ??
    0;

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const buildStatCards = (totalCourses, activeStudents, totalQuizzes) => [
  {
    label: "Total Courses",
    value: String(totalCourses),
    note: "Live total from course page",
    icon: BookOpen,
    iconClass: "bg-sky-100 text-sky-600",
  },
  {
    label: "Active Students",
    value: String(activeStudents),
    note: "Signed up users except admin",
    icon: GraduationCap,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Published Quizzes",
    value: String(totalQuizzes),
    note: "Based on total lesson count",
    icon: FileText,
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    label: "Certificates",
    value: "832",
    note: "124 issued this week",
    icon: ShieldCheck,
    iconClass: "bg-indigo-100 text-indigo-600",
  },
];

const statusClassNames = {
  Published: "bg-emerald-100 text-emerald-600",
  Draft: "bg-amber-100 text-amber-600",
  Live: "bg-sky-100 text-sky-600",
  Issued: "bg-indigo-100 text-indigo-600",
  Pending: "bg-slate-200 text-slate-600",
};

const getAuthToken = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    import.meta.env.VITE_API_TOKEN;
  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const now = Math.floor(Date.now() / 1000);
    if (payload?.exp && now >= payload.exp) return null;
  } catch {
    return token;
  }

  return token;
};

const resolveCourseId = (course) =>
  course?.courseId ?? course?.id ?? course?.course_id ?? course?.courseID;

const resolveCourseTitle = (course) =>
  course?.courseTitle ??
  course?.title ??
  course?.course_name ??
  course?.courseName ??
  "Untitled Course";

const resolveCourseStatus = (course) =>
  course?.status ?? course?.courseStatus ?? "Published";

const resolveCourseCategory = (course) =>
  course?.category?.name ??
  course?.categoryName ??
  course?.category ??
  "Course";

const resolveCourseStudents = (course) =>
  Number(
    course?.dashboardStudentCount ??
      course?.students ??
      course?.studentCount ??
      course?.totalStudents ??
      0,
  );

const getEnrollmentCourseId = (enrollment) =>
  enrollment?.courseId ??
  enrollment?.course?.id ??
  enrollment?.course?.courseId ??
  enrollment?.course_id ??
  null;

const getEnrollmentUserId = (enrollment) =>
  enrollment?.userId ??
  enrollment?.user?.id ??
  enrollment?.student?.id ??
  enrollment?.user_id ??
  null;

const hasTrackedCourseActivity = (enrollment) => {
  const progress =
    enrollment?.progress ??
    enrollment?.progressPercent ??
    enrollment?.progressPercentage ??
    enrollment?.completionPercent ??
    enrollment?.completionPercentage ??
    0;

  const status = String(enrollment?.status || "").toLowerCase();

  return (
    Number(progress) > 0 ||
    enrollment?.completed === true ||
    enrollment?.isCompleted === true ||
    status === "completed" ||
    status === "in_progress" ||
    status === "active"
  );
};

const resolveCourseUpdatedAt = (course) => {
  const raw =
    course?.updatedAt ??
    course?.modifiedAt ??
    course?.createdAt ??
    course?.date;
  if (!raw) return "Recently updated";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Recently updated";

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function useDashboardCourses() {
  const [courseItems, setCourseItems] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    const apiCandidates = token
      ? COURSE_AUTH_API_CANDIDATES
      : COURSE_PUBLIC_API_CANDIDATES;

    const fetchJson = async (url) => {
      const authHeaders = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let response = await fetch(url, { method: "GET", headers: authHeaders });
      if ((response.status === 401 || response.status === 403) && token) {
        response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} on ${url}`);
      }

      return response.json();
    };

    const fetchLessonCountForCourse = async (courseId) => {
      const lessonEndpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
      ];

      for (const url of lessonEndpoints) {
        try {
          const payload = await fetchJson(url);
          const lessons = extractLessonList(payload);
          if (lessons.length) return lessons.length;
        } catch {
          // Try the next lesson endpoint.
        }
      }

      return 0;
    };

    const fetchCourses = async () => {
      for (const url of apiCandidates) {
        try {
          const payload = await fetchJson(url);
          const list = extractCourseList(payload);
          if (!list.length) continue;

          let enrollments = [];
          for (const enrollmentUrl of ENROLLMENT_API_CANDIDATES) {
            try {
              const enrollmentPayload = await fetchJson(enrollmentUrl);
              const enrollmentList = extractEnrollmentList(enrollmentPayload);
              if (enrollmentList.length) {
                enrollments = enrollmentList;
                break;
              }
            } catch {
              // Try the next enrollments endpoint.
            }
          }

          const enrichedCourses = await Promise.all(
            list.map(async (course) => {
              const courseId = resolveCourseId(course);
              const uniqueStudents = new Set(
                enrollments
                  .filter((enrollment) => {
                    const enrollmentCourseId =
                      getEnrollmentCourseId(enrollment);
                    const enrollmentUserId = getEnrollmentUserId(enrollment);

                    return (
                      String(enrollmentCourseId) === String(courseId) &&
                      enrollmentUserId != null &&
                      hasTrackedCourseActivity(enrollment)
                    );
                  })
                  .map((enrollment) => String(getEnrollmentUserId(enrollment))),
              );

              const existingLessonCount = getCourseLessonCount(course);
              if (existingLessonCount > 0) {
                return {
                  ...course,
                  dashboardLessonCount: existingLessonCount,
                  dashboardStudentCount: uniqueStudents.size,
                };
              }

              const fetchedLessonCount = courseId
                ? await fetchLessonCountForCourse(courseId)
                : 0;

              return {
                ...course,
                dashboardLessonCount: fetchedLessonCount,
                dashboardStudentCount: uniqueStudents.size,
              };
            }),
          );

          setCourseItems(enrichedCourses);
          setTotalCourses(enrichedCourses.length);
          setTotalQuizzes(
            enrichedCourses.reduce(
              (sum, course) => sum + getCourseLessonCount(course),
              0,
            ),
          );

          return;
        } catch {
          // Try the next candidate URL.
        }
      }
    };

    fetchCourses();
  }, []);

  return { courseItems, totalCourses, totalQuizzes };
}

function AdminNavButton({
  activeSection,
  activeSubSection,
  item,
  mobile = false,
  onSelect,
  onSelectChild,
  openSection,
}) {
  const Icon = item.icon;
  const isActive = activeSection === item.id;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`w-full rounded-2xl px-4 py-3 text-left transition ${
          isActive
            ? "bg-[#151f31] text-white shadow-[0_14px_30px_rgba(4,10,24,0.35)]"
            : "text-slate-300 hover:bg-[#151f31] hover:text-white"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-semibold">{item.label}</span>
          </div>
          {item.children ? (
            <ChevronDown
              className={`h-4 w-4 transition ${openSection ? "rotate-180" : ""}`}
            />
          ) : null}
        </div>
      </button>

      {item.children && openSection ? (
        <div
          className={`mt-3 space-y-2 border-l border-slate-700/70 pl-7 ${
            mobile ? "pr-2" : ""
          }`}
        >
          {item.children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelectChild(item.id, child.id);
              }}
              className={`block w-full rounded-xl px-3 py-2 text-left text-xs transition ${
                activeSubSection === child.id
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {child.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DashboardSection() {
  const { totalCourses, totalQuizzes } = useDashboardCourses();
  const [activeStudents, setActiveStudents] = useState(1247);

  useEffect(() => {
    const fetchStudentCount = async () => {
      const token = getAuthToken();

      const fetchJson = async (url) => {
        const authHeaders = {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        let response = await fetch(url, {
          method: "GET",
          headers: authHeaders,
        });
        if ((response.status === 401 || response.status === 403) && token) {
          response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} on ${url}`);
        }

        return response.json();
      };

      for (const url of USER_API_CANDIDATES) {
        try {
          const payload = await fetchJson(url);
          const users = extractUserList(payload);
          if (users.length) {
            setActiveStudents(
              users.filter((user) => !isAdminUser(user)).length,
            );
            return;
          }
        } catch {
          // Try the next users endpoint.
        }
      }
    };

    fetchStudentCount();
  }, []);

  const statCards = buildStatCards(totalCourses, activeStudents, totalQuizzes);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here&apos;s a quick overview of your JomnornCode
          performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-400">
                {card.note}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>
              <p className="text-sm text-slate-500">
                Latest admin actions and platform updates.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseSection({ activeSubSection, onChangeSubSection }) {
  const selectedCourse = activeSubSection || "all-courses";

  const { courseItems } = useDashboardCourses();
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    courseCode: "",
    courseTitle: "",
    description: "",
    categoryId: "",
    thumbnailUrl: "",
    price: "",
    discountPercentage: "",
    isPublished: true,
  });

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseName: "",
    description: "",
    category: "",
  });
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessonFormData, setLessonFormData] = useState({
    title: "",
    description: "",
  });
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [courseLessons, setCourseLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState(null);
  const [editLessonFormData, setEditLessonFormData] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    duration: 0,
    sequenceNumber: 0,
  });
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [showDeleteLessonConfirm, setShowDeleteLessonConfirm] = useState(null);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCourse, setSearchCourse] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://jomnorncode-api.cheat.casa/api/api/categories?page=0&size=100&sortBy=createdAt&direction=desc",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          },
        );

        const data = await res.json();
        setCategories(data.content || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleCreateCourse = async () => {
    if (!createFormData.courseCode || !createFormData.courseTitle) {
      toast.error("Please fill in all required fields (Course Code & Title)");
      return;
    }

    setIsCreatingCourse(true);
    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        courseCode: createFormData.courseCode.trim(),
        courseTitle: createFormData.courseTitle.trim(),
        description: createFormData.description.trim(),
        categoryId: parseInt(createFormData.categoryId) || 0,
        thumbnailUrl: createFormData.thumbnailUrl.trim(),
        price: parseFloat(createFormData.price) || 0,
        discountPercentage: parseFloat(createFormData.discountPercentage) || 0,
        isPublished: createFormData.isPublished,
      };

      const endpoints = [
        "https://jomnorncode-api.cheat.casa/api/api/courses",
        "https://jomnorncode-api.cheat.casa/api/courses",
      ];

      let success = false;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const result = await response.json();
            toast.success("Course created successfully!");
            setCreateFormData({
              courseCode: "",
              courseTitle: "",
              description: "",
              categoryId: "",
              thumbnailUrl: "",
              price: "",
              discountPercentage: "",
              isPublished: true,
            });
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to create course. Please try again.");
      }
    } catch (err) {
      console.error("Create course error:", err);
      toast.error(err?.message || "Error creating course");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourseForEdit(course);
    setFormData({
      courseTitle: resolveCourseTitle(course),
      courseName: course?.courseName || "",
      description: course?.description || "",
      category: resolveCourseCategory(course),
    });
  };

  const handleSaveCourse = async () => {
    if (!selectedCourseForEdit || !formData.courseTitle) {
      toast.error("Course title is required");
      return;
    }

    const courseId = resolveCourseId(selectedCourseForEdit);
    if (!courseId) {
      toast.error("Course ID not found");
      return;
    }

    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        courseTitle: formData.courseTitle.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/courses/${courseId}`,
        `https://jomnorncode-api.cheat.casa/api/courses/${courseId}`,
      ];

      let success = false;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success("Course updated successfully");
            setSelectedCourseForEdit(null);
            setFormData({
              courseTitle: "",
              courseName: "",
              description: "",
              category: "",
            });
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to update course. Please try again.");
      }
    } catch (err) {
      console.error("Save course error:", err);
      toast.error(err?.message || "Error updating course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      toast.error("Course ID not found");
      return;
    }

    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/courses/${courseId}`,
        `https://jomnorncode-api.cheat.casa/api/courses/${courseId}`,
      ];

      let success = false;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers,
          });

          if (response.ok) {
            toast.success("Course deleted successfully");
            setShowDeleteConfirm(null);
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to delete course. Please try again.");
      }
    } catch (err) {
      console.error("Delete course error:", err);
      toast.error(err?.message || "Error deleting course");
    }
  };

  const handleManageLessons = (course) => {
    setSelectedCourseForEdit(course);
    onChangeSubSection?.("lessons-documents");
    fetchCourseLessons(resolveCourseId(course));
  };

  const fetchCourseLessons = async (courseId) => {
    if (!courseId) return;

    setLoadingLessons(true);
    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
        `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, { headers });
          if (response.ok) {
            const data = await response.json();
            const lessons = extractLessonList(data);
            setCourseLessons(lessons);
            setLoadingLessons(false);
            return;
          }
        } catch (err) {
          console.error(`Error fetching lessons from ${url}:`, err);
        }
      }

      setCourseLessons([]);
      setLoadingLessons(false);
    } catch (err) {
      console.error("Fetch lessons error:", err);
      setCourseLessons([]);
      setLoadingLessons(false);
    }
  };

  const handleAddLesson = async () => {
    if (!lessonFormData.title || !selectedCourseForEdit) {
      toast.error("Lesson title is required");
      return;
    }

    const courseId = resolveCourseId(selectedCourseForEdit);
    if (!courseId) {
      toast.error("Course ID not found");
      return;
    }

    setIsAddingLesson(true);
    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: lessonFormData.title.trim(),
        description: lessonFormData.description.trim(),
        courseId: parseInt(courseId),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons`,
        `https://jomnorncode-api.cheat.casa/api/api/lessons`,
      ];

      let success = false;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success("Lesson added successfully");
            setLessonFormData({ title: "", description: "" });
            setShowAddLessonModal(false);
            // Refresh lessons list
            await fetchCourseLessons(courseId);
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to add lesson. Please try again.");
      }
    } catch (err) {
      console.error("Add lesson error:", err);
      toast.error(err?.message || "Error adding lesson");
    } finally {
      setIsAddingLesson(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setSelectedLessonForEdit(lesson);
    setEditLessonFormData({
      title: lesson?.title || lesson?.lessonTitle || "",
      description: lesson?.description || "",
      content: lesson?.content || "",
      videoUrl: lesson?.videoUrl || "",
      duration: lesson?.duration || 0,
      sequenceNumber: lesson?.sequenceNumber || 0,
    });
  };

  const handleSaveLesson = async () => {
    if (!selectedLessonForEdit || !editLessonFormData.title) {
      toast.error("Lesson title is required");
      return;
    }

    const lessonId =
      selectedLessonForEdit?.id || selectedLessonForEdit?.lessonId;
    const courseId = resolveCourseId(selectedCourseForEdit);

    if (!lessonId || !courseId) {
      toast.error("Lesson or Course ID not found");
      return;
    }

    setIsEditingLesson(true);
    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: editLessonFormData.title.trim(),
        description: editLessonFormData.description.trim(),
        content: editLessonFormData.content.trim(),
        videoUrl: editLessonFormData.videoUrl.trim(),
        duration: parseInt(editLessonFormData.duration) || 0,
        sequenceNumber: parseInt(editLessonFormData.sequenceNumber) || 0,
        courseId: parseInt(courseId),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/${lessonId}`,
        `https://jomnorncode-api.cheat.casa/api/lessons/${lessonId}`,
      ];

      let success = false;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success("Lesson updated successfully");
            setSelectedLessonForEdit(null);
            setEditLessonFormData({
              title: "",
              description: "",
              content: "",
              videoUrl: "",
              duration: 0,
              sequenceNumber: 0,
            });
            await fetchCourseLessons(courseId);
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to update lesson. Please try again.");
      }
    } catch (err) {
      console.error("Save lesson error:", err);
      toast.error(err?.message || "Error updating lesson");
    } finally {
      setIsEditingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!lessonId) {
      toast.error("Lesson ID not found");
      return;
    }

    const courseId = resolveCourseId(selectedCourseForEdit);
    if (!courseId) {
      toast.error("Course ID not found");
      return;
    }

    setIsDeletingLesson(true);
    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/lessons/${lessonId}`,
        `https://jomnorncode-api.cheat.casa/api/lessons/${lessonId}`,
      ];

      let success = false;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers,
          });

          if (response.ok) {
            toast.success("Lesson deleted successfully");
            setShowDeleteLessonConfirm(null);
            await fetchCourseLessons(courseId);
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to delete lesson. Please try again.");
      }
    } catch (err) {
      console.error("Delete lesson error:", err);
      toast.error(err?.message || "Error deleting lesson");
    } finally {
      setIsDeletingLesson(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Course Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, and manage your courses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangeSubSection?.("create-course")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {navItems
          .find((item) => item.id === "courses")
          ?.children?.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => onChangeSubSection?.(child.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                selectedCourse === child.id
                  ? "bg-sky-500 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-sky-500 hover:text-sky-500"
              }`}
            >
              {child.label}
            </button>
          ))}
      </div>

      {/* Create Course Section */}
      {selectedCourse === "create-course" ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Create New Course
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Course Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., CS101"
                  value={createFormData.courseCode}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      courseCode: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Course Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter course title"
                  value={createFormData.courseTitle}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      courseTitle: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Category ID
                </label>
                <select
                  value={createFormData.categoryId}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      categoryId: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  placeholder="Enter thumbnail URL"
                  value={createFormData.thumbnailUrl}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      thumbnailUrl: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={createFormData.price}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      price: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Discount %
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={createFormData.discountPercentage}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      discountPercentage: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter course description"
                  rows="4"
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createFormData.isPublished}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        isPublished: e.target.checked,
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Publish course
                  </span>
                </label>
              </div>
              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={handleCreateCourse}
                  disabled={isCreatingCourse}
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingCourse ? "Creating..." : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateFormData({
                      courseCode: "",
                      courseTitle: "",
                      description: "",
                      categoryId: "",
                      thumbnailUrl: "",
                      price: "",
                      discountPercentage: "",
                      isPublished: true,
                    });
                    onChangeSubSection?.("all-courses");
                  }}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Existing Courses
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {courseItems.map((course, index) => (
                <div
                  key={resolveCourseId(course) ?? `course-card-${index}`}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-500">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {resolveCourseTitle(course)}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {resolveCourseCategory(course)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusClassNames[resolveCourseStatus(course)] ||
                        "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {resolveCourseStatus(course)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">Lessons</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {getCourseLessonCount(course)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">Students</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {resolveCourseStudents(course)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs text-slate-400">Updated</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {resolveCourseUpdatedAt(course)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm text-slate-400">Live course data</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditCourse(course)}
                        className="rounded-lg bg-sky-100 px-2.5 py-1.5 text-slate-400 transition hover:bg-sky-200 hover:text-sky-500"
                        title="Edit Course"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setShowDeleteConfirm(resolveCourseId(course))
                        }
                        className="rounded-lg bg-rose-100 px-2.5 py-1.5 text-slate-400 transition hover:bg-rose-200 hover:text-rose-500"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* All Courses - Table View */}
      {selectedCourse === "all-courses" ? (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by name or description..."
              value={searchCourse}
              onChange={(e) => setSearchCourse(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
            {searchCourse && (
              <button
                onClick={() => setSearchCourse("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Courses Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Lessons</th>
                    <th className="px-5 py-4 font-semibold">Students</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courseItems
                    .filter((course) => {
                      const title = resolveCourseTitle(course).toLowerCase();
                      const description = (
                        course?.description || ""
                      ).toLowerCase();
                      const search = searchCourse.toLowerCase();
                      return (
                        title.includes(search) || description.includes(search)
                      );
                    })
                    .map((course, index) => (
                      <tr
                        key={resolveCourseId(course) ?? `course-row-${index}`}
                        className="border-t border-slate-100 text-sm text-slate-600"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-500">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-slate-800">
                              {resolveCourseTitle(course)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          {getCourseLessonCount(course)}
                        </td>
                        <td className="px-5 py-5">
                          {resolveCourseStudents(course)}
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusClassNames[resolveCourseStatus(course)] ||
                              "bg-emerald-100 text-emerald-600"
                            }`}
                          >
                            {resolveCourseStatus(course)}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleManageLessons(course)}
                              className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-200"
                              title="Manage Lessons"
                            >
                              Lessons
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditCourse(course)}
                              className="text-slate-400 transition hover:text-sky-500"
                              title="Edit Course"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setShowDeleteConfirm(resolveCourseId(course))
                              }
                              className="text-slate-400 transition hover:text-rose-500"
                              title="Delete Course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* Lessons & Documents Management */}
      {selectedCourse === "lessons-documents" && selectedCourseForEdit ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Lesson & Document Management
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Course:{" "}
                <span className="font-semibold">
                  {resolveCourseTitle(selectedCourseForEdit)}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangeSubSection?.("all-courses")}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Courses
            </button>
          </div>

          {/* Lessons List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                Course Lessons
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLessonModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                <Plus className="h-4 w-4" />
                Create Lesson
              </button>
            </div>
            {loadingLessons ? (
              <p className="text-center text-slate-500">កំពុងទាញយក...</p>
            ) : courseLessons.length === 0 ? (
              <p className="text-center text-slate-500">
                មិនមានមេរៀនទេ។ សូមបន្ថែមលម្អិត!
              </p>
            ) : (
              <div className="space-y-3">
                {courseLessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {lesson?.lessonTitle ||
                          lesson?.title ||
                          `Lesson ${idx + 1}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        {lesson?.description || "No description"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditLesson(lesson)}
                        className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-600 transition hover:bg-amber-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setShowDeleteLessonConfirm(
                            lesson?.id || lesson?.lessonId,
                          )
                        }
                        className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Edit Course Modal */}
      {selectedCourseForEdit && selectedCourse === "all-courses" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              Edit Course
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Course Title
                </label>
                <input
                  type="text"
                  value={formData.courseTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, courseTitle: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveCourse}
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCourseForEdit(null)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              Delete Course
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDeleteCourse(showDeleteConfirm)}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add Lesson Modal */}
      {showAddLessonModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              Create New Lesson
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter lesson title"
                  value={lessonFormData.title}
                  onChange={(e) =>
                    setLessonFormData({
                      ...lessonFormData,
                      title: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter lesson description"
                  rows="3"
                  value={lessonFormData.description}
                  onChange={(e) =>
                    setLessonFormData({
                      ...lessonFormData,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleAddLesson}
                  disabled={isAddingLesson}
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingLesson ? "Creating..." : "Create Lesson"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLessonFormData({ title: "", description: "" });
                    setShowAddLessonModal(false);
                  }}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit Lesson Modal */}
      {selectedLessonForEdit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold text-slate-900">
              Edit Lesson
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={editLessonFormData.title}
                  onChange={(e) =>
                    setEditLessonFormData({
                      ...editLessonFormData,
                      title: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editLessonFormData.description}
                  onChange={(e) =>
                    setEditLessonFormData({
                      ...editLessonFormData,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Content
                </label>
                <textarea
                  rows="3"
                  value={editLessonFormData.content}
                  onChange={(e) =>
                    setEditLessonFormData({
                      ...editLessonFormData,
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter lesson content"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Video URL
                </label>
                <input
                  type="text"
                  value={editLessonFormData.videoUrl}
                  onChange={(e) =>
                    setEditLessonFormData({
                      ...editLessonFormData,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="Enter video URL"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={editLessonFormData.duration}
                    onChange={(e) =>
                      setEditLessonFormData({
                        ...editLessonFormData,
                        duration: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Sequence Number
                  </label>
                  <input
                    type="number"
                    value={editLessonFormData.sequenceNumber}
                    onChange={(e) =>
                      setEditLessonFormData({
                        ...editLessonFormData,
                        sequenceNumber: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveLesson}
                  disabled={isEditingLesson}
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditingLesson ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLessonForEdit(null)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Lesson Confirmation Modal */}
      {showDeleteLessonConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              Delete Lesson
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Are you sure you want to delete this lesson? This action cannot be
              undone and all associated content will be removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDeleteLesson(showDeleteLessonConfirm)}
                disabled={isDeletingLesson}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingLesson ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteLessonConfirm(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function QuizSection({ activeSubSection, onChangeSubSection }) {
  const selectedQuizSection = activeSubSection || "all-quizzes";

  const [quizItems, setQuizItems] = useState([]);
  const [selectedQuizForEdit, setSelectedQuizForEdit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    passingScore: "",
    timeLimit: "",
    lessonId: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    passingScore: "",
    timeLimit: "",
    lessonId: "",
  });

  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [isUpdatingQuiz, setIsUpdatingQuiz] = useState(false);
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  };

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuiz, setSearchQuiz] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://jomnorncode-api.cheat.casa/api/api/lessons?paginated=true&page=0&size=100&sortBy=createdAt&direction=desc",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          },
        );

        const data = await res.json();
        setLessons(data.content || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);

    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const endpoints = [
        "https://jomnorncode-api.cheat.casa/api/api/quizzes?page=0&size=10&sortBy=createdAt&direction=desc",
        "https://jomnorncode-api.cheat.casa/api/quizzes?page=0&size=10&sortBy=createdAt&direction=desc",
      ];

      let success = false;

      for (const url of endpoints) {
        try {
          const response = await fetch(url, { method: "GET", headers });

          if (response.ok) {
            const data = await response.json();
            setQuizItems(data?.content || data?.data || data || []);
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error fetching quizzes from ${url}:`, err);
        }
      }

      if (!success) {
        setQuizItems([]);
      }
    } catch (error) {
      console.error("Fetch quizzes error:", error);
      setQuizItems([]);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const resolveQuizId = (quiz) => quiz?.id || quiz?.quizId || quiz?._id || null;

  const resolveQuizTitle = (quiz) =>
    quiz?.title || quiz?.quizTitle || "Untitled Quiz";

  const resolveQuizDescription = (quiz) =>
    quiz?.description || "No description";

  const resolvePassingScore = (quiz) =>
    quiz?.passingScore ?? quiz?.passScore ?? 0;

  const resolveTimeLimit = (quiz) => quiz?.timeLimit ?? quiz?.duration ?? 0;

  const resolveLessonId = (quiz) => quiz?.lessonId ?? quiz?.lesson?.id ?? "";

  const resolveQuizStatus = (quiz) => {
    if (quiz?.isPublished === true) return "Published";
    if (quiz?.isPublished === false) return "Draft";
    return "Active";
  };

  const resolveQuizUpdatedAt = (quiz) => {
    const rawDate = quiz?.updatedAt || quiz?.createdAt;
    if (!rawDate) return "N/A";

    try {
      return new Date(rawDate).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const statusClassNames = {
    Published: "bg-emerald-100 text-emerald-600",
    Draft: "bg-amber-100 text-amber-600",
    Active: "bg-sky-100 text-sky-600",
  };

  const handleCreateQuiz = async () => {
    if (
      !createFormData.title ||
      !createFormData.lessonId ||
      createFormData.passingScore === "" ||
      createFormData.timeLimit === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreatingQuiz(true);

    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: createFormData.title.trim(),
        description: createFormData.description.trim(),
        passingScore: Number(createFormData.passingScore) || 0,
        timeLimit: Number(createFormData.timeLimit) || 0,
        lessonId: Number(createFormData.lessonId) || 0,
      };

      const endpoints = [
        "https://jomnorncode-api.cheat.casa/api/api/quizzes",
        "https://jomnorncode-api.cheat.casa/api/quizzes",
      ];

      let success = false;

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success("Quiz created successfully!");
            setCreateFormData({
              title: "",
              description: "",
              passingScore: "",
              timeLimit: "",
              lessonId: "",
            });
            await fetchQuizzes();
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error creating quiz with ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to create quiz. Please try again.");
      }
    } catch (err) {
      console.error("Create quiz error:", err);
      toast.error(err?.message || "Error creating quiz");
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuizForEdit(quiz);
    setFormData({
      title: resolveQuizTitle(quiz),
      description: resolveQuizDescription(quiz),
      passingScore: String(resolvePassingScore(quiz)),
      timeLimit: String(resolveTimeLimit(quiz)),
      lessonId: String(resolveLessonId(quiz)),
    });
  };

  const handleSaveQuiz = async () => {
    if (!selectedQuizForEdit || !formData.title) {
      toast.error("Quiz title is required");
      return;
    }

    const quizId = resolveQuizId(selectedQuizForEdit);
    if (!quizId) {
      toast.error("Quiz ID not found");
      return;
    }

    setIsUpdatingQuiz(true);

    try {
      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        passingScore: Number(formData.passingScore) || 0,
        timeLimit: Number(formData.timeLimit) || 0,
        lessonId: Number(formData.lessonId) || 0,
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/quizzes/${quizId}`,
        `https://jomnorncode-api.cheat.casa/api/quizzes/${quizId}`,
      ];

      let success = false;

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            toast.success("Quiz updated successfully");
            setSelectedQuizForEdit(null);
            setFormData({
              title: "",
              description: "",
              passingScore: "",
              timeLimit: "",
              lessonId: "",
            });
            await fetchQuizzes();
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error updating quiz with ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to update quiz. Please try again.");
      }
    } catch (err) {
      console.error("Save quiz error:", err);
      toast.error(err?.message || "Error updating quiz");
    } finally {
      setIsUpdatingQuiz(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!quizId) {
      toast.error("Quiz ID not found");
      return;
    }

    setIsDeletingQuiz(true);

    try {
      const token = getAuthToken();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const endpoints = [
        `https://jomnorncode-api.cheat.casa/api/api/quizzes/${quizId}`,
        `https://jomnorncode-api.cheat.casa/api/quizzes/${quizId}`,
      ];

      let success = false;

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers,
          });

          if (response.ok) {
            toast.success("Quiz deleted successfully");
            setShowDeleteConfirm(null);
            await fetchQuizzes();
            success = true;
            break;
          }
        } catch (err) {
          console.error(`Error deleting quiz with ${url}:`, err);
        }
      }

      if (!success) {
        toast.error("Failed to delete quiz. Please try again.");
      }
    } catch (err) {
      console.error("Delete quiz error:", err);
      toast.error(err?.message || "Error deleting quiz");
    } finally {
      setIsDeletingQuiz(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Quiz Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, and manage your quizzes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChangeSubSection?.("create-quiz")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onChangeSubSection?.("all-quizzes")}
          className={`rounded-full px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
            selectedQuizSection === "all-quizzes"
              ? "bg-sky-500 text-white"
              : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-sky-500 hover:text-sky-500"
          }`}
        >
          All Quizzes
        </button>

        <button
          type="button"
          onClick={() => onChangeSubSection?.("create-quiz")}
          className={`rounded-full px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
            selectedQuizSection === "create-quiz"
              ? "bg-sky-500 text-white"
              : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-sky-500 hover:text-sky-500"
          }`}
        >
          Create Quiz
        </button>
      </div>

      {selectedQuizSection === "create-quiz" ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Create New Quiz
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter quiz title"
                  value={createFormData.title}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      title: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Lesson ID *
                </label>
                <select
                  value={createFormData.lessonId}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      lessonId: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select lesson</option>

                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Passing Score *
                </label>
                <input
                  type="number"
                  placeholder="Enter passing score"
                  value={createFormData.passingScore}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      passingScore: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Time Limit (minutes) *
                </label>
                <input
                  type="number"
                  placeholder="Enter time limit"
                  value={createFormData.timeLimit}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      timeLimit: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter quiz description"
                  rows="4"
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={handleCreateQuiz}
                  disabled={isCreatingQuiz}
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingQuiz ? "Creating..." : "Create Quiz"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateFormData({
                      title: "",
                      description: "",
                      passingScore: "",
                      timeLimit: "",
                      lessonId: "",
                    });
                    onChangeSubSection?.("all-quizzes");
                  }}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedQuizSection === "all-quizzes" ? (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search quizzes by title..."
              value={searchQuiz}
              onChange={(e) => setSearchQuiz(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
            {searchQuiz && (
              <button
                onClick={() => setSearchQuiz("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quizzes Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Quiz</th>
                    <th className="px-5 py-4 font-semibold">Passing Score</th>
                    <th className="px-5 py-4 font-semibold">Time Limit</th>
                    <th className="px-5 py-4 font-semibold">Lesson ID</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loadingQuizzes ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-8 text-center text-sm text-slate-500"
                      >
                        Loading quizzes...
                      </td>
                    </tr>
                  ) : quizItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-8 text-center text-sm text-slate-500"
                      >
                        No quizzes found.
                      </td>
                    </tr>
                  ) : (
                    quizItems
                      .filter((quiz) => {
                        const title = resolveQuizTitle(quiz).toLowerCase();
                        const search = searchQuiz.toLowerCase();
                        return title.includes(search);
                      })
                      .map((quiz, index) => (
                        <tr
                          key={resolveQuizId(quiz) ?? `quiz-row-${index}`}
                          className="border-t border-slate-100 text-sm text-slate-600"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-500">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {resolveQuizTitle(quiz)}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {resolveQuizDescription(quiz)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            {resolvePassingScore(quiz)}
                          </td>

                          <td className="px-5 py-5">
                            {resolveTimeLimit(quiz)} min
                          </td>

                          <td className="px-5 py-5">{resolveLessonId(quiz)}</td>

                          <td className="px-5 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                statusClassNames[resolveQuizStatus(quiz)] ||
                                "bg-sky-100 text-sky-600"
                              }`}
                            >
                              {resolveQuizStatus(quiz)}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditQuiz(quiz)}
                                className="text-slate-400 transition hover:text-sky-500"
                                title="Edit Quiz"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setShowDeleteConfirm(resolveQuizId(quiz))
                                }
                                className="text-slate-400 transition hover:text-rose-500"
                                title="Delete Quiz"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {selectedQuizForEdit && selectedQuizSection === "all-quizzes" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Edit Quiz</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Lesson ID
                </label>
                <input
                  type="number"
                  value={formData.lessonId}
                  onChange={(e) =>
                    setFormData({ ...formData, lessonId: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Passing Score
                </label>
                <input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData({ ...formData, passingScore: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Time Limit
                </label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, timeLimit: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveQuiz}
                  disabled={isUpdatingQuiz}
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
                >
                  {isUpdatingQuiz ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedQuizForEdit(null)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              Delete Quiz
            </h3>
            <p className="mb-6 text-sm text-slate-600">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDeleteQuiz(showDeleteConfirm)}
                disabled={isDeletingQuiz}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                {isDeletingQuiz ? "Deleting..." : "Delete"}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// function QuizSection({ activeSubSection, onChangeSubSection }) {
//   const selectedQuizView = activeSubSection || "all-quizzes";
//   const { courseItems } = useDashboardCourses();
//   const [quizRows, setQuizRows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAllQuizzes, setShowAllQuizzes] = useState(false);
//   const quizzesPerPage = 5;

//   useEffect(() => {
//     async function fetchQuizRows() {
//       setLoading(true);
//       const token = getAuthToken();
//       const headers = {
//         Accept: "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       };

//       const extractList = (payload) => {
//         if (Array.isArray(payload)) return payload;
//         if (Array.isArray(payload?.data)) return payload.data;
//         if (Array.isArray(payload?.content)) return payload.content;
//         if (Array.isArray(payload?.items)) return payload.items;
//         if (Array.isArray(payload?.quizzes)) return payload.quizzes;
//         if (Array.isArray(payload?.questions)) return payload.questions;
//         return [];
//       };

//       const formatDate = (value) => {
//         if (!value) return "N/A";
//         const date = new Date(value);
//         if (Number.isNaN(date.getTime())) return "N/A";
//         return date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//       };

//       const getQuizStatus = (quiz) => {
//         const status = String(
//           quiz?.status ?? quiz?.quizStatus ?? "Published",
//         ).toLowerCase();

//         if (status.includes("draft")) return "Draft";
//         return "Published";
//       };

//       const getCourseBadgeClass = (courseTitle) => {
//         const value = String(courseTitle || "").toLowerCase();
//         if (value.includes("react") || value.includes("javascript")) {
//           return "bg-blue-100 text-blue-700";
//         }
//         if (
//           value.includes("design") ||
//           value.includes("ui") ||
//           value.includes("ux")
//         ) {
//           return "bg-violet-100 text-violet-700";
//         }
//         if (value.includes("python") || value.includes("sql")) {
//           return "bg-emerald-100 text-emerald-700";
//         }
//         return "bg-amber-100 text-amber-700";
//       };

//       const getStatusClass = (status) =>
//         status === "Draft"
//           ? "bg-amber-50 text-amber-600"
//           : "bg-emerald-50 text-emerald-600";

//       let results = [];
//       for (const course of courseItems) {
//         const courseId = resolveCourseId(course);
//         if (!courseId) continue;
//         const lessonEndpoints = [
//           `https://jomnorncode-api.cheat.casa/api/api/lessons/course/${courseId}/ordered`,
//           `https://jomnorncode-api.cheat.casa/api/lessons/course/${courseId}/ordered`,
//         ];
//         let lessons = [];
//         for (const url of lessonEndpoints) {
//           try {
//             const res = await fetch(url, { headers });
//             if (!res.ok) continue;
//             const data = await res.json();
//             lessons = extractLessonList(data);
//             if (lessons.length) break;
//           } catch {}
//         }

//         for (const lesson of lessons) {
//           const lessonId = lesson.lessonId || lesson.id;
//           const lessonTitle =
//             lesson.lessonTitle ||
//             lesson.title ||
//             lesson.lesson_name ||
//             "Untitled Lesson";
//           const quizEndpoints = [
//             `https://jomnorncode-api.cheat.casa/api/api/quizzes/lesson/${lessonId}`,
//             `https://jomnorncode-api.cheat.casa/api/quizzes/lesson/${lessonId}`,
//           ];
//           let quizzes = [];
//           for (const url of quizEndpoints) {
//             try {
//               const res = await fetch(url, { headers });
//               if (!res.ok) continue;
//               const quizData = await res.json();
//               quizzes = extractList(quizData);
//               if (quizzes.length) break;
//             } catch {}
//           }

//           for (const quiz of quizzes) {
//             const quizId = quiz?.id ?? quiz?.quizId;
//             let questionCount = 0;

//             if (quizId) {
//               const questionEndpoints = [
//                 `https://jomnorncode-api.cheat.casa/api/api/questions/quiz/${quizId}?page=0&size=100`,
//                 `https://jomnorncode-api.cheat.casa/api/questions/quiz/${quizId}?page=0&size=100`,
//               ];

//               for (const url of questionEndpoints) {
//                 try {
//                   const res = await fetch(url, { headers });
//                   if (!res.ok) continue;
//                   const questionData = await res.json();
//                   const questions = extractList(questionData);
//                   questionCount = questions.length;
//                   break;
//                 } catch {}
//               }
//             }

//             const quizTitle =
//               quiz?.title ??
//               quiz?.quizTitle ??
//               quiz?.name ??
//               `${lessonTitle} Quiz`;

//             const status = getQuizStatus(quiz);

//             results.push({
//               id: quizId ?? `${courseId}-${lessonId}-${quizTitle}`,
//               quizTitle,
//               courseTitle: resolveCourseTitle(course),
//               lessonTitle,
//               questionCount,
//               status,
//               createdAt: formatDate(
//                 quiz?.createdAt ?? quiz?.created_date ?? quiz?.dateCreated,
//               ),
//               courseBadgeClass: getCourseBadgeClass(resolveCourseTitle(course)),
//               statusClass: getStatusClass(status),
//             });
//           }
//         }
//       }

//       results.sort((a, b) => {
//         const dateA = new Date(a.createdAt).getTime();
//         const dateB = new Date(b.createdAt).getTime();
//         if (Number.isNaN(dateA) || Number.isNaN(dateB)) return 0;
//         return dateA - dateB;
//       });

//       setQuizRows(results);
//       setLoading(false);
//     }

//     if (selectedQuizView === "all-quizzes") {
//       fetchQuizRows();
//     }
//   }, [courseItems, selectedQuizView]);

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//           Quiz Management
//         </h1>
//         <p className="mt-1 text-sm text-slate-500">
//           Keep quizzes organized and track passing scores.
//         </p>
//       </div>

//       <div className="flex flex-wrap gap-3">
//         {navItems
//           .find((item) => item.id === "quizzes")
//           ?.children?.map((child) => (
//             <button
//               key={child.id}
//               type="button"
//               onClick={() => onChangeSubSection?.(child.id)}
//               className={`rounded-full px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
//                 selectedQuizView === child.id
//                   ? "bg-sky-500 text-white"
//                   : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-sky-500 hover:text-sky-500"
//               }`}
//             >
//               {child.label}
//             </button>
//           ))}
//       </div>

//       {selectedQuizView === "all-quizzes" ? (
//         loading ? (
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center text-slate-500 shadow-sm">
//             Loading quizzes...
//           </div>
//         ) : quizRows.length === 0 ? (
//           <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center text-slate-500 shadow-sm">
//             No quizzes found.
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left">
//                   <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                     <tr>
//                       <th className="px-6 py-5">Quiz Name</th>
//                       <th className="px-6 py-5">Course</th>
//                       <th className="px-6 py-5">Lesson</th>
//                       <th className="px-6 py-5 text-center">Questions</th>
//                       <th className="px-6 py-5">Status</th>
//                       <th className="px-6 py-5">Created</th>
//                       <th className="px-6 py-5 text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(showAllQuizzes
//                       ? quizRows
//                       : quizRows.slice(0, quizzesPerPage)
//                     ).map((quiz) => (
//                       <tr
//                         key={quiz.id}
//                         className="border-t border-slate-200 text-sm text-slate-600"
//                       >
//                         <td className="px-6 py-6">
//                           <div className="flex items-center gap-4">
//                             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
//                               <BookOpen className="h-5 w-5" />
//                             </div>
//                             <div className="max-w-[240px]">
//                               <p className="text-lg font-bold leading-snug text-slate-900">
//                                 {quiz.quizTitle}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-6">
//                           <span
//                             className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${quiz.courseBadgeClass}`}
//                           >
//                             {quiz.courseTitle}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 text-lg text-slate-500">
//                           {quiz.lessonTitle}
//                         </td>
//                         <td className="px-6 py-6 text-center">
//                           <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-800">
//                             {quiz.questionCount}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6">
//                           <span
//                             className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${quiz.statusClass}`}
//                           >
//                             {quiz.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 text-lg text-slate-500">
//                           {quiz.createdAt}
//                         </td>
//                         <td className="px-6 py-6">
//                           <div className="flex items-center justify-end gap-3">
//                             <button
//                               type="button"
//                               className="text-slate-400 transition hover:text-sky-500"
//                             >
//                               <Pencil className="h-4 w-4" />
//                             </button>
//                             <button
//                               type="button"
//                               className="text-slate-400 transition hover:text-rose-500"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {quizRows.length > quizzesPerPage && (
//               <div className="flex justify-center">
//                 <button
//                   onClick={() => setShowAllQuizzes(!showAllQuizzes)}
//                   className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
//                 >
//                   {showAllQuizzes
//                     ? "Show Less"
//                     : `Show More (${quizRows.length - quizzesPerPage} more)`}
//                 </button>
//               </div>
//             )}

//             <p className="text-sm text-slate-500">
//               Showing{" "}
//               {showAllQuizzes
//                 ? quizRows.length
//                 : Math.min(quizzesPerPage, quizRows.length)}{" "}
//               of {quizRows.length} quizzes
//             </p>
//           </div>
//         )
//       ) : null}
//     </div>
//   );
// }

function UsersSection({ activeSubSection, onChangeSubSection }) {
  const selectedUserView = activeSubSection || "view-users";
  const [users, setUsers] = useState([]);
  const [userTrackingData, setUserTrackingData] = useState({});
  const [userCertificates, setUserCertificates] = useState({});
  const [showAllEnrollments, setShowAllEnrollments] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [currentTrackProgressPage, setCurrentTrackProgressPage] = useState(1);
  const [currentCertificatesPage, setCurrentCertificatesPage] = useState(1);
  const enrollmentsPerPage = 2;
  const certificatesPerPage = 1;
  const trackProgressPerPage = 6;
  const certificatesListPerPage = 6;
  const [courseDetailsById, setCourseDetailsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEnrollments, setSelectedUserEnrollments] = useState([]);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const usersPerPage = 5;
  const [searchUser, setSearchUser] = useState("");
  const [searchTrackProgress, setSearchTrackProgress] = useState("");
  const [searchCertificate, setSearchCertificate] = useState("");

  const token = getAuthToken();

  const fetchJsonSafe = async (url) => {
    try {
      const authHeaders = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(url, {
        method: "GET",
        headers: authHeaders,
      });

      // Diagnostic logging for certificate endpoints
      if (url.includes("certificates")) {
        console.log(`[Cert Fetch] ${url} → ${response.status}`);
      }

      if (!response.ok && response.status !== 403) {
        if (url.includes("certificates")) {
          console.error(`[Cert Error] ${response.status}:`, url);
        }
        return null;
      }

      if (!response.ok) {
        if (url.includes("certificates")) {
          console.error(`[Cert Forbidden] 403`);
        }
        return null;
      }

      const text = await response.text();
      const parsed = text ? JSON.parse(text) : null;

      // Log certificate response structure
      if (url.includes("certificates")) {
        console.log(`[Cert Response]`, {
          isArray: Array.isArray(parsed),
          keys: Array.isArray(parsed) ? `[${parsed.length}]` : Object.keys(parsed || {}),
          first: Array.isArray(parsed) ? parsed[0] : parsed,
        });
      }

      return parsed;
    } catch (e) {
      if (url.includes("certificates")) {
        console.error(`[Cert Exception]`, e);
      }
      return null;
    }
  };

  // Reusable fetch users function
  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const userEndpoints = USER_API_CANDIDATES;
      let userList = [];

      for (const url of userEndpoints) {
        try {
          const payload = await fetchJsonSafe(url);
          if (!payload) continue;
          userList = extractUserList(payload).filter(
            (user) => !isAdminUser(user),
          );
          if (userList.length) break;
        } catch {
          // Try next endpoint
        }
      }

      setUsers(userList);

      // Fetch enrollments and certificates for each user
      const trackingData = {};
      const certificatesData = {};
      const courseDetailsById = {};

      for (const user of userList) {
        const userId =
          user?.userId ?? user?.id ?? user?._id ?? user?.uid ?? null;
        if (!userId) continue;

        // Fetch enrollments for this user
        const enrollmentEndpoints = [
          `https://jomnorncode-api.cheat.casa/api/api/enrollments/user/${userId}?page=0&size=100&sortBy=createdAt&direction=desc`,
          `https://jomnorncode-api.cheat.casa/api/enrollments/user/${userId}?page=0&size=100&sortBy=createdAt&direction=desc`,
        ];

        let enrollments = [];
        for (const url of enrollmentEndpoints) {
          const payload = await fetchJsonSafe(url);
          if (payload) {
            enrollments = extractEnrollmentList(payload);
            if (enrollments.length) break;
          }
        }

        // Fetch course details for each enrollment
        for (const enrollment of enrollments) {
          const courseId =
            enrollment?.courseId ??
            enrollment?.course?.id ??
            enrollment?.course?.courseId ??
            null;

          if (courseId && !courseDetailsById[courseId]) {
            const courseEndpoints = [
              `https://jomnorncode-api.cheat.casa/api/api/courses/${courseId}`,
              `https://jomnorncode-api.cheat.casa/api/courses/${courseId}`,
            ];

            for (const url of courseEndpoints) {
              const coursePayload = await fetchJsonSafe(url);
              if (coursePayload) {
                const courseData = coursePayload?.data || coursePayload;
                const courseTitle =
                  courseData?.title ??
                  courseData?.courseTitle ??
                  courseData?.name ??
                  courseData?.courseName ??
                  null;

                if (courseTitle) {
                  courseDetailsById[courseId] = {
                    id: courseId,
                    title: courseTitle,
                  };
                  break;
                }
              }
            }
          }
        }

        // Calculate overall progress
        const totalProgress =
          enrollments.length > 0
            ? Math.round(
                enrollments.reduce((sum, e) => {
                  const progress =
                    e?.progress ??
                    e?.progressPercent ??
                    e?.progressPercentage ??
                    0;
                  return sum + Number(progress);
                }, 0) / enrollments.length,
              )
            : 0;

        trackingData[userId] = {
          enrollments,
          overall_progress: totalProgress,
        };

        // Fetch certificates for this user
        const certEndpoints = [
          `https://jomnorncode-api.cheat.casa/api/api/certificates/user/${userId}`,
          `https://jomnorncode-api.cheat.casa/api/certificates/user/${userId}`,
        ];

        let certificates = [];
        for (const url of certEndpoints) {
          const payload = await fetchJsonSafe(url);
          if (payload) {
            let rawCerts = extractCertificateList(payload);
            // Normalize certificate data structure
            certificates = rawCerts.map((cert) => ({
              ...cert,
              // Ensure course object exists with title
              course: {
                ...cert?.course,
                title: cert?.courseName || cert?.course?.title || "Certificate",
              },
              // Keep courseName for backward compatibility
              courseName: cert?.courseName || cert?.course?.title || "Certificate",
            }));
            if (certificates.length) break;
          }
        }

        certificatesData[userId] = certificates;
      }

      setUserTrackingData(trackingData);
      setUserCertificates(certificatesData);
      setCourseDetailsById(courseDetailsById);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  useEffect(() => {
    loadAllUsers();
  }, []);

  // Listen for profile updates and refresh user data
  useEffect(() => {
    const handleProfileUpdate = () => {
      // Refetch user data when profile is updated
      loadAllUsers();
    };

    const handleCertificateIssued = () => {
      // Refetch user data when a certificate is issued
      loadAllUsers();
    };

    // Listen for custom profile update event
    window.addEventListener("userProfileUpdated", handleProfileUpdate);
    // Listen for certificate issued event
    window.addEventListener("certificateIssued", handleCertificateIssued);

    // Also listen for storage changes (in case profile is updated in another tab)
    window.addEventListener("storage", (e) => {
      if (e.key === "userProfileUpdated") {
        handleProfileUpdate();
      }
    });

    return () => {
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
      window.removeEventListener("certificateIssued", handleCertificateIssued);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  const getUserName = (user) =>
    user?.name ??
    user?.fullName ??
    user?.displayName ??
    user?.firstName ??
    "Unknown User";

  const getUserUsername = (user) =>
    user?.username ?? user?.email?.split("@")[0] ?? "N/A";

  const getDisplayName = (user) => {
    const name = getUserName(user);
    const username = getUserUsername(user);
    return `${name} (@${username})`;
  };

  const getUserEmail = (user) => user?.email ?? "No email";

  const getUserId = (user) =>
    user?.userId ?? user?.id ?? user?._id ?? user?.uid ?? null;

  const getUserProfilePicture = (user) =>
    user?.profilePicture ??
    user?.profileImage ??
    user?.avatar ??
    user?.profileUrl ??
    user?.profilePhoto ??
    null;

  const getAvatarUrl = (user) => {
    const picture = getUserProfilePicture(user);
    if (picture) return picture;
    // Fallback to initials or default avatar
    const name = getUserName(user);
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return null; // Will use default avatar with initials
  };

  const handleUserClick = (user) => {
    const userId = getUserId(user);
    setSelectedUser(user);
    const enrollments = userTrackingData[userId]?.enrollments || [];

    // Log enrollment data to see what fields are available
    if (enrollments.length > 0) {
      console.log("📊 Sample Enrollment Data:", enrollments[0]);
      console.log("Available fields:", Object.keys(enrollments[0]));
    }

    // Enhance enrollments with lesson/quiz tracking if not present
    const enhancedEnrollments = enrollments.map((enrollment) => {
      if (!enrollment.lessonsCompleted && !enrollment.completedLessons) {
        enrollment.lessonsCompleted =
          enrollment.lessonsViewed || enrollment.completedLessons || 0;
      }
      if (!enrollment.quizzesCompleted && !enrollment.completedQuizzes) {
        enrollment.quizzesCompleted =
          enrollment.quizzesAttempted || enrollment.completedQuizzes || 0;
      }
      return enrollment;
    });

    setSelectedUserEnrollments(enhancedEnrollments);
    setShowAllEnrollments(false);
    setShowAllCertificates(false);
  };

  const handleCloseDetail = () => {
    setSelectedUser(null);
    setSelectedUserEnrollments([]);
    setShowAllEnrollments(false);
    setShowAllCertificates(false);
    setCurrentUserPage(1);
    setCurrentTrackProgressPage(1);
    setCurrentCertificatesPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          User & Tracking
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor learner progress and certificate readiness.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {navItems
          .find((item) => item.id === "users")
          ?.children?.map((child) => (
            <button
              key={child.id}
              onClick={() => onChangeSubSection?.(child.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                selectedUserView === child.id
                  ? "bg-sky-500 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-slate-300 hover:text-slate-700"
              }`}
            >
              {child.label}
            </button>
          ))}
      </div>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                Tracking: {getDisplayName(selectedUser)}
              </h2>
              <button
                onClick={handleCloseDetail}
                className="rounded-lg p-2 hover:bg-slate-100 flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-500">Email</p>
                <p className="mt-1 text-sm text-slate-900">
                  {getUserEmail(selectedUser)}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-3">
                  Enrolled Courses ({selectedUserEnrollments.length})
                </p>
                <div className="space-y-3">
                  {selectedUserEnrollments.length > 0 ? (
                    (showAllEnrollments
                      ? selectedUserEnrollments
                      : selectedUserEnrollments.slice(0, enrollmentsPerPage)
                    ).map((enrollment, idx) => {
                      const progress =
                        enrollment?.progress ??
                        enrollment?.progressPercent ??
                        enrollment?.progressPercentage ??
                        0;
                      const courseId =
                        enrollment?.courseId ??
                        enrollment?.course?.id ??
                        enrollment?.course?.courseId ??
                        null;

                      // Try to get course name from course details first, then from enrollment
                      const courseName =
                        courseDetailsById[courseId]?.title ??
                        enrollment?.title ??
                        (courseId ? `Course ${courseId}` : "Unknown Course");

                      // Extract completion counts from enrollment data
                      const lessonsCompleted =
                        enrollment?.lessonsCompleted ??
                        enrollment?.completedLessons ??
                        enrollment?.lessons_completed ??
                        0;

                      const quizzesCompleted =
                        enrollment?.quizzesCompleted ??
                        enrollment?.completedQuizzes ??
                        enrollment?.quizzes_completed ??
                        0;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">
                                {courseName}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Status:{" "}
                                <span className="capitalize">
                                  {enrollment?.status || "In Progress"}
                                </span>
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-sky-600 whitespace-nowrap">
                              {Math.round(progress)}%
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-slate-200 mb-3">
                            <div
                              className="h-2 rounded-full bg-sky-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-lg bg-white p-2 border border-slate-200">
                              <p className="text-slate-500 font-semibold">
                                Lessons
                              </p>
                              <p className="text-lg font-bold text-slate-900 mt-1">
                                {lessonsCompleted}
                              </p>
                            </div>
                            <div className="rounded-lg bg-white p-2 border border-slate-200">
                              <p className="text-slate-500 font-semibold">
                                Quizzes
                              </p>
                              <p className="text-lg font-bold text-slate-900 mt-1">
                                {quizzesCompleted}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">
                      No course enrollments yet.
                    </p>
                  )}
                </div>

                {selectedUserEnrollments.length > enrollmentsPerPage && (
                  <button
                    type="button"
                    onClick={() => setShowAllEnrollments(!showAllEnrollments)}
                    className="mt-3 w-full rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
                  >
                    {showAllEnrollments
                      ? "Show Less"
                      : `View More (${selectedUserEnrollments.length - enrollmentsPerPage} more)`}
                  </button>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-3">
                  Certificates (
                  {userCertificates[getUserId(selectedUser)]?.length || 0})
                </p>
                
                {/* Certificate Search Filter */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search certificates by course name..."
                    value={searchCertificate}
                    onChange={(e) => setSearchCertificate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-[#90a1b9] placeholder-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  {userCertificates[getUserId(selectedUser)]?.length > 0 ? (
                    (showAllCertificates
                      ? userCertificates[getUserId(selectedUser)]
                      : userCertificates[getUserId(selectedUser)].slice(
                          0,
                          certificatesPerPage,
                        )
                    )
                      .filter((cert) => {
                        const courseTitle = (
                          cert?.course?.title ||
                          cert?.courseName ||
                          "Certificate"
                        ).toLowerCase();
                        return courseTitle.includes(
                          searchCertificate.toLowerCase(),
                        );
                      })
                      .map((cert, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3"
                        >
                          <p className="text-sm font-semibold text-emerald-900">
                            ✓{" "}
                            {cert?.course?.title ||
                              cert?.courseName ||
                              "Certificate"}
                          </p>
                          <p className="text-xs text-emerald-700 mt-1">
                            Issued on{" "}
                            {new Date(cert?.createdAt).toLocaleDateString() ||
                              "N/A"}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No certificates issued yet.
                    </p>
                  )}
                </div>

                {(userCertificates[getUserId(selectedUser)]?.length || 0) >
                  certificatesPerPage && (
                  <button
                    type="button"
                    onClick={() => setShowAllCertificates(!showAllCertificates)}
                    className="mt-3 w-full rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
                  >
                    {showAllCertificates
                      ? "Show Less"
                      : `View More (${(userCertificates[getUserId(selectedUser)]?.length || 0) - certificatesPerPage} more)`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedUserView === "track-progress" ? (
        <div className="space-y-4">
          {/* Track Progress Search Filter */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTrackProgress}
              onChange={(e) => setSearchTrackProgress(e.target.value)}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg text-sm bg-[#ffffff] text-[#90a1b9] placeholder-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center text-slate-500">
              Loading user data...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center text-slate-500">
              No users found.
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {(() => {
                  const startIdx =
                    (currentTrackProgressPage - 1) * trackProgressPerPage;
                  const endIdx = startIdx + trackProgressPerPage;
                  return users
                    .filter((user) => {
                      const displayName = getDisplayName(user).toLowerCase();
                      return displayName.includes(
                        searchTrackProgress.toLowerCase(),
                      );
                    })
                    .slice(startIdx, endIdx)
                    .map((user) => {
                      const userId = getUserId(user);
                      const tracking = userTrackingData[userId] || {};
                      const progress = tracking.overall_progress || 0;

                      return (
                        <div
                          key={userId}
                          onClick={() => handleUserClick(user)}
                          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition"
                        >
                          <p className="text-lg font-bold text-slate-900">
                            {getDisplayName(user)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {tracking.enrollments?.length || 0} courses enrolled
                          </p>
                          <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="text-slate-400">Progress</span>
                              <span className="font-semibold text-slate-700">
                                {progress}%
                              </span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100">
                              <div
                                className="h-3 rounded-full bg-sky-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
              {users.length > trackProgressPerPage && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentTrackProgressPage(
                        Math.max(1, currentTrackProgressPage - 1),
                      )
                    }
                    disabled={currentTrackProgressPage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Prev
                  </button>

                  <div className="flex gap-1">
                    {Array.from(
                      {
                        length: Math.ceil(users.length / trackProgressPerPage),
                      },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentTrackProgressPage(page)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          currentTrackProgressPage === page
                            ? "bg-sky-500 text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentTrackProgressPage(
                        Math.min(
                          Math.ceil(users.length / trackProgressPerPage),
                          currentTrackProgressPage + 1,
                        ),
                      )
                    }
                    disabled={
                      currentTrackProgressPage ===
                      Math.ceil(users.length / trackProgressPerPage)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : null}

      {selectedUserView === "certificates" ? (
        <div className="space-y-4">
          {/* Certificates Search Filter */}
          <div className="mb-4 flex gap-3">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchCertificate}
              onChange={(e) => setSearchCertificate(e.target.value)}
              className="flex-1 px-4 py-4 border border-gray-300 rounded-lg text-sm bg-[#ffffff] text-[#90a1b9] placeholder-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => loadAllUsers()}
              className="px-4 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center text-slate-500">
              Loading certificate data...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center text-slate-500">
              No users found.
            </div>
          ) : (
            <>
              {(() => {
                const filteredUsers = users.filter((user) => {
                  const displayName = getDisplayName(user).toLowerCase();
                  return displayName.includes(
                    searchCertificate.toLowerCase(),
                  );
                });
                const startIdx =
                  (currentCertificatesPage - 1) * certificatesListPerPage;
                const endIdx = startIdx + certificatesListPerPage;
                const paginatedUsers = filteredUsers.slice(startIdx, endIdx);

                return (
                  <>
                    <div className="space-y-4">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => {
                      const userId = getUserId(user);
                      const certificates = userCertificates[userId] || [];
                      console.log("meow",certificates);

                      return (
                        <div
                          key={userId}
                          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                              <p className="text-lg font-bold text-slate-900">
                                {getDisplayName(user)}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {certificates?.length} certificate(s)
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                certificates.length > 0
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {certificates.length > 0
                                ? "✓ Completed"
                                : "In Progress"}
                            </span>
                          </div>

                          {certificates.length > 0 ? (
                            <div className="space-y-3">
                              {certificates.map((cert, idx) => {
                                const certCourseName =
                                  cert?.course?.title ||
                                  cert?.courseName ||
                                  cert?.title ||
                                  "Certificate";
                                const certDate = cert?.createdAt
                                  ? new Date(cert.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )
                                  : "N/A";

                                return (
                                  <div
                                    key={idx}
                                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <p className="font-semibold text-emerald-900">
                                          🎓 {certCourseName}
                                        </p>
                                        <p className="text-xs text-emerald-700 mt-1">
                                          Issued: {certDate}
                                        </p>
                                      </div>
                                      <span className="text-lg">✓</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 py-3">
                              No certificates earned yet.
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center text-slate-500">
                      No data to display
                    </div>
                  )}
                    </div>
                    {filteredUsers.length > certificatesListPerPage && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentCertificatesPage(
                              Math.max(1, currentCertificatesPage - 1),
                            )
                          }
                    disabled={currentCertificatesPage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Prev
                  </button>

                  <div className="flex gap-1">
                    {Array.from(
                      {
                        length: Math.ceil(
                          filteredUsers.length / certificatesListPerPage,
                        ),
                      },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentCertificatesPage(page)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          currentCertificatesPage === page
                            ? "bg-sky-500 text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentCertificatesPage(
                        Math.min(
                          Math.ceil(
                            filteredUsers.length / certificatesListPerPage,
                          ),
                          currentCertificatesPage + 1,
                        ),
                      )
                    }
                    disabled={
                      currentCertificatesPage ===
                      Math.ceil(
                        filteredUsers.length / certificatesListPerPage,
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next →
                  </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>
      ) : null}

      {selectedUserView === "view-users" ? (
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm text-center text-xs sm:text-sm text-slate-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm text-center text-xs sm:text-sm text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-slate-50 px-4 sm:px-5 py-3 sm:py-4 gap-3">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
                  Students List
                </h3>
                <button
                  onClick={() => {
                    setLoading(true);
                    loadAllUsers();
                  }}
                  className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-1.5 sm:py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100 w-full sm:w-auto"
                >
                  ↻ Refresh
                </button>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 sm:px-5 py-2 sm:py-3">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={searchUser}
                  onChange={(e) => {
                    setSearchUser(e.target.value);
                    setCurrentUserPage(1);
                  }}
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                />
                {searchUser && (
                  <button
                    onClick={() => {
                      setSearchUser("");
                      setCurrentUserPage(1);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-3 sm:px-5 py-3 sm:py-4 font-semibold text-xs sm:text-xs">Student</th>
                      <th className="px-3 sm:px-5 py-3 sm:py-4 font-semibold text-xs sm:text-xs hidden sm:table-cell">Courses</th>
                      <th className="px-3 sm:px-5 py-3 sm:py-4 font-semibold text-xs sm:text-xs hidden md:table-cell">Progress</th>
                      <th className="px-3 sm:px-5 py-3 sm:py-4 font-semibold text-xs sm:text-xs">Certificates</th>
                      <th className="px-3 sm:px-5 py-3 sm:py-4 font-semibold text-xs sm:text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filteredUsers = users.filter((user) => {
                        const name = getUserName(user).toLowerCase();
                        const email = (user?.email || "").toLowerCase();
                        const username = (user?.username || "").toLowerCase();
                        const search = searchUser.toLowerCase();
                        return (
                          name.includes(search) ||
                          email.includes(search) ||
                          username.includes(search)
                        );
                      });

                      if (filteredUsers.length === 0) {
                        return (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-5 py-8 text-center text-sm text-slate-500"
                            >
                              No users match your search.
                            </td>
                          </tr>
                        );
                      }

                      const startIdx = (currentUserPage - 1) * usersPerPage;
                      const endIdx = startIdx + usersPerPage;
                      const paginatedUsers = filteredUsers.slice(
                        startIdx,
                        endIdx,
                      );
                      window.__usersForPagination = filteredUsers; // Store for pagination

                      return paginatedUsers.map((user) => {
                        const userId = getUserId(user);
                        const tracking = userTrackingData[userId] || {};
                        const certificates = userCertificates[userId] || [];
                        const progress = tracking.overall_progress || 0;
                        const profilePic = getAvatarUrl(user);
                        const userName = getUserName(user);
                        const initials = userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();

                        return (
                          <tr
                            key={userId}
                            className="border-t border-slate-100 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <td className="px-5 py-5">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 flex-shrink-0">
                                  {profilePic ? (
                                    <img
                                      src={profilePic}
                                      alt={userName}
                                      className="h-10 w-10 rounded-full object-cover bg-slate-200"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextElementSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className={`h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-xs font-bold text-white ${
                                      profilePic ? "hidden" : "flex"
                                    }`}
                                    style={{
                                      display: !profilePic ? "flex" : "none",
                                    }}
                                  >
                                    {initials}
                                  </div>
                                </div>
                                <div className="font-semibold text-slate-800">
                                  {getDisplayName(user)}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-5 py-3 sm:py-5 hidden sm:table-cell">
                              {tracking.enrollments?.length || 0}
                            </td>
                            <td className="px-3 sm:px-5 py-3 sm:py-5 hidden md:table-cell">
                              <div className="flex min-w-[150px] items-center gap-2 sm:gap-3">
                                <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                                  <div
                                    className="h-2.5 rounded-full bg-sky-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-500">
                                  {progress}%
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-5 py-3 sm:py-5">
                              <span
                                className={`rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${
                                  certificates.length > 0
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-slate-200 text-slate-600"
                                }`}
                              >
                                {certificates.length}
                              </span>
                            </td>
                            <td className="px-3 sm:px-5 py-3 sm:py-5">
                              <button
                                onClick={() => handleUserClick(user)}
                                className="rounded-lg bg-sky-100 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-sky-600 hover:bg-sky-200 whitespace-nowrap"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
              {(() => {
                const filteredUsers = users.filter((user) => {
                  const name = getUserName(user).toLowerCase();
                  const email = (user?.email || "").toLowerCase();
                  const username = (user?.username || "").toLowerCase();
                  const search = searchUser.toLowerCase();
                  return (
                    name.includes(search) ||
                    email.includes(search) ||
                    username.includes(search)
                  );
                });

                return filteredUsers.length > usersPerPage ? (
                  <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <button
                      onClick={() =>
                        setCurrentUserPage(Math.max(1, currentUserPage - 1))
                      }
                      disabled={currentUserPage === 1}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ← Prev
                    </button>

                    <div className="flex gap-1">
                      {Array.from(
                        {
                          length: Math.ceil(
                            filteredUsers.length / usersPerPage,
                          ),
                        },
                        (_, i) => i + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentUserPage(page)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            currentUserPage === page
                              ? "bg-sky-500 text-white"
                              : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentUserPage(
                          Math.min(
                            Math.ceil(filteredUsers.length / usersPerPage),
                            currentUserPage + 1,
                          ),
                        )
                      }
                      disabled={
                        currentUserPage ===
                        Math.ceil(filteredUsers.length / usersPerPage)
                      }
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("courses");
  const [activeSubSection, setActiveSubSection] = useState("all-courses");
  const [expandedSection, setExpandedSection] = useState("courses");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeContent = useMemo(() => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "quizzes":
        return (
          <QuizSection
            activeSubSection={activeSubSection}
            onChangeSubSection={setActiveSubSection}
          />
        );
      case "users":
        return (
          <UsersSection
            activeSubSection={activeSubSection}
            onChangeSubSection={setActiveSubSection}
          />
        );
      case "courses":
      default:
        return (
          <CourseSection
            activeSubSection={activeSubSection}
            onChangeSubSection={setActiveSubSection}
          />
        );
    }
  }, [activeSection, activeSubSection]);

  const handleSelectSection = (section) => {
    setActiveSection(section);
    if (section === "courses") {
      setActiveSubSection("all-courses");
      setExpandedSection("courses");
    } else if (section === "quizzes") {
      setActiveSubSection("all-quizzes");
      setExpandedSection("quizzes");
    } else if (section === "users") {
      setActiveSubSection("view-users");
      setExpandedSection("users");
    } else {
      setExpandedSection(section);
    }
    setIsSidebarOpen(false);
  };

  const handleSelectChild = (section, child) => {
    setActiveSection(section);
    setActiveSubSection(child);
    setExpandedSection(section);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#eff3f8] text-slate-900 overflow-x-hidden">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden lg:block lg:w-[280px] lg:shrink-0 bg-[#112d4f] px-5 py-6 text-white order-2 lg:order-1">
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-16 w-16 items-center justify-center">
              <img
                src={jomnornCodeLogo}
                alt="JomnornCode logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-bold">JomnornCode</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <AdminNavButton
                key={item.id}
                activeSection={activeSection}
                activeSubSection={activeSubSection}
                item={item}
                onSelect={handleSelectSection}
                onSelectChild={handleSelectChild}
                openSection={item.id === expandedSection}
              />
            ))}
          </nav>
        </aside>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden">
            <div className="h-full w-[280px] bg-[#112d4f] px-5 py-6 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center">
                    <img
                      src={jomnornCodeLogo}
                      alt="JomnornCode logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold">JomnornCode</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 space-y-2">
                {navItems.map((item) => (
                  <AdminNavButton
                    key={item.id}
                    activeSection={activeSection}
                    activeSubSection={activeSubSection}
                    item={item}
                    mobile
                    onSelect={handleSelectSection}
                    onSelectChild={handleSelectChild}
                    openSection={item.id === expandedSection}
                  />
                ))}
              </nav>
            </div>
          </div>
        ) : null}

        <main className="flex-1 order-1 lg:order-2 w-full">
          <div className="border-b border-slate-200 bg-white/80 px-3 py-3 backdrop-blur sm:px-4 sm:py-4 md:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 lg:hidden flex-shrink-0"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <Link
                  to="/"
                  className="inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 sm:px-6 text-xs sm:text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 whitespace-nowrap min-w-max flex-shrink-0"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Go Back Home</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-3 sm:justify-end">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-2 sm:p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-slate-800 flex-shrink-0"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="hidden sm:flex items-center gap-2 sm:gap-3 rounded-2xl border border-slate-200 bg-white px-2 sm:px-3 py-1 sm:py-2">
                  <img
                    src="src/assets/jomnorncode_logo.png"
                    alt="Jomnorncode Logo"
                    className="h-8 sm:h-10 w-8 sm:w-10 rounded-full object-cover"
                  />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-800">
                      Admin
                    </p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 lg:py-8 overflow-x-auto">
            <div className="w-full">
              {activeContent}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
