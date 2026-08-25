import { useState, useEffect, useCallback } from "react";
import "./dashboard.css";
import { getApi, postApi } from "../utils/api";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "#f59e0b" },
  in_progress: { label: "در حال تعمیر", color: "#3b82f6" },
  completed: { label: "تکمیل شده", color: "#22c55e" },
  delivered: { label: "تحویل داده شده", color: "#8b5cf6" },
};

function formatMoney(n) {
  return Number(n || 0).toLocaleString("fa-IR") + " تومان";
}

// تبدیل تاریخ میلادی (yyyy-mm-dd) به شمسی؛ اگر از قبل شمسی بود دست‌نخورده برمی‌گردد
function toJalaliDate(str) {
  if (!str) return "-";
  const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return str; // احتمالاً از قبل شمسی است
  try {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch (e) {
    return str;
  }
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0)
    return (
      <svg viewBox="0 0 160 160" className="pie-chart">
        <circle cx="80" cy="80" r="65" fill="#e2e8f0" />
        <text x="80" y="85" textAnchor="middle" className="pie-total">
          ۰
        </text>
      </svg>
    );

  let angle = -90;
  const cx = 80;
  const cy = 80;
  const r = 65;

  const slices = data.map((d) => {
    if (d.value === 0) return null;
    const sweep = (d.value / total) * 360;
    const start = angle;
    const end = angle + sweep;
    angle = end;
    const rad = (a) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(start));
    const y1 = cy + r * Math.sin(rad(start));
    const x2 = cx + r * Math.cos(rad(end));
    const y2 = cy + r * Math.sin(rad(end));
    const large = sweep > 180 ? 1 : 0;
    return (
      <path
        key={d.label}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={d.color}
      />
    );
  });

  return (
    <svg viewBox="0 0 160 160" className="pie-chart">
      {slices}
      <circle cx={cx} cy={cy} r="32" fill="#fff" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="pie-total">
        {total.toLocaleString("fa-IR")}
      </text>
    </svg>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    carId: "",
    laborCost: "",
    startDate: "",
    endDate: "",
    issueDescription: "",
    status: "pending",
  });

  const loadStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getApi("/api/reports/dashboard", token);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        return;
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
    // Fallback: show dashboard with zeros instead of loading forever
    setStats({
      inProgress: 0,
      pending: 0,
      completed: 0,
      delivered: 0,
      totalCustomers: 0,
      todayRevenue: 0,
      completedThisMonth: 0,
      monthlyRevenue: [],
      recentRepairs: [],
    });
  }, []);

  const loadCars = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getApi("/api/cars", token);
      const data = await res.json();
      if (data.success) setCars(data.cars || []);
    } catch (err) {
      console.error("Failed to load cars", err);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadCars();
  }, [loadStats, loadCars]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "laborCost") {
      // فقط عدد، با جداکننده سه‌رقمی هنگام تایپ
      const digits = value
        .replace(/[^0-9۰-۹]/g, "")
        .replace(/[۰-۹]/g, (ch) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(ch)));
      const formatted = digits ? Number(digits).toLocaleString("en-US") : "";
      setForm({ ...form, [name]: formatted, laborCostRaw: digits });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.carId) {
      setFormError("انتخاب خودرو الزامی است.");
      return;
    }
    if (!form.issueDescription.trim()) {
      setFormError("شرح تعمیرات را وارد کنید.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await postApi("/api/services", {
        carId: Number(form.carId),
        issueDescription: form.issueDescription,
        status: form.status,
        estimatedCost:
          Number(form.laborCostRaw || form.laborCost.replace(/,/g, "")) || 0,
        actualCost:
          Number(form.laborCostRaw || form.laborCost.replace(/,/g, "")) || 0,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || "خطا در ثبت تعمیرات.");
      } else {
        setShowForm(false);
        setForm({
          carId: "",
          laborCost: "",
          startDate: "",
          endDate: "",
          issueDescription: "",
          status: "pending",
        });
        loadStats();
      }
    } catch (err) {
      setFormError("خطا در ارتباط با سرور.");
    }
    setSaving(false);
  };

  if (!stats)
    return (
      <div className="page-with-sidebar dashboard">در حال بارگذاری...</div>
    );

  const safe = (v) => (typeof v === "number" ? v : 0);

  const statusData = Object.keys(STATUS_MAP).map((key) => ({
    label: STATUS_MAP[key].label,
    value:
      key === "in_progress"
        ? safe(stats.inProgress)
        : key === "pending"
          ? safe(stats.pending)
          : key === "completed"
            ? safe(stats.completed)
            : safe(stats.delivered),
    color: STATUS_MAP[key].color,
  }));

  const monthly = stats.monthlyRevenue || [];
  const maxRevenue = Math.max(...monthly.map((m) => m.value), 1);

  return (
    <div className="page-with-sidebar dashboard">
      <div className="dashboard-head">
        <h2 className="dashboard-title">داشبورد</h2>
        <button
          className="add-repair-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fa fa-plus"></i> ثبت تعمیر جدید
        </button>
      </div>

      {showForm && (
        <form className="repair-form" onSubmit={handleSubmit}>
          <h3>ثبت تعمیر جدید</h3>
          {formError && <p className="form-error">{formError}</p>}
          <div className="form-grid">
            <label>
              خودرو *
              <select name="carId" value={form.carId} onChange={handleChange}>
                <option value="">— انتخاب خودرو —</option>
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.plate_number} — {c.brand} {c.model}
                  </option>
                ))}
              </select>
            </label>
            <label>
              دستمزد (تومان)
              <input
                type="text"
                name="laborCost"
                value={form.laborCost}
                onChange={handleChange}
                placeholder="مثلاً ۵۰۰٬۰۰۰"
                inputMode="numeric"
                dir="ltr"
                style={{ textAlign: "right" }}
              />
            </label>
            <label>
              تاریخ ورود
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </label>
            <label>
              تاریخ خروج
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </label>
            <label>
              وضعیت
              <select name="status" value={form.status} onChange={handleChange}>
                {Object.keys(STATUS_MAP).map((k) => (
                  <option key={k} value={k}>
                    {STATUS_MAP[k].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="full-width">
              شرح تعمیرات *
              <input
                type="text"
                name="issueDescription"
                value={form.issueDescription}
                onChange={handleChange}
                placeholder="مثلاً تعویض روغن و فیلترها"
              />
            </label>
          </div>
          <button type="submit" disabled={saving} className="submit-btn">
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </form>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#3b82f6" }}>
            <i className="fa fa-wrench"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {safe(stats.inProgress).toLocaleString("fa-IR")}
            </span>
            <span className="stat-title">خودروهای در حال تعمیر</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#22c55e" }}>
            <i className="fa fa-money"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {formatMoney(stats.todayRevenue)}
            </span>
            <span className="stat-title">درآمد امروز</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#8b5cf6" }}>
            <i className="fa fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {safe(stats.completedThisMonth).toLocaleString("fa-IR")}
            </span>
            <span className="stat-title">خودروهای تعمیر شده در ماه</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f59e0b" }}>
            <i className="fa fa-users"></i>
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {safe(stats.totalCustomers).toLocaleString("fa-IR")}
            </span>
            <span className="stat-title">تعداد کل مشتریان</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>وضعیت کلی</h3>
          <div className="status-chart">
            <PieChart data={statusData} />
            <ul className="chart-legend">
              {statusData.map((d) => (
                <li key={d.label}>
                  <span
                    className="legend-dot"
                    style={{ background: d.color }}
                  ></span>
                  {d.label} ({d.value.toLocaleString("fa-IR")})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chart-card">
          <h3>درآمد ماهانه</h3>
          {monthly.length === 0 ? (
            <div className="bar-chart">
              {[0, 0, 0, 0].map((v, i) => (
                <div key={i} className="bar-col">
                  <div className="bar bar-zero" style={{ height: "4px" }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bar-chart">
              {monthly.map((m) => (
                <div key={m.month} className="bar-col">
                  <div
                    className="bar"
                    style={{ height: `${(m.value / maxRevenue) * 100}%` }}
                    title={`${Number(m.value).toLocaleString("fa-IR")} تومان`}
                  ></div>
                  <span className="bar-label">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="recent-card">
        <h3>آخرین تعمیرات</h3>
        <table className="repairs-table">
          <thead>
            <tr>
              <th>وضعیت</th>
              <th>تاریخ ورود</th>
              <th>تاریخ خروج</th>
              <th>نام مشتری</th>
              <th>پلاک</th>
            </tr>
          </thead>
          <tbody>
            {(stats.recentRepairs || []).length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  تعمیری ثبت نشده است.
                </td>
              </tr>
            ) : (
              stats.recentRepairs.map((r) => {
                const st = STATUS_MAP[r.status] || {
                  label: r.status,
                  color: "#94a3b8",
                };
                return (
                  <tr key={r.id}>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td>{toJalaliDate(r.start_date)}</td>
                    <td>{toJalaliDate(r.end_date)}</td>
                    <td>{r.customer_name || "-"}</td>
                    <td>{r.plate_number || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
