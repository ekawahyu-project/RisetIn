import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, getToken, setToken } from "../lib/api";

const AppContext = createContext(null);

const EMPTY_USER = {
  id: "",
  nama: "",
  role: "Mahasiswa",
  roleKey: "mahasiswa",
  kampus: "",
  sektor: "",
  inisial: "U",
  bio: "",
  email: "",
  telp: "",
  stats: { riset: 0, kolaborasi: 0, pengunjung: "0", diadopsi: 0, kebutuhan: 0, dilihat: "0" },
};

export function AppProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(Boolean(getToken()));
  const [user, setUser] = useState(null);
  const [riset, setRiset] = useState([]);
  const [comments, setComments] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [masuk, setMasuk] = useState([]);
  const [berjalan, setBerjalan] = useState([]);
  const [indPengajuan, setIndPengajuan] = useState([]);
  const [indBerjalan, setIndBerjalan] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const loadAppData = useCallback(async () => {
    const [risetData, collabData, notifData] = await Promise.all([
      apiFetch("/api/riset"),
      apiFetch("/api/collaborations"),
      apiFetch("/api/notifications"),
    ]);
    setRiset(risetData.riset || []);
    setMasuk(collabData.masuk || []);
    setBerjalan(collabData.berjalan || []);
    setIndPengajuan(collabData.indPengajuan || []);
    setIndBerjalan(collabData.indBerjalan || []);
    setNotifications(notifData.notifications || []);
  }, []);

  const refreshMe = useCallback(async () => {
    const me = await apiFetch("/api/auth/me");
    setUser(me.user);
    return me.user;
  }, []);

  // Restore session from JWT token on startup
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const me = await apiFetch("/api/auth/me");
        if (!active) return;
        setUser(me.user);
        await loadAppData();
      } catch (err) {
        if (!active) return;
        if (err.status === 401) {
          setToken(null);
          setUser(null);
        } else {
          showToast(err.message);
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadAppData, showToast]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(data.token);
      setUser(data.user);
      await loadAppData();
      showToast(
        data.user.roleKey === "industri"
          ? `Berhasil masuk sebagai ${data.user.nama} (Industri)`
          : `Berhasil masuk sebagai ${data.user.nama}`
      );
      return data.user;
    },
    [loadAppData, showToast]
  );

  const register = useCallback(
    async ({ nama, email, password, role, kampus, sektor }) => {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { nama, email, password, role, kampus, sektor },
      });
      setToken(data.token);
      setUser(data.user);
      await loadAppData();
      showToast("Berhasil masuk ke mode demo RisetIn!");
      return data.user;
    },
    [loadAppData, showToast]
  );

  const demoLogin = useCallback(
    async (targetRole) => {
      const data = await apiFetch("/api/auth/demo", {
        method: "POST",
        body: { role: targetRole },
      });
      setToken(data.token);
      setUser(data.user);
      await loadAppData();
      showToast(
        targetRole === "industri"
          ? `Masuk demo sebagai ${data.user.nama} (Industri)`
          : `Masuk demo sebagai ${data.user.nama} (Mahasiswa)`
      );
      return data.user;
    },
    [loadAppData, showToast]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setRiset([]);
    setComments({});
    setNotifications([]);
    setMasuk([]);
    setBerjalan([]);
    setIndPengajuan([]);
    setIndBerjalan([]);
    showToast("Anda telah keluar");
  }, [showToast]);

  const updateProfile = useCallback(
    async (payload) => {
      const data = await apiFetch("/api/auth/profile", {
        method: "PATCH",
        body: payload,
      });
      setUser(data.user);
      showToast("Perubahan profil disimpan");
      return data.user;
    },
    [showToast]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    try {
      await apiFetch("/api/notifications/read-all", { method: "POST" });
    } catch {
      // keep optimistic UI
    }
  }, []);

  const addRiset = useCallback(
    async (formData) => {
      const data = await apiFetch("/api/riset", { method: "POST", formData });
      setRiset((prev) => [data.riset, ...prev]);
      await Promise.all([refreshMe(), apiFetch("/api/notifications").then((n) => setNotifications(n.notifications || []))]);
      showToast("Riset berhasil diterbitkan!");
      return data.riset;
    },
    [refreshMe, showToast]
  );

  const trackRisetView = useCallback(async (id) => {
    try {
      const data = await apiFetch(`/api/riset/${id}?trackView=1`);
      if (data?.riset) {
        setRiset((prev) => prev.map((r) => (r.id === String(id) ? data.riset : r)));
      }
    } catch {
      // non-blocking
    }
  }, []);

  const toggleLike = useCallback(
    async (id) => {
      const key = String(id);
      // Optimistic toggle
      setRiset((prev) =>
        prev.map((r) =>
          r.id === key ? { ...r, liked: !r.liked, suka: r.liked ? Math.max(0, r.suka - 1) : r.suka + 1 } : r
        )
      );
      try {
        const res = await apiFetch(`/api/riset/${key}/like`, { method: "POST" });
        setRiset((prev) => prev.map((r) => (r.id === key ? { ...r, liked: res.liked, suka: res.suka } : r)));
      } catch (err) {
        // Revert on failure
        setRiset((prev) =>
          prev.map((r) =>
            r.id === key ? { ...r, liked: !r.liked, suka: r.liked ? Math.max(0, r.suka - 1) : r.suka + 1 } : r
          )
        );
        showToast(err.message);
      }
    },
    [showToast]
  );

  const fetchComments = useCallback(async (risetId) => {
    const key = String(risetId);
    const data = await apiFetch(`/api/riset/${key}/comments`);
    setComments((prev) => ({ ...prev, [key]: data.comments || [] }));
    return data.comments || [];
  }, []);

  const addComment = useCallback(
    async (risetId, text) => {
      const key = String(risetId);
      const data = await apiFetch(`/api/riset/${key}/comments`, {
        method: "POST",
        body: { text },
      });
      setComments((prev) => ({ ...prev, [key]: [...(prev[key] || []), data.comment] }));
      setRiset((prev) => prev.map((r) => (r.id === key ? { ...r, komentar: data.komentar } : r)));
      return data.comment;
    },
    []
  );

  const requestCollaboration = useCallback(
    async (risetId, pesan) => {
      const data = await apiFetch("/api/collaborations", {
        method: "POST",
        body: { risetId, pesan },
      });
      setIndPengajuan((prev) => [data.pengajuan, ...prev]);
      refreshMe().catch(() => {});
      showToast("Pengajuan kolaborasi terkirim");
      return data.pengajuan;
    },
    [refreshMe, showToast]
  );

  const acceptMasuk = useCallback(
    async (id) => {
      try {
        const data = await apiFetch(`/api/collaborations/${id}/respond`, {
          method: "PATCH",
          body: { action: "accept" },
        });
        setMasuk((prev) => prev.filter((m) => m.id !== String(id)));
        setBerjalan((prev) => [
          {
            id: data.collaboration.id,
            risetId: data.collaboration.risetId,
            perusahaan: data.collaboration.perusahaan,
            updated: data.collaboration.updated,
            tahap: data.collaboration.tahap,
          },
          ...prev,
        ]);
        refreshMe().catch(() => {});
        showToast(`Kolaborasi dengan ${data.collaboration.perusahaan} diterima`);
      } catch (err) {
        showToast(err.message);
      }
    },
    [refreshMe, showToast]
  );

  const rejectMasuk = useCallback(
    async (id) => {
      try {
        const data = await apiFetch(`/api/collaborations/${id}/respond`, {
          method: "PATCH",
          body: { action: "reject" },
        });
        setMasuk((prev) => prev.filter((m) => m.id !== String(id)));
        showToast(`Permintaan dari ${data.collaboration.perusahaan} ditolak`);
      } catch (err) {
        showToast(err.message);
      }
    },
    [showToast]
  );

  const advanceStage = useCallback(
    async (id) => {
      try {
        const data = await apiFetch(`/api/collaborations/${id}/stage`, { method: "PATCH" });
        setBerjalan((prev) =>
          prev.map((p) =>
            p.id === String(id) ? { ...p, tahap: data.collaboration.tahap, updated: data.collaboration.updated } : p
          )
        );
        if (data.collaboration.tahap >= 4) {
          loadAppData().catch(() => {});
          refreshMe().catch(() => {});
        }
        showToast("Tahapan kolaborasi diperbarui");
      } catch (err) {
        showToast(err.message);
      }
    },
    [loadAppData, refreshMe, showToast]
  );

  const authed = Boolean(user);
  const role = user?.roleKey || "mahasiswa";

  const value = useMemo(
    () => ({
      authLoading,
      authed,
      login,
      register,
      demoLogin,
      logout,
      updateProfile,
      role,
      user: user || EMPTY_USER,
      riset,
      addRiset,
      trackRisetView,
      toggleLike,
      comments,
      fetchComments,
      addComment,
      notifications,
      unreadCount,
      markAllRead,
      masuk,
      berjalan,
      requestCollaboration,
      acceptMasuk,
      rejectMasuk,
      advanceStage,
      indPengajuan,
      indBerjalan,
      refreshData: loadAppData,
      toast,
      showToast,
    }),
    [
      authLoading,
      authed,
      login,
      register,
      demoLogin,
      logout,
      updateProfile,
      role,
      user,
      riset,
      addRiset,
      trackRisetView,
      toggleLike,
      comments,
      fetchComments,
      addComment,
      notifications,
      unreadCount,
      markAllRead,
      masuk,
      berjalan,
      requestCollaboration,
      acceptMasuk,
      rejectMasuk,
      advanceStage,
      indPengajuan,
      indBerjalan,
      loadAppData,
      toast,
      showToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
