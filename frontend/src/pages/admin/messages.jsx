import { useEffect, useState } from "react";
import axios from "../../api/axios";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const loadMessages = async () => {
    const res = await axios.get("/messages");
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const sendReply = async (id) => {
    if (!replyText.trim()) return;

    await axios.put(`/messages/${id}/reply`, { reply: replyText.trim() });
    setReplyText("");
    setActiveReplyId(null);
    loadMessages();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await axios.delete(`/messages/${deleteId}`);
    setDeleteId(null);
    loadMessages();
  };

  return (
    <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
      <div className="relative z-10 mx-auto max-w-4xl space-y-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-3">Admin</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Contact Messages</h1>
          <p className="mt-4 text-base text-brand-gray leading-relaxed">Review and reply to messages sent by users.</p>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-border bg-brand-card/50 px-8 py-12 text-center text-sm font-bold text-brand-dark">
            No messages received yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm transition hover:shadow-md hover:border-brand-dark/20"
              >
                <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-4 mb-4">
                  <div>
                    <p className="text-xl font-bold text-brand-dark">{msg.name}</p>
                    <p className="text-sm font-medium text-brand-gray mt-1">{msg.email}</p>
                  </div>

                  {deleteId === msg._id ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={confirmDelete}
                        className="rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100 transition"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="rounded-full border border-brand-border bg-brand-card px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(msg._id)}
                      className="rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="text-base text-brand-dark leading-relaxed font-medium mb-6">
                  {msg.message}
                </div>

                {msg.reply && (
                  <div className="rounded-2xl bg-brand-light p-5 border border-brand-border shadow-sm mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-brand-dark"></span>
                      Admin reply
                    </p>
                    <p className="text-sm font-medium text-brand-gray leading-relaxed">{msg.reply}</p>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-brand-border">
                  {activeReplyId === msg._id ? (
                    <div className="space-y-4">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full resize-none rounded-2xl border border-brand-border bg-brand-card px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => sendReply(msg._id)}
                          className="rounded-full bg-brand-primary px-6 py-2 text-xs font-bold text-brand-primary-text shadow-sm hover:bg-black/90 transition"
                        >
                          Send reply
                        </button>
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="rounded-full border border-brand-border bg-brand-card px-6 py-2 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReplyId(msg._id)}
                      className="rounded-full border border-brand-border bg-brand-light px-6 py-2 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light transition"
                    >
                      {msg.reply ? "Update Reply" : "Reply"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;