const API_BASE = "https://jomnorncode-api.cheat.casa/api";

export function createApiClient(token) {
  const cleanToken = String(token || "")
    .replace(/^Bearer\s+/i, "")
    .trim();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cleanToken}`,
  };

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}: ${
          typeof data === "string" ? data : JSON.stringify(data)
        }`,
      );
    }

    return data;
  }

  return {
    // USERS
    getUsers: (
      params = "all=true&page=0&size=10&sortBy=createdAt&direction=desc",
    ) => request(`/api/users?${params}`, { method: "GET" }),

    getUserById: (userId) => request(`/api/users/${userId}`, { method: "GET" }),

    getMe: () => request(`/api/users/me`, { method: "GET" }),

    // COURSES
    getCourses: () => request(`/courses`, { method: "GET" }),

    getCourseById: (courseId) =>
      request(`/courses/${courseId}`, { method: "GET" }),

    // ENROLLMENTS
    getEnrollments: (
      params = "page=0&size=10&sortBy=createdAt&direction=desc",
    ) => request(`/api/enrollments?${params}`, { method: "GET" }),

    getEnrollmentById: (enrollmentId) =>
      request(`/api/enrollments/${enrollmentId}`, { method: "GET" }),

    getEnrollmentsByUser: (userId) =>
      request(`/api/enrollments/user/${userId}`, { method: "GET" }),

    createEnrollment: ({ userId, courseId }) =>
      request(`/api/enrollments`, {
        method: "POST",
        body: JSON.stringify({ userId, courseId }),
      }),

    updateEnrollmentProgress: ({ enrollmentId, progressPercentage }) =>
      request(
        `/api/enrollments/${enrollmentId}/progress?progressPercentage=${encodeURIComponent(
          progressPercentage,
        )}`,
        { method: "PATCH" },
      ),

    completeEnrollment: (enrollmentId) =>
      request(`/api/enrollments/${enrollmentId}/complete`, {
        method: "PATCH",
      }),

    getProgressByEnrollmentId: (enrollmentId) =>
      request(`/api/enrollments/${enrollmentId}`, { method: "GET" }),

    // CERTIFICATES
    getCertificates: (
      params = "page=0&size=10&sortBy=createdAt&direction=desc",
    ) => request(`/api/certificates?${params}`, { method: "GET" }),

    getCertificatesByUser: (userId) =>
      request(`/api/certificates/user/${userId}`, { method: "GET" }),

    getExistingCertificateByCourse: async (userId, courseId) => {
      const payload = await request(`/api/certificates/user/${userId}`, {
        method: "GET",
      });

      const list = Array.isArray(payload)
        ? payload
        : payload?.content || payload?.data || payload?.items || [];

      return (
        list.find((item) => {
          const itemCourseId =
            item?.courseId || item?.course?.id || item?.course?.courseId;
          return String(itemCourseId) === String(courseId);
        }) || null
      );
    },

    issueCertificate: ({ userId, courseId, fileUrl, courseName, userName }) =>
      request(`/api/certificates`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          courseId,
          fileUrl,
          courseName,
          userName,
        }),
      }),
  };
}

function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function pickId(entity) {
  return (
    entity?.id ??
    entity?.userId ??
    entity?.courseId ??
    entity?.enrollmentId ??
    null
  );
}

function pickEnrollmentId(enrollment) {
  return enrollment?.id ?? enrollment?.enrollmentId ?? null;
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

function pickCertificateCourseId(certificate) {
  return (
    certificate?.courseId ??
    certificate?.course?.id ??
    certificate?.course?.courseId ??
    certificate?.course_id ??
    null
  );
}

function pickCertificateUserId(certificate) {
  return (
    certificate?.userId ??
    certificate?.user?.id ??
    certificate?.student?.id ??
    certificate?.user_id ??
    null
  );
}

/**
 * Helper: find or create enrollment for one user/course.
 */
export async function ensureEnrollment(api, userId, courseId) {
  const enrollments = await api.getEnrollmentsByUser(userId);
  const list = toList(enrollments);
  const existing = list.find(
    (e) => Number(pickEnrollmentCourseId(e)) === Number(courseId),
  );
  if (existing) return existing;

  return api.createEnrollment({ userId, courseId });
}

export async function trackAndIssueCertificate({
  token,
  userId,
  courseId,
  progressPercentage,
  fileUrl,
  issueCertificate = true,
}) {
  const api = createApiClient(token);

  let resolvedUserId = userId ?? null;
  if (!resolvedUserId) {
    const me = await api.getMe();
    resolvedUserId =
      me?.id ?? me?.userId ?? me?.data?.id ?? me?.data?.userId ?? null;
  }
  if (!resolvedUserId) {
    throw new Error("Cannot resolve current user id from token.");
  }

  let user = null;
  let course = null;
  try {
    user = await api.getUserById(resolvedUserId);
  } catch {
    user = { id: resolvedUserId };
  }
  try {
    course = await api.getCourseById(courseId);
  } catch {
    course = { id: courseId };
  }

  console.log("User:", user);
  console.log("Course:", course);

  const enrollment = await ensureEnrollment(api, resolvedUserId, courseId);
  const enrollmentId = pickEnrollmentId(enrollment);
  if (!enrollmentId) {
    throw new Error("Cannot resolve enrollment id.");
  }

  console.log("Enrollment:", enrollment);

  const updatedProgress = await api.updateEnrollmentProgress({
    enrollmentId,
    progressPercentage,
  });

  console.log("Updated progress:", updatedProgress);

  let completed = null;
  if (Number(progressPercentage) >= 100) {
    completed = await api.completeEnrollment(enrollmentId);
    console.log("Enrollment completed:", completed);
  }

  let certificate = null;
  let certificateError = null;
  if (issueCertificate && Number(progressPercentage) >= 100) {
    const certificates = await api.getCertificatesByUser(resolvedUserId);
    const certList = toList(certificates);

    const alreadyIssued = certList.find(
      (c) =>
        Number(pickCertificateCourseId(c)) === Number(courseId) &&
        Number(pickCertificateUserId(c)) === Number(resolvedUserId),
    );

    if (!alreadyIssued) {
      try {
        certificate = await api.issueCertificate({
          userId: resolvedUserId,
          courseId,
          fileUrl,
        });
        console.log("Certificate issued:", certificate);
      } catch (err) {
        // Some roles cannot issue certificates directly from frontend.
        certificateError = err?.message || "Certificate issue forbidden";
        console.warn("Issue certificate failed:", certificateError);
      }
    } else {
      console.log("Certificate already exists:", alreadyIssued);
      certificate = alreadyIssued;
    }
  }

  return {
    user,
    course,
    userId: resolvedUserId,
    enrollmentId,
    updatedProgress,
    completed,
    certificate,
    certificateError,
  };
}

export async function demoCalls(token) {
  const api = createApiClient(token);

  // 1. Get users
  const users = await api.getUsers();
  console.log("Users", users);

  // 2. Get courses
  const courses = await api.getCourses();
  console.log("Courses", courses);

  // 3. Create enrollment
  const enrollment = await api.createEnrollment({ userId: 15, courseId: 8 });
  console.log("Created enrollment", enrollment);

  // 4. Update progress
  const updated = await api.updateEnrollmentProgress({
    enrollmentId: pickEnrollmentId(enrollment),
    progressPercentage: 50,
  });
  console.log("Progress updated", updated);

  // 5. Complete enrollment
  const completed = await api.completeEnrollment(pickEnrollmentId(enrollment));
  console.log("Completed enrollment", completed);

  // 6. Issue certificate
  const certificate = await api.issueCertificate({
    userId: 15,
    courseId: 8,
    fileUrl: "https://your-storage/certificates/cert-15-8.pdf",
  });
  console.log("Issued certificate", certificate);
}

export async function demoDynamicFlow(token, options = {}) {
  const api = createApiClient(token);
  const userId = options.userId ?? null;
  if (!userId) {
    throw new Error(
      "Pass options.userId because /api/api/users/me is forbidden for your role.",
    );
  }

  const coursesPayload = await api.getCourses();
  const courses = toList(coursesPayload);
  const courseId = options.courseId ?? pickId(courses[0]);
  if (!courseId) throw new Error("No courseId available from /api/courses");

  return trackAndIssueCertificate({
    token,
    userId,
    courseId,
    progressPercentage: options.progressPercentage ?? 100,
    fileUrl:
      options.fileUrl ??
      `https://example.com/certificates/user-${userId}-course-${courseId}.pdf`,
    issueCertificate: options.issueCertificate ?? false,
  });
}
