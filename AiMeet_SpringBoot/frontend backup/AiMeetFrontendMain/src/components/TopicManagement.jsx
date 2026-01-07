// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Layers,
//   PlusCircle,
//   Trash2,
//   Edit2,
//   Sparkles,
//   Lock,
//   User,
//   Hash,
//   Search,
//   ChevronDown,
//   ClipboardCopy,
//   Check,
// } from "lucide-react";
// import { getTopic } from "../service/Topic";
// import CreateTopic from "./CreateTopic"; // ✅ keep a single import

// /* ---------- Mock fallback ---------- */
// const mockTopics = [];

// /* ---------- Small UI helpers ---------- */
// const Badge = ({ children, className = "" }) => (
//   <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
//     {children}
//   </span>
// );

// const IconButton = ({ title, onClick, children }) => (
//   <button
//     type="button"
//     title={title}
//     aria-label={title}
//     onClick={onClick}
//     className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600"
//   >
//     {React.cloneElement(children, { className: "h-4 w-4" })}
//   </button>
// );

// const Copyable = ({ value, mono = false }) => {
//   const [copied, setCopied] = useState(false);
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(value);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1200);
//     } catch (e) {
//       console.error("Copy failed", e);
//     }
//   };

//   return (
//     <div className="flex items-center justify-between gap-3">
//       <span
//         className={`flex-1 truncate rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-sm text-slate-100 ${
//           mono ? "font-mono tracking-wide" : ""
//         }`}
//       >
//         {value}
//       </span>
//       <button
//         type="button"
//         onClick={handleCopy}
//         className="inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-700 px-2.5 py-1 text-xs text-slate-100 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600 select-none"
//       >
//         {copied ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
//         {copied ? "Copied" : "Copy"}
//       </button>
//     </div>
//   );
// };

// const TopicCard = ({ topic }) => {
//   const isRecent = topic.id === 1;
//   return (
//     <div className="group relative flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-sm transition hover:shadow-md">
//       <div className="flex items-start justify-between gap-3 border-b border-slate-700 pb-4">
//         <div className="min-w-0">
//           <div className="mb-1 flex items-center gap-2">
//             <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700">
//               <Layers className="h-5 w-5 text-slate-200" />
//             </span>
//             <h3 className="truncate text-lg font-semibold text-slate-100" title={topic.name}>
//               {topic.name}
//             </h3>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
//             {isRecent && (
//               <Badge className="border-blue-400/30 bg-blue-500/10 text-blue-300">
//                 <Sparkles className="h-3.5 w-3.5" /> Recent
//               </Badge>
//             )}
//             {topic.lastUpdated && <span>Updated {topic.lastUpdated}</span>}
//             <span className="select-none">•</span>
//             <span>{topic.meetingsCount ?? 0} meetings</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-1">
//           <IconButton title="Edit topic" onClick={() => alert(`Edit: ${topic.name}`)}>
//             <Edit2 />
//           </IconButton>
//           <IconButton title="Delete topic" onClick={() => alert(`Delete: ${topic.name}`)}>
//             <Trash2 />
//           </IconButton>
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[150px_1fr]">
//         <div className="flex items-center gap-2 text-sm text-slate-400">
//           <Hash className="h-4 w-4" />
//           <span className="font-medium">Access ID</span>
//         </div>
//         <div className="min-w-0">
//           <Copyable value={String(topic.topicAccessId ?? "")} mono />
//         </div>

//         <div className="flex items-center gap-2 text-sm text-slate-400">
//           <Lock className="h-4 w-4" />
//           <span className="font-medium">Password</span>
//         </div>
//         <div className="min-w-0">
//           <Copyable value={String(topic.accessPassword ?? "********")} mono />
//         </div>

//         <div className="flex items-center gap-2 text-sm text-slate-400">
//           <User className="h-4 w-4" />
//           <span className="font-medium">Created by</span>
//         </div>
//         <div className="flex items-center">
//           <span className="truncate rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-sm text-slate-100">
//             {topic.createdBy ?? "—"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SORTS = [
//   { key: "updated", label: "Recently updated" },
//   { key: "meetings", label: "Most meetings" },
//   { key: "name", label: "Name A→Z" },
// ];

// function sortTopics(topics, key) {
//   switch (key) {
//     case "meetings":
//       return [...topics].sort((a, b) => (b.meetingsCount ?? 0) - (a.meetingsCount ?? 0));
//     case "name":
//       return [...topics].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//     case "updated":
//     default:
//       return [...topics];
//   }
// }

