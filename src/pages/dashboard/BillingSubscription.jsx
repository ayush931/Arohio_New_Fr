import { useMemo, useState, useEffect } from "react";
import { FaCreditCard, FaArrowRight, FaDownload } from "react-icons/fa";

export default function BillingSubscription() {
  const INK = "#0f172a";
  const TEAL = "#21c7b8";
  const LINE = "#e6edf4";

  const [annual, setAnnual] = useState(false);
  const authUser = JSON.parse(sessionStorage.getItem("auth_user") || "{}")
  const userId = authUser?.id
  const [plan, setPlan] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [usageLogs, setUsageLogs] = useState([])
  useEffect(() => {
    if (!userId) return

    fetch(`${import.meta.env.VITE_API_BASE}/user-plans/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const activePlan = data.find(p => p.is_active)
          setPlan(activePlan || data[0])
        }
      })
  }, [userId])
  useEffect(() => {
    if (!userId) return

    fetch(`${import.meta.env.VITE_API_BASE}/plan-transactions/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data || [])
      })
  }, [userId])
  useEffect(() => {
    if (!userId) return

    fetch(`${import.meta.env.VITE_API_BASE}/usage-logs/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUsageLogs(data || [])
      })
  }, [userId])
  if (!plan) return null

  const currentPlan = {
    name: plan.plan_name || "Pro Plan",
    price: 25,
    billing: "Monthly",
    renewDate: new Date(plan.end_date).toLocaleDateString(),
    features: [
      `${plan.pdf_limit} PDFs`,
      `${plan.image_limit} Images`,
    ]
  }

  const totalCredits = usageLogs.reduce((sum, log) => sum + (log.credits_used || 0), 0)

  const credits = {
    used: totalCredits,
    total: (plan?.pdf_limit || 0) + (plan?.image_limit || 0),
    nextReset: plan?.end_date ? new Date(plan.end_date).toLocaleDateString() : "-"
  }

  const pct = credits.total > 0
    ? Math.min(100, Math.round((credits.used / credits.total) * 100))
    : 0

  return (
    <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <style>{`
        :root{ --ink:${INK}; --teal:${TEAL}; --line:${LINE}; }
        .title{font-weight:800;color:var(--ink)}
        .grid{display:grid;grid-template-columns:2fr 1fr;gap:18px}
        @media(max-width:992px){ .grid{grid-template-columns:1fr} }
        .card{background:#fff;border:1px solid var(--line);border-radius:4px;box-shadow:0 10px 24px rgba(2,8,23,.04);padding:18px}
        .muted{color:#64748b}
        .switch{position:relative;width:44px;height:24px;background:#e2e8f0;border-radius:999px;display:inline-block;vertical-align:middle;margin:0 8px;cursor:pointer;transition:.2s}
        .knob{position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:999px;transition:.2s;box-shadow:0 2px 6px rgba(0,0,0,.15)}
        .switch.on{background:var(--teal)}
        .switch.on .knob{left:23px}
        .perk{display:flex;align-items:center;gap:8px}
        .chip{display:inline-block;padding:6px 10px;border-radius:999px;font-weight:800;border:1px solid var(--line);background:#f7fafc}
        .btn{display:inline-flex;align-items:center;gap:8px;border:none;border-radius:3px;padding:10px 14px;font-weight:800;cursor:pointer}
        .btn-primary{background:var(--teal);color:#fff}
        .btn-light{background:#fff;border:1px solid var(--line);color:#0f172a}
        .table{width:100%;border-collapse:collapse}
        .table th,.table td{padding:12px;text-align:left;border-bottom:1px solid var(--line);font-size:.9rem}
        .status{font-size:.75rem;background:#e8fbf1;color:#126c45;border-radius:999px;padding:4px 8px;font-weight:800}
        .usageBar{height:8px;background:#eef2f7;border-radius:999px;overflow:hidden}
        .usageBar > span{display:block;height:100%;background:var(--teal)}
        .promo{background:var(--teal);color:#fff;border-radius:4px;padding:18px}
        .promo h6{margin:0 0 6px;font-weight:900}
        .payBox{display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-radius:3px;padding:12px}
        .money{font-weight:900;color:var(--ink);font-size:2rem;line-height:1}
      `}</style>

      <h1 className="h5 title mb-3">Billing & Subscription</h1>

      <div className="grid">
        {/* Left column */}
        <div className="d-flex flex-column gap-3">
          {/* Current Plan */}
          <div className="card">
            <div className="title" style={{ fontSize: "1rem" }}>Current Plan</div>

            <div className="muted">
              {plan?.plan_name || "-"}
            </div>

            <div className="mt-3">
              <div className="d-flex justify-content-between">
                <div className="fw-bold">PDF Usage</div>
                <div className="muted">
                  {(plan?.pdf_used ?? 0)} / {(plan?.pdf_limit ?? 0)}
                </div>
              </div>

              <div className="usageBar mt-1">
                <span
                  style={{
                    width: `${(plan?.pdf_limit ?? 0) > 0
                      ? Math.min(
                        100,
                        Math.round(
                          ((plan?.pdf_used ?? 0) / (plan?.pdf_limit ?? 0)) * 100
                        )
                      )
                      : 0
                      }%`
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between">
                <div className="fw-bold">Image Usage</div>
                <div className="muted">
                  {(plan?.image_used ?? 0)} / {(plan?.image_limit ?? 0)}
                </div>
              </div>

              <div className="usageBar mt-1">
                <span
                  style={{
                    width: `${(plan?.image_limit ?? 0) > 0
                      ? Math.min(
                        100,
                        Math.round(
                          ((plan?.image_used ?? 0) / (plan?.image_limit ?? 0)) * 100
                        )
                      )
                      : 0
                      }%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="title" style={{ fontSize: "1rem" }}>Transactions</div>

            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center muted">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td className="fw-bold">
                        {txn.transaction_ref || txn.id}
                      </td>

                      <td>
                        {txn.created_at
                          ? new Date(txn.created_at).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>₹{txn.amount}</td>

                      <td>{txn.payment_mode || "-"}</td>

                      <td>
                        <span className="status">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="card">
            <div className="title" style={{ fontSize: "1rem" }}>Plan Duration</div>

            <div className="mt-2 d-flex justify-content-between">
              <div className="muted">Start Date</div>
              <div className="fw-bold">
                {plan.start_date ? new Date(plan.start_date).toLocaleDateString() : "-"}
              </div>
            </div>

            <div className="mt-2 d-flex justify-content-between">
              <div className="muted">End Date</div>
              <div className="fw-bold">
                {plan.end_date ? new Date(plan.end_date).toLocaleDateString() : "-"}
              </div>
            </div>
          </div>

          {/* <div className="card">
            <div className="title" style={{ fontSize: "1rem" }}>Payment Method</div>
            <div className="payBox mt-2">
              <div className="d-grid" style={{ placeItems: "center" }}>
                <FaCreditCard size={24} color={TEAL} />
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold">Visa ending in 4242</div>
                <div className="muted">Expires 12/2026</div>
              </div>
              <button className="btn btn-light" onClick={() => alert("Change payment method")}>Change</button>
            </div>
          </div> */}

          <div className="card">
            <div className="title" style={{ fontSize: "1rem" }}>Usage Logs</div>

            <table className="table mt-2">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>File</th>
                  <th>Credits Used</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {usageLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center muted">
                      No usage logs found
                    </td>
                  </tr>
                ) : (
                  usageLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.type}</td>

                      <td>{log.file_name || "-"}</td>

                      <td>{log.credits_used}</td>

                      <td>
                        {log.created_at
                          ? new Date(log.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
