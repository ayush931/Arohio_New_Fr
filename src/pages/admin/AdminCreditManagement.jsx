import { useEffect, useState } from "react";
import { useToast } from "../../components/common/ToastProvider";

export default function AdminCreditManagement() {
  const INK = "#0f172a",
    TEAL = "#21c7b8",
    LINE = "#e6edf4",
    BG = "#f6f8fb";

  const { showToast } = useToast();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/`);
        const usersData = await userRes.json();

        const planRes = await fetch(`${import.meta.env.VITE_API_BASE}/user-plans/`);
        const plansData = await planRes.json();

        const mapped = usersData.map((user) => {
          const plan = plansData.find(
            (p) => p.user_id == user.id && p.is_active
          );

          const pdfIssued = plan?.pdf_limit || 0;
          const pdfUsed = plan?.pdf_used || 0;

          const imageIssued = plan?.image_limit || 0;
          const imageUsed = plan?.image_used || 0;

          return {
            id: user.id,
            planId: plan?.id,
            name: `${user.first_name} ${user.last_name || ""}`,
            email: user.email,
            plan: plan?.plan_name || "No Plan",
            pdfIssued,
            pdfUsed,
            pdfBalance: pdfIssued - pdfUsed,
            imageIssued,
            imageUsed,
            imageBalance: imageIssued - imageUsed,
            editPdf: pdfIssued,
            editImage: imageIssued,
          };
        });

        setUsers(mapped);
      } catch (err) {
        showToast("Failed to load data", "error");
      }
    };

    fetchData();
  }, []);

  const handleChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, [field]: Number(value) } : u
      )
    );
  };

  const handleSave = async (user) => {
    if (!user.planId) {
      showToast("Plan not found", "error");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/user-plans/${user.planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdf_limit: user.editPdf,
          image_limit: user.editImage,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        showToast(data?.detail || "Update failed", "error");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== user.id) return u;

          return {
            ...u,
            pdfIssued: user.editPdf,
            imageIssued: user.editImage,
            pdfBalance: user.editPdf - u.pdfUsed,
            imageBalance: user.editImage - u.imageUsed,
          };
        })
      );

      showToast("Updated successfully", "success");
    } catch {
      showToast("Server error", "error");
    }
  };

  return (
    <div
      className="container py-3 text-start"
      style={{ background: BG, minHeight: "100vh" }}
    >
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:900;color:var(--ink)}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid var(--line);border-radius:6px;box-shadow:0 4px 14px rgba(2,8,23,.05);padding:14px;margin-bottom:12px}
        .table{width:100%;border-collapse:collapse}
        .table th,.table td{padding:12px;border-bottom:1px solid var(--line);font-size:.9rem;text-align:left}
        .pill{font-size:.75rem;font-weight:700;padding:4px 10px;border-radius:999px;background:#f8fafc;border:1px solid #e2e8f0;color:#475569}
        .input{width:70px;padding:6px;border:1px solid #ccc;border-radius:4px}
        .btn{padding:6px 10px;border:none;border-radius:4px;background:${TEAL};color:#fff;font-weight:700}

        @media(max-width:768px){
          .desktop-table{display:none}
          .mobile-card{display:block}
        }
        @media(min-width:769px){
          .mobile-card{display:none}
        }
      `}</style>

      <h1 className="h5 title mb-3">Credit Management</h1>

      <div className="desktop-table card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Plan</th>
              <th>PDF Issued</th>
              <th>PDF Used</th>
              <th>PDF Balance</th>
              <th>Plan Id</th>
              <th>Image Issued</th>
              <th>Image Used</th>
              <th>Image Balance</th>
              <th>Edit PDF</th>
              <th>Edit Image</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="pill">{u.plan}</span></td>
                <td>{u.pdfIssued}</td>
                <td>{u.pdfUsed}</td>
                <td>{u.pdfBalance}</td>
                <td>{u.planId}</td>
                <td>{u.imageIssued}</td>
                <td>{u.imageUsed}</td>
                <td>{u.imageBalance}</td>
                <td>
                  <input
                    className="input"
                    value={u.editPdf}
                    onChange={(e) => handleChange(u.id,"editPdf",e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={u.editImage}
                    onChange={(e) => handleChange(u.id,"editImage",e.target.value)}
                  />
                </td>
                <td>
                  <button className="btn" onClick={() => handleSave(u)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-card">
        {users.map((u) => (
          <div key={u.id} className="card">
            <div><strong>{u.name}</strong></div>
            <div className="muted">{u.email}</div>
            <div>Plan: {u.plan}</div>
            <div>PDF: {u.pdfIssued} / {u.pdfUsed} (Balance {u.pdfBalance})</div>
            <div>Image: {u.imageIssued} / {u.imageUsed} (Balance {u.imageBalance})</div>

            <div style={{marginTop:10}}>
              <input
                className="input"
                value={u.editPdf}
                onChange={(e)=>handleChange(u.id,"editPdf",e.target.value)}
              />
              <input
                className="input"
                value={u.editImage}
                onChange={(e)=>handleChange(u.id,"editImage",e.target.value)}
                style={{marginLeft:6}}
              />
            </div>

            <button
              className="btn"
              style={{marginTop:10,width:"100%"}}
              onClick={()=>handleSave(u)}
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}