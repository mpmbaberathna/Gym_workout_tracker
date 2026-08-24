import { useEffect, useState } from "react";
import api from "../../api/axios";
import { validateName, validateEmail } from "../../utils/validation";

function Users() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handler = () => fetchUsers();
    window.addEventListener('users:refresh', handler);
    return () => window.removeEventListener('users:refresh', handler);
  }, []);

  // also refresh on socket events if socket client is available
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const socketClient = await import('../../api/socket');
        socketClient.default.on('users:changed', () => { if (mounted) fetchUsers(); });
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const roleOrder = (role) => {
    // define priority for sorting: admin first, then trainer, then member
    if (role === "admin") return 1;
    if (role === "trainer") return 2;
    return 3;
  };

  const visibleUsers = users
    .filter((u) => {
      // role filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      // search by name or email
      if (!query) return true;
      const q = query.toLowerCase();
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });

  const changeRole = async (userId, newRole) => {
    try {
      await api.put(
        `/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Role updated");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User deleted");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const updateUser = async (userId) => {
    try {
      const payload = {};
      if (editName) payload.name = editName;
      if (editEmail) payload.email = editEmail;
      if (payload.name) {
        const n = validateName(payload.name);
        if (!n.valid) return alert(n.message);
      }
      if (payload.email) {
        const e = validateEmail(payload.email);
        if (!e.valid) return alert(e.message);
      }

      await api.put(`/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User updated");
      setEditingId(null);
      setEditName("");
      setEditEmail("");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="rounded-3xl bg-brand-light p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 w-full max-w-md">
          <input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-brand-border bg-brand-card px-4 py-2 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-gray">Filter:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-full border border-brand-border bg-brand-card px-4 py-2 text-sm font-bold text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark shadow-sm"
          >
            <option value="all">All</option>
            <option value="member">Member</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <div className={`overflow-x-auto rounded-2xl border border-brand-border bg-brand-card shadow-sm ${expanded ? "max-h-[80vh]" : "max-h-80"} overflow-y-auto`}>
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-brand-light sticky top-0 z-10 border-b border-brand-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gray">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gray">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gray">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gray">Change Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gray text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {visibleUsers.map((user) => (
                <tr key={user._id} className="hover:bg-brand-light transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user._id ? (
                      <input
                        className="w-full rounded-lg border border-brand-border bg-brand-light px-3 py-1.5 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-brand-dark">{user.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === user._id ? (
                      <input
                        className="w-full rounded-lg border border-brand-border bg-brand-light px-3 py-1.5 text-sm text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      <span className="text-brand-gray font-medium">{user.email}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-brand-light border border-brand-border px-3 py-1 text-xs font-bold text-brand-dark uppercase tracking-wider">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'admin' ? (
                      <span className="text-brand-gray italic text-xs">Immutable</span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user._id, e.target.value)}
                        className="rounded-lg border border-brand-border bg-brand-light px-3 py-1.5 text-sm font-medium text-brand-dark outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                      >
                        <option value="member">member</option>
                        <option value="trainer">trainer</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {user.role === 'admin' ? (
                      <span className="text-brand-gray">—</span>
                    ) : editingId === user._id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                            setEditEmail("");
                          }}
                          className="rounded-full border border-brand-border bg-brand-card px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateUser(user._id)}
                          className="rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold text-brand-primary-text shadow-sm hover:bg-black/90"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(user._id);
                            setEditName(user.name || "");
                            setEditEmail(user.email || "");
                          }}
                          className="rounded-full border border-brand-border bg-brand-card px-4 py-1.5 text-xs font-bold text-brand-dark shadow-sm hover:bg-brand-light"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this user?")) {
                              deleteUser(user._id);
                            }
                          }}
                          className="rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm font-medium text-brand-gray">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* fade overlay when collapsed and content overflows */}
        {!expanded && users.length > 5 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent rounded-b-2xl" />
        )}
      </div>

      {/* see more / show less */}
      {users.length > 5 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-brand-border bg-brand-card px-6 py-2 text-sm font-bold text-brand-dark shadow-sm hover:bg-brand-light transition"
          >
            {expanded ? "Show Less" : "View All Users"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Users;
