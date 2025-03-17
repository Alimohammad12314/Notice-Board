import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Notice, getNotices, createNotice, deleteNotice } from "../lib/api";

export default function NoticeBoard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const notice = await createNotice(newNotice);
      setNotices([notice, ...notices]);
      setNewNotice({ title: "", content: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating notice:", error);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await deleteNotice(id);
      setNotices(notices.filter((notice) => notice._id !== id));
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  const canCreateNotice = ["admin", "teacher"].includes(user?.role || "");

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Create Notice Section */}
      {canCreateNotice && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              <Plus className="h-5 w-5" />
              Create New Notice
            </button>
          ) : (
            <form onSubmit={handleCreateNotice} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newNotice.title}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter notice title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={newNotice.content}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, content: e.target.value })
                  }
                  rows={5}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Write your notice here..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-xl"
                >
                  Post Notice
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Notice Cards Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notices.length === 0 ? (
          <div className="text-center col-span-full text-gray-500 text-sm">
            No notices yet.
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {notice.title}
                  </h3>
                  {(user?.role === "admin" ||
                    user?.id === notice.createdBy._id) && (
                    <button
                      onClick={() => handleDeleteNotice(notice._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Delete notice"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {notice.content}
                </p>
                <div className="pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <p>
                    Posted by{" "}
                    <span className="font-medium">
                      {notice.createdBy.fullName}
                    </span>{" "}
                    ({notice.createdBy.role})
                  </p>
                  <p>{format(new Date(notice.createdAt), "PPP")}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
