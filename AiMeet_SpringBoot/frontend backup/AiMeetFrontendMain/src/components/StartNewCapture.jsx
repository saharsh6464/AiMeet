import React, { useState, useMemo } from 'react';
import { PlayCircle, Calendar, Users } from 'lucide-react';

const StartNewCapture = ({ onCreate }) => {
  // createSubtopicDto fields
  const [name, setName] = useState('');
  const [aiSummary, setAiSummary] = useState(''); // optional
  const [title, setTitle] = useState('');
  const [hostid, setHostid] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  // sensible defaults: now and +30 minutes, formatted for datetime-local
  useMemo(() => {
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 60 * 1000);

    const fmt = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    setStartTime(fmt(now));
    setEndTime(fmt(in30));
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();

    // basic validation
    if (!name || !title || !startTime || !endTime) {
      alert('Please fill in Name, Title, Start Time and End Time.');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      alert('End time must be after start time.');
      return;
    }

    const user = localStorage.getItem('user');
    const resolvedHostId = user ? JSON.parse(user)?.id : (hostid ? Number(hostid) : undefined);

    if (!resolvedHostId || Number.isNaN(resolvedHostId)) {
      alert('Host ID is required.');
      return;
    }

    // Build payload EXACTLY like createSubtopicDto
    const payload = {
      name: name.trim(),
      aiSummary: aiSummary?.trim() || '', // optional
      startTime, // 'YYYY-MM-DDTHH:mm' -> LocalDateTime on backend
      endTime,
      title: title.trim(),
      hostid: Number(resolvedHostId),
    };

    try {
      setLoading(true);

      // Example API call:
      // const res = await fetch('/api/subtopics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error('Failed to create subtopic');

      console.log('Creating Subtopic (createSubtopicDto payload):', payload);
      alert('Subtopic created successfully!');

      onCreate?.(payload);

      // reset (keep times to speed up creating another)
      setName('');
      setAiSummary('');
      setTitle('');
      if (!user) setHostid('');
    } catch (err) {
      console.error(err);
      alert('Something went wrong while creating the subtopic.');
    } finally {
      setLoading(false);
    }
  };

  const userPresent = Boolean(localStorage.getItem('user'));

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto 
                    dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center tracking-tight dark:text-white">
        <PlayCircle className="w-6 h-6 mr-3 text-blue-600" /> Create Meeting

      </h2>
      <p className="text-gray-500 mb-8 text-sm dark:text-gray-400">
        Payload matches <code>createSubtopicDto</code> (<code>name</code>, <code>aiSummary</code>, <code>startTime</code>, <code>endTime</code>, <code>title</code>, <code>hostid</code>).
      </p>

      <form onSubmit={handleStart} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Meeting Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Polymorphism Deep Dive"
            required
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Weekly Standup"
            required
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
          />
        </div>


        {/* Start Time */}
        <div>
          <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1 flex items-center dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1 flex items-center dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
            End Time
          </label>
          <input
            type="datetime-local"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 transition duration-150
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Host ID (only show if not found in localStorage) */}
        {!userPresent && (
          <div>
            <label htmlFor="hostid" className="block text-sm font-medium text-gray-700 mb-1 flex items-center dark:text-gray-300">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              Host ID
            </label>
            <input
              type="number"
              id="hostid"
              value={hostid}
              onChange={(e) => setHostid(e.target.value)}
              placeholder="e.g., 42"
              required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-400
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-8 text-base font-semibold text-white bg-blue-600 rounded-lg 
                     hover:bg-blue-700 transition duration-200 shadow-md shadow-blue-300/50
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating…' : 'Create Subtopic'}
        </button>
      </form>
    </div>
  );
};

export default StartNewCapture;
