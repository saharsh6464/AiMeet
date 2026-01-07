import React, { useState } from "react";
import { Layers3, Hash, Loader2, Plus, X } from "lucide-react";
import { getSubtopic, createSubtopic } from "../service/SubtopicApi";

const SubTopics = ({ onGetMeetingDetails }) => {
  const [topicAccessId, setTopicAccessId] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]); // array of { id, name }

  const handleFetch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setItems([]);

    const payload = { topicAccessId, accessPassword };

    try {
      const resp = await getSubtopic(payload);
      const resData = resp?.data ?? resp; // works for axios or fetch

      if (typeof resData === "string") {
        setError(resData);
        return;
      }

      // Normalize to array
      const list = Array.isArray(resData) ? resData : resData ? [resData] : [];
      if (!list.length) {
        setError("No subtopics found.");
        return;
      }
      setItems(list);
    } catch (err) {
      setError(err?.message || "Failed to fetch subtopics.");
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingDetails = (item) => {
    if (typeof onGetMeetingDetails === "function") onGetMeetingDetails(item);
    else alert(`Get meeting details for: ${item.name} (ID: ${item.id})`);
  };

  // --- Floating Create Subtopic (uses SubtopicDto)
  const [createTopicAccessId, setCreateTopicAccessId] = useState("");
  const [createAccessPassword, setCreateAccessPassword] = useState("");
  const [createStartTime, setCreateStartTime] = useState("");
  const [createEndTime, setCreateEndTime] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const resetCreateState = () => {
    setCreateTopicAccessId("");
    setCreateAccessPassword("");
    setCreateStartTime("");
    setCreateEndTime("");
    setCreateMessage("");
    setCreateLoading(false);
  };

  const handleCreate = async (e) => {
    e?.preventDefault?.();
    setCreateMessage("");

    // Basic validation
    if (!createTopicAccessId || !createAccessPassword) {
      setCreateMessage("Please provide topic access id and password.");
      return;
    }

    setCreateLoading(true);
    // backend expects ISO datetimes or null
    const payload = {
      topicAccessId: createTopicAccessId,
      accessPassword: createAccessPassword,
      startTime: createStartTime ? new Date(createStartTime).toISOString() : null,
      endTime: createEndTime ? new Date(createEndTime).toISOString() : null,
    };

    try {
      const created = await createSubtopic(payload);
      setCreateMessage("Subtopic created successfully.");
      // If backend returned the created subtopic, add it to list
      setItems((prev) => (created ? [created, ...prev] : prev));
      // Close the modal after a short delay so user sees success
      setTimeout(() => {
        setOpenCreate(false);
        resetCreateState();
      }, 600);
    } catch (err) {
      setCreateMessage(
        err?.response?.data || err?.message || "Failed to create subtopic."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl p-6">
        {/* Input Card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
          <h2 className="mb-5 text-lg font-semibold text-indigo-300">Access Meetings</h2>

          <form onSubmit={handleFetch} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col">
              <label className="mb-1 text-xs text-slate-400">Topic Access ID</label>
              <input
                type="text"
                value={topicAccessId}
                onChange={(e) => setTopicAccessId(e.target.value)}
                placeholder="OOPS"
                required
                className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs text-slate-400">Access Password</label>
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                placeholder="1234"
                required
                className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                  loading
                    ? "cursor-not-allowed bg-slate-600"
                    : "bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />Fetching...
                  </>
                ) : (
                  "Get Meetings"
                )}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-400">{error}</p>
          )}
        </div>

        {/* Result Grid */}
        {!!items.length && (
          <>
            <h3 className="mt-8 mb-4 text-sm font-medium text-slate-400">
              Available Subtopics ({items.length})
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg transition duration-300 hover:shadow-indigo-500/30 hover:border-indigo-700"
                >
                  <div className="mb-3 flex items-start justify-between border-b border-slate-700 pb-3">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700">
                          <Layers3 className="h-5 w-5 text-slate-200" />
                        </span>
                        <h4
                          className="truncate text-lg font-semibold text-slate-100"
                          title={item.name}
                        >
                          {item.name}
                        </h4>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-indigo-600/40 bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-300">
                        <Hash className="h-3.5 w-3.5" />
                        ID: {item.id}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMeetingDetails(item)}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    <Layers3 className="h-4 w-4" />
                    Get Meeting Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setOpenCreate(true)}
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-emerald-900/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        aria-haspopup="dialog"
        aria-expanded={openCreate}
        aria-controls="create-subtopic-modal"
      >
        <Plus className="h-5 w-5" />
        Create Subtopic
      </button>

      {/* Floating Modal */}
      {openCreate && (
        <div
          id="create-subtopic-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenCreate(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl sm:mx-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-emerald-300">
                New Subtopic
              </h2>
              <button
                type="button"
                onClick={() => setOpenCreate(false)}
                className="rounded-xl border border-slate-600 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-1 text-xs text-slate-400">Topic Access ID</label>
                <input
                  type="text"
                  value={createTopicAccessId}
                  onChange={(e) => setCreateTopicAccessId(e.target.value)}
                  placeholder="Enter Topic Access ID"
                  required
                  className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs text-slate-400">Access Password</label>
                <input
                  type="password"
                  value={createAccessPassword}
                  onChange={(e) => setCreateAccessPassword(e.target.value)}
                  placeholder="Access password"
                  required
                  className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs text-slate-400">Start Time</label>
                <input
                  type="datetime-local"
                  value={createStartTime}
                  onChange={(e) => setCreateStartTime(e.target.value)}
                  className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs text-slate-400">End Time</label>
                <input
                  type="datetime-local"
                  value={createEndTime}
                  onChange={(e) => setCreateEndTime(e.target.value)}
                  className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Create a subtopic using Topic Access ID and password. Start/End time are optional.
                </p>
                <button
                  type="submit"
                  disabled={createLoading}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                    createLoading
                      ? "cursor-not-allowed bg-slate-600"
                      : "bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  }`}
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />Creating...
                    </>
                  ) : (
                    "Create Subtopic"
                  )}
                </button>
              </div>
            </form>

            {createMessage && (
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">
                {createMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubTopics;