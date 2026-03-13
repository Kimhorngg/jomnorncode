import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth/authSlice";

const buildDisplayName = (user) => {
  if (!user) return "";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return (
    user.displayName ||
    fullName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "") ||
    "អ្នកប្រើប្រាស់"
  );
};

const buildAccountName = (user) => {
  if (!user) return "";
  return (
    user.displayName ||
    user.firstName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "") ||
    "អ្នកប្រើប្រាស់"
  );
};

const buildPreferredDisplayName = (user) => {
  if (!user) return "";
  return (
    user.displayName ||
    user.firstName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "") ||
    "អ្នកប្រើប្រាស់"
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth || {});
  const user = authState?.user || null;
  const token = authState?.token || null;
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    displayName: "",
    email: "",
    username: "",
    profilePicture: "",
  });
  const [profileImageName, setProfileImageName] = useState(
    "មិនទាន់ជ្រើសរើសឯកសារ",
  );
  const displayName = buildDisplayName(user);
  const accountName = buildAccountName(user);
  const avatarSrc = user?.profilePicture || user?.photoURL || "";

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: buildAccountName(user),
      displayName: buildPreferredDisplayName(user),
      email: user.email || "",
      username: user.username || "",
      profilePicture: user.profilePicture || user.photoURL || "",
    });
    setProfileImageName("មិនទាន់ជ្រើសរើសឯកសារ");
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const nextUser = {
      ...user,
      firstName: form.firstName.trim(),
      displayName:
        form.displayName.trim() ||
        form.username.trim() ||
        (form.email.trim() ? form.email.trim().split("@")[0] : ""),
      email: form.email.trim(),
      username: form.username.trim(),
      profilePicture: form.profilePicture.trim(),
      photoURL: form.profilePicture.trim(),
    };

    dispatch(
      setCredentials({
        token,
        user: nextUser,
      }),
    );

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setForm({
      firstName: buildAccountName(user),
      displayName: buildPreferredDisplayName(user),
      email: user?.email || "",
      username: user?.username || "",
      profilePicture: user?.profilePicture || user?.photoURL || "",
    });
    setProfileImageName("មិនទាន់ជ្រើសរើសឯកសារ");
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-6 py-12 lg:px-12 dark:from-[#0e172b] dark:via-[#1a2a3a] dark:to-[#0e172b]">
        <div className="mx-auto max-w-380 overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111827]">
          <div className="h-1 bg-gradient-to-r from-[#112d52] to-[#ffa405]"></div>
          <div className="p-8 text-center">
            <div className="mb-4 inline-block rounded-full bg-[#112d52]/10 p-4">
              <svg
                className="h-8 w-8 text-[#112d52]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#112d52] dark:text-white">
              មិនទាន់ចូលគណនី
            </h1>
            <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
              សូមចូលគណនី ដើម្បីមើលប្រវត្តិរូបរបស់អ្នក។
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-xl bg-[#112d52] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#0d1f38] transition-all duration-200 hover:shadow-xl sm:w-auto"
              >
                ចូលគណនី
              </button>
              <Link
                to="/signup"
                className="w-full rounded-xl border-2 border-[#ffa405] px-6 py-3 text-sm font-semibold text-[#112d52] hover:bg-[#ffa405]/5 transition-all duration-200 dark:text-[#ffa405] sm:w-auto"
              >
                បង្កើតគណនី
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 px-6 py-12 lg:px-12 dark:from-[#0e172b] dark:via-[#1a2a3a] dark:to-[#0e172b]">
      <div className="mx-auto max-w-420">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111827]">
          <div className="h-1 bg-gradient-to-r from-[#112d52] to-[#ffa405]"></div>

          <div className="p-8 sm:p-12">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-6 pb-8 text-center sm:flex-row sm:text-left sm:pb-12">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-[#ffa405] bg-gradient-to-br from-[#112d52]/10 to-[#ffa405]/10 shadow-xl">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold bg-gradient-to-br from-[#112d52] to-[#ffa405] text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#112d52] dark:text-white">
                  {displayName}
                </h1>
                <p className="mt-2 text-sm text-[#ffa405] font-semibold">
                  {user.email || "អ៊ីមែលមិនមាន"}
                </p>
              </div>
              <div className="sm:self-start">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="rounded-xl bg-[#112d52] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d1f38]"
                    >
                      រក្សាទុក
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      បោះបង់
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl bg-[#ffa405] px-5 py-2.5 text-sm font-semibold text-[#112d52] transition-colors hover:bg-[#e49404]"
                  >
                    កែប្រែប្រវត្តិរូប
                  </button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mb-8 rounded-2xl border-2 border-[#ffe2ad] bg-[#fffaf0] p-5 dark:border-[#314057] dark:bg-slate-900">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-[#112d52] dark:text-[#ffa405]">
                      ឈ្មោះ
                    </span>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#ffa405] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-md font-semibold text-[#112d52] dark:text-[#ffa405]">
                      ឈ្មោះបង្ហាញ
                    </span>
                    <input
                      name="displayName"
                      value={form.displayName}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#ffa405] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-md font-semibold text-[#112d52] dark:text-[#ffa405]">
                      អ៊ីមែល
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#ffa405] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-md font-semibold text-[#112d52] dark:text-[#ffa405]">
                      ឈ្មោះអ្នកប្រើ
                    </span>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#ffa405] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-md font-semibold text-[#112d52] dark:text-[#ffa405]">
                      រូបភាពប្រវត្តិរូប
                    </span>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                        <span className="inline-flex rounded-lg bg-[#112d52] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0d1f38] dark:bg-[#ffa405] dark:text-[#112d52] dark:hover:bg-[#e49404]">
                          ជ្រើសរើសឯកសារ
                        </span>
                        <span className="truncate text-slate-500 dark:text-slate-300">
                          {profileImageName}
                        </span>
                        <input
                          name="profilePictureFile"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {form.profilePicture && (
                        <img
                          src={form.profilePicture}
                          alt="Profile preview"
                          className="h-16 w-16 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Info Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-[#ffa405] hover:scale-105 transition-all duration-200 hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <p className="text-md uppercase font-semibold tracking-widest text-[#112d52] dark:text-[#ffa405]">
                  ឈ្មោះ
                </p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-[#112d52] dark:group-hover:text-[#ffa405] transition-colors">
                  {accountName || "-"}
                </p>
              </div>
              <div className="group rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-[#ffa405] hover:scale-105 transition-all duration-200 hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <p className="text-md uppercase font-semibold tracking-widest text-[#112d52] dark:text-[#ffa405]">
                  ឈ្មោះបង្ហាញ
                </p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-[#112d52] dark:group-hover:text-[#ffa405] transition-colors">
                  {buildPreferredDisplayName(user) || "-"}
                </p>
              </div>
              <div className="group rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-[#ffa405] hover:scale-105 transition-all duration-200 hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <p className="text-md uppercase font-semibold tracking-widest text-[#112d52] dark:text-[#ffa405]">
                  អ៊ីមែល
                </p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-[#112d52] dark:group-hover:text-[#ffa405] transition-colors break-all">
                  {user.email || "-"}
                </p>
              </div>
              <div className="group rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-slate-50 p-5 hover:border-[#ffa405] hover:scale-105 transition-all duration-200 hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <p className="text-md uppercase font-semibold tracking-widest text-[#112d52] dark:text-[#ffa405]">
                  ឈ្មោះអ្នកប្រើ
                </p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-[#112d52] dark:group-hover:text-[#ffa405] transition-colors">
                  {user.username || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
