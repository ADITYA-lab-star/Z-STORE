import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "sonner";
import { ShieldCheck, User } from "lucide-react";

const ROLE_OPTIONS = ["customer", "admin"];

const UserManager = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUid, setUpdatingUid] = useState(null);

  const getToken = useCallback(() => currentUser.getIdToken(true), [currentUser]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  }, [getToken]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (uid, role) => {
    setUpdatingUid(uid);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${uid}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.map((u) => u.firebaseUid === uid ? { ...u, role } : u));
      toast.success(`Role updated to '${role}'`);
    } catch { toast.error("Failed to update role"); }
    finally { setUpdatingUid(null); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-black text-white uppercase tracking-wider">Users</h3>
        <p className="text-sm text-white/40 mt-1">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {["User", "Email", "Joined", "Role"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {users.map((u) => (
                  <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-black text-white shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-semibold text-white line-clamp-1">{u.name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role || "customer"}
                          onChange={(e) => handleRoleChange(u.firebaseUid, e.target.value)}
                          disabled={updatingUid === u.firebaseUid}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-violet-500 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r} className="bg-[#0B0E14] capitalize">{r}</option>
                          ))}
                        </select>
                        {u.role === "admin" && <ShieldCheck className="w-4 h-4 text-violet-400" />}
                        {updatingUid === u.firebaseUid && (
                          <div className="w-3.5 h-3.5 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManager;