// const CreateTopicButton = ({ className = "", children, onClick }) => (
//   <button
//     type="button"
//     className={`inline-flex items-center gap-2 rounded-xl border border-transparent bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
//     onClick={onClick} // ✅ use the passed handler
//   >
//     <PlusCircle className="h-4 w-4" />
//     {children || "Create Topic"}
//   </button>
// );

// /* ---------- Main component (hooks live here) ---------- */
// const TopicManagement = () => {
//   const [query, setQuery] = useState("");
//   const [sortKey, setSortKey] = useState(SORTS[0].key);
//   const [topics, setTopics] = useState(mockTopics);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // NEW: modal state
//   const [showCreate, setShowCreate] = useState(false);

//   const openCreate = () => setShowCreate(true);
//   const closeCreate = () => setShowCreate(false);

//   // Normalize from API -> UI
//   const normalizeTopic = (t, idx = 0) => ({
//     id: t.id ?? idx + 1,
//     name: t.name ?? t.title ?? "Untitled Topic",
//     topicAccessId: t.topicAccessId ?? t.accessId ?? `topic-${(t.id ?? idx + 1)}`,
//     accessPassword: t.accessPassword ?? "********",
//     createdBy: t.createdBy ?? "You",
//     subtopics: Array.isArray(t.subtopics) ? t.subtopics : [],
//     lastUpdated: t.lastUpdated ?? "—",
//     meetingsCount: typeof t.meetingsCount === "number" ? t.meetingsCount : 0,
//   });

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         setLoading(true);
//         const user = JSON.parse(localStorage.getItem("user"));
//         const res = await getTopic(user.id);

//         console.log("getTopic() raw response:", res);

//         const arr =
//           Array.isArray(res) ? res :
//           Array.isArray(res?.data) ? res.data :
//           Array.isArray(res?.topics) ? res.topics :
//           [];

//         console.log("getTopic() normalized array:", arr);

//         if (!cancelled && arr.length) {
//           setTopics(arr.map((t, idx) => normalizeTopic(t, idx)));
//         }
//       } catch (e) {
//         console.error("getTopic() failed:", e);
//         if (!cancelled) setError(e?.message || "Failed to fetch topics");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => { cancelled = true; };
//   }, []);

//   // Called by <CreateTopic onCreated={...} />
//   const handleCreated = (res) => {
//     // res can be shape { data: {...} } or the object itself
//     const newTopicRaw = res?.data ?? res;
//     if (!newTopicRaw) return;

//     const normalized = normalizeTopic(newTopicRaw, topics.length);
//     setTopics((prev) => [normalized, ...prev]);
//     closeCreate();
//   };

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const base = q
//       ? topics.filter(
//           (t) =>
//             (t.name || "").toLowerCase().includes(q) ||
//             (t.topicAccessId || "").toLowerCase().includes(q) ||
//             (Array.isArray(t.subtopics) ? t.subtopics : []).some((s) =>
//               (s || "").toLowerCase().includes(q)
//             )
//         )
//       : topics;
//     return sortTopics(base, sortKey);
//   }, [query, sortKey, topics]);

//   return (
//     <div className="mx-auto max-w-7xl p-6 text-slate-100 bg-slate-950 min-h-screen">
//       <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex flex-1 items-center gap-3">
//             <div className="relative w-full max-w-md">
//               <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search by name, access id, subtopic..."
//                 className="w-full rounded-xl border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
//               />
//             </div>

//             <div className="inline-flex items-center gap-2">
//               <span className="text-sm text-slate-400">Sort</span>
//               <div className="relative">
//                 <select
//                   value={sortKey}
//                   onChange={(e) => setSortKey(e.target.value)}
//                   className="appearance-none rounded-xl border border-slate-600 bg-slate-900 py-2.5 pl-3 pr-8 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
//                 >
//                   {SORTS.map((s) => (
//                     <option key={s.key} value={s.key}>
//                       {s.label}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>
//           </div>

//           {/* Open modal */}
//           <CreateTopicButton onClick={openCreate} />
//         </div>

//         {loading && (
//           <p className="mt-3 text-sm text-slate-400">Loading topics…</p>
//         )}
//         {error && (
//           <p className="mt-3 text-sm text-red-400">Error: {error}</p>
//         )}
//       </section>

//       <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
//         {filtered.map((t) => (
//           <TopicCard key={t.id} topic={t} />
//         ))}

//         {/* Dashed "Add New Topic" card also opens modal */}
//         <button
//           type="button"
//           onClick={openCreate}
//           className="group flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-6 text-center transition hover:border-slate-600 hover:bg-slate-700"
//         >
//           <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-700">
//             <PlusCircle className="h-7 w-7 text-slate-200" />
//           </div>
//           <h3 className="text-base font-semibold">Add New Topic</h3>
//           <p className="mt-1 max-w-xs text-sm text-slate-400">
//             Create an organizational topic to group and index your meetings.
//           </p>
//         </button>
//       </section>

//       {/* --- Modal --- */}
//       {showCreate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* backdrop */}
//           <div
//             className="absolute inset-0 bg-black/60"
//             onClick={closeCreate}
//             aria-hidden="true"
//           />
//           {/* dialog */}
//           <div className="relative z-10 w-full max-w-xl p-4">
//             <div className="mb-2 flex justify-between">
//               <h3 className="text-lg font-semibold">New Topic</h3>
//               <button
//                 onClick={closeCreate}
//                 className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
//               >
//                 Close
//               </button>
//             </div>
//             <CreateTopic onCreated={handleCreated} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TopicManagement;
// /src/components/TopicManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Layers,
  PlusCircle,
  Trash2,
  Edit2,
  Sparkles,
  Lock,
  User,
  Hash,
  Search,
  ChevronDown,
  ClipboardCopy,
  Check,
} from "lucide-react";
import { getTopic } from "../service/Topic";
import CreateTopic from "./CreateTopic";

/* ---------- Mock fallback ---------- */
const mockTopics = [];

/* ---------- UI helpers ---------- */
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

