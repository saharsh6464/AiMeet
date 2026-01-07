
import React, { useMemo, useState } from "react";
import { createTopic } from "../service/Topic";
import { Check, Loader2 } from "lucide-react";

function CreateTopic({ onCreated }) {
  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null; // expects { id: <number>, ... }
    } catch {
      return null;
    }
  }, []);

  // Use id from localStorage; fall back if the object used userId
  const userId = storedUser?.id ?? storedUser?.userId ?? null;

  const [form, setForm] = useState({
    name: "",
    topicAccessId: "",
    accessPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const slugify = (s) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const autoFillAccessId = () => {
    if (!form.name) return;
    setForm((f) => ({ ...f, topicAccessId: slugify(f.name) }));
  };

  const validate = () => {
    const next = {};
    if (!userId) next.userId = "No user in localStorage. Please log in.";
    if (!form.name?.trim()) next.name = "Name is required.";
    if (!form.topicAccessId?.trim()) next.topicAccessId = "Access ID is required.";
    if (!/^[a-z0-9-]+$/i.test(form.topicAccessId))
      next.topicAccessId = "Access ID can contain only letters, numbers, and dashes.";
    if (!form.accessPassword?.trim()) next.accessPassword = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreated(null);
    if (!validate()) return;

    // Payload must match TopicDto exactly (omit id on create)
    const dto = {
      userId: Number(userId), // int per TopicDto
      name: form.name.trim(),
      topicAccessId: form.topicAccessId.trim(),
      accessPassword: form.accessPassword,
    };

    try {
      setSubmitting(true);
      const res = await createTopic(dto);
      console.log("createTopic() response:", res);
      setCreated(res);
      setForm({ name: "", topicAccessId: "", accessPassword: "" });
      setErrors({});
      if (typeof onCreated === "function") onCreated(res);
    } catch (err) {
      setErrors((e) => ({ ...e, submit: err.message || "Failed to create topic" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl rounded-2xl border border-slate-700 bg-slate-800 p-5 text-slate-100">
      <h2 className="mb-4 text-lg font-semibold">Create Topic</h2>

      {!userId && (
        <div className="mb-3 rounded-md border border-amber-600 bg-amber-900/20 px-3 py-2 text-amber-200">
          No user found in localStorage under key <code className="font-mono">"user"</code>.
          Ensure you store something like: <code className="font-mono">{"{ id: 1, ... }"}</code>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-slate-300">
            Topic Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Product Strategy 2025"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="topicAccessId" className="block text-sm text-slate-300">
              Access ID *
            </label>
            <button
              type="button"
              onClick={autoFillAccessId}
              className="text-xs underline text-slate-300 hover:text-white"
            >
              Auto-fill from name
            </button>
          </div>
          <input
            id="topicAccessId"
            name="topicAccessId"
            type="text"
            value={form.topicAccessId}
            onChange={handleChange}
            placeholder="e.g. product-strategy-2025"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
          {errors.topicAccessId && <p className="mt-1 text-xs text-red-400">{errors.topicAccessId}</p>}
        </div>

        <div>
          <label htmlFor="accessPassword" className="mb-1 block text-sm text-slate-300">
            Access Password *
          </label>
          <input
            id="accessPassword"
            name="accessPassword"
            type="password"
            value={form.accessPassword}
            onChange={handleChange}
            placeholder="Enter a password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
          {errors.accessPassword && <p className="mt-1 text-xs text-red-400">{errors.accessPassword}</p>}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !userId}
            className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {submitting ? "Creating..." : "Create Topic"}
          </button>

          {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}
          {created && !errors.submit && <p className="text-sm text-emerald-400">Topic created!</p>}
        </div>
      </form>

      {created && (
        <pre className="mt-4 max-h-48 overflow-auto rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200">
{JSON.stringify(created, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default CreateTopic;
