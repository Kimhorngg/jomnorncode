const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getProgressUserId = () => {
  const storedUser = getStoredUser();
  return (
    storedUser?.userId ??
    storedUser?.id ??
    localStorage.getItem("userId") ??
    "guest"
  );
};

export const getLessonCompletedKey = (lessonId, userId = getProgressUserId()) =>
  `lesson-${lessonId}-lessonCompleted-${userId}`;

export const getQuizCompletedKey = (lessonId, userId = getProgressUserId()) =>
  `lesson-${lessonId}-quizCompleted-${userId}`;

export const isLessonCompletedForUser = (lessonId, userId = getProgressUserId()) =>
  localStorage.getItem(getLessonCompletedKey(lessonId, userId)) === "true";

export const isQuizCompletedForUser = (lessonId, userId = getProgressUserId()) =>
  localStorage.getItem(getQuizCompletedKey(lessonId, userId)) === "true";

export const setLessonCompletedForUser = (
  lessonId,
  value = true,
  userId = getProgressUserId(),
) => {
  localStorage.setItem(getLessonCompletedKey(lessonId, userId), String(value));
};

export const setQuizCompletedForUser = (
  lessonId,
  value = true,
  userId = getProgressUserId(),
) => {
  localStorage.setItem(getQuizCompletedKey(lessonId, userId), String(value));
};