const IconButton = ({ title, onClick, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600"
  >
    {React.cloneElement(children, { className: "h-4 w-4" })}
  </button>
);

const Copyable = ({ value, mono = false }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`flex-1 truncate rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-sm text-slate-100 ${
          mono ? "font-mono tracking-wide" : ""
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-700 px-2.5 py-1 text-xs text-slate-100 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600 select-none"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

const TopicCard = ({ topic }) => {
  const isRecent = topic.id === 1;
  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3 border-b border-slate-700 pb-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700">
              <Layers className="h-5 w-5 text-slate-200" />
            </span>
            <h3 className="truncate text-lg font-semibold text-slate-100" title={topic.name}>
              {topic.name}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {isRecent && (
              <Badge className="border-blue-400/30 bg-blue-500/10 text-blue-300">
                <Sparkles className="h-3.5 w-3.5" /> Recent
              </Badge>
            )}
            {topic.lastUpdated && <span>Updated {topic.lastUpdated}</span>}
            <span className="select-none">•</span>
            <span>{topic.meetingsCount ?? 0} meetings</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton title="Edit topic" onClick={() => alert(`Edit: ${topic.name}`)}>
            <Edit2 />
          </IconButton>
          <IconButton title="Delete topic" onClick={() => alert(`Delete: ${topic.name}`)}>
            <Trash2 />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[150px_1fr]">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Hash className="h-4 w-4" />
          <span className="font-medium">Access ID</span>
        </div>
        <div className="min-w-0">
          <Copyable value={String(topic.topicAccessId ?? "")} mono />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Lock className="h-4 w-4" />
          <span className="font-medium">Password</span>
        </div>
        <div className="min-w-0">
          <Copyable value={String(topic.accessPassword ?? "********")} mono />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User className="h-4 w-4" />
          <span className="font-medium">Created by</span>
        </div>
        <div className="flex items-center">
          <span className="truncate rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-sm text-slate-100">
            {topic.createdBy ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

const SORTS = [
  { key: "updated", label: "Recently updated" },
  { key: "meetings", label: "Most meetings" },
  { key: "name", label: "Name A→Z" },
];

function sortTopics(topics, key) {
  switch (key) {
    case "meetings":
      return [...topics].sort((a, b) => (b.meetingsCount ?? 0) - (a.meetingsCount ?? 0));
    case "name":
      return [...topics].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    case "updated":
    default:
      return [...topics];
  }
}

const CreateTopicButton = ({ className = "", children, onClick }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 rounded-xl border border-transparent bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
    onClick={onClick}
  >
    <PlusCircle className="h-4 w-4" />
    {children || "Create Topic"}
  </button>
);

/* ---------- Main component ---------- */
const TopicManagement = () => {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(SORTS[0].key);
  const [topics, setTopics] = useState(mockTopics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const openCreate = () => setShowCreate(true);
  const closeCreate = () => setShowCreate(false);

  // --- Robust normalization: converts API shapes to safe UI strings ---
  const normalizeTopic = (t, idx = 0) => {
    // Derive a friendly creator name if createdBy is an object
    const creator =
      t?.createdBy && typeof t.createdBy === "object"
        ? (t.createdBy.name ?? t.createdBy.username ?? String(t.createdBy.id ?? "You"))
        : (t?.createdBy ?? "You");

    // Ensure topicAccessId is a string
    const accessId =
      typeof t?.topicAccessId === "string"
        ? t.topicAccessId
        : (t?.accessId ? String(t.accessId) : `topic-${(t?.id ?? idx + 1)}`);

    // Ensure password string
    const password =
      typeof t?.accessPassword === "string"
        ? t.accessPassword
        : (t?.password ? String(t.password) : "********");

    // Normalize subtopics to an array of strings (for display/search)
    const subtopicStrings = Array.isArray(t?.subtopics)
      ? t.subtopics.map((s) =>
          typeof s === "string" ? s : (s?.name ?? s?.title ?? "")
        )
      : [];

    return {
      id: t?.id ?? idx + 1,
      name: t?.name ?? t?.title ?? "Untitled Topic",
      topicAccessId: accessId,
      accessPassword: password,
      createdBy: creator,                 // ✅ always a string now
      subtopics: subtopicStrings,         // ✅ uniform strings for filtering
      lastUpdated: t?.lastUpdated ?? "—",
      meetingsCount: Number.isFinite(t?.meetingsCount) ? t.meetingsCount : 0,
    };
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id ?? user?.userId;
        const res = await getTopic(userId);

        console.log("getTopic() raw response:", res);

        const arr =
          Array.isArray(res) ? res :
          Array.isArray(res?.data) ? res.data :
          Array.isArray(res?.topics) ? res.topics :
          [];

        console.log("getTopic() normalized array:", arr);

        if (!cancelled && arr.length) {
          setTopics(arr.map((t, idx) => normalizeTopic(t, idx)));
        }
      } catch (e) {
        console.error("getTopic() failed:", e);
        if (!cancelled) setError(e?.message || "Failed to fetch topics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Called when CreateTopic succeeds
  const handleCreated = (res) => {
    const newTopicRaw = res?.data ?? res;
    if (!newTopicRaw) return;
    const normalized = normalizeTopic(newTopicRaw, topics.length);
    setTopics((prev) => [normalized, ...prev]);
    closeCreate();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? topics.filter((t) => {
          const nameOk = (t.name || "").toLowerCase().includes(q);
          const idOk = (t.topicAccessId || "").toLowerCase().includes(q);
          const subtopicOk = (Array.isArray(t.subtopics) ? t.subtopics : []).some((s) =>
            (s || "").toLowerCase().includes(q)
          );
          return nameOk || idOk || subtopicOk;
        })
      : topics;
    return sortTopics(base, sortKey);
  }, [query, sortKey, topics]);

  return (
    <div className="mx-auto max-w-7xl p-6 text-slate-100 bg-slate-950 min-h-screen">
      <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, access id, subtopic..."
                className="w-full rounded-xl border border-slate-600 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
            </div>

            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-slate-400">Sort</span>
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-600 bg-slate-900 py-2.5 pl-3 pr-8 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <CreateTopicButton onClick={openCreate} />
        </div>

        {loading && <p className="mt-3 text-sm text-slate-400">Loading topics…</p>}
        {error && <p className="mt-3 text-sm text-red-400">Error: {error}</p>}
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <TopicCard key={t.id} topic={t} />
        ))}

        <button
          type="button"
          onClick={openCreate}
          className="group flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-6 text-center transition hover:border-slate-600 hover:bg-slate-700"
        >
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-700">
            <PlusCircle className="h-7 w-7 text-slate-200" />
          </div>
          <h3 className="text-base font-semibold">Add New Topic</h3>
          <p className="mt-1 max-w-xs text-sm text-slate-400">
            Create an organizational topic to group and index your meetings.
          </p>
        </button>
      </section>

      {/* Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={closeCreate} aria-hidden="true" />
          {/* dialog */}
          <div className="relative z-10 w-full max-w-xl p-4">
            <div className="mb-2 flex justify-between">
              <h3 className="text-lg font-semibold">New Topic</h3>
              <button
                onClick={closeCreate}
                className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            <CreateTopic onCreated={handleCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicManagement;
