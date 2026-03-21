import { toast } from "sonner"

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface StudentProfile {
  id: number; name: string; email: string; roll_number: string
  branch: string; section: string; passout_year: number
  phone: string; linkedin: string; github: string
  points: number; streak: number; last_active: string | null; created_at: string | null
}

export interface MCQData {
  total: number; correct: number; accuracy: number
  topics: { topic: string; total: number; correct: number; accuracy: number }[]
}

export interface CodingData {
  total_submissions: number; problems_solved: number
  difficulty_breakdown: { difficulty: string; solved: number; attempted: number }[]
  recent: { problem_title: string; difficulty: string; status: string; language: string; submitted_at: string }[]
}

export interface AssignmentData {
  total: number; avg_percentage: number
  list: { module_id: string; score: number; correct_count: number; total_questions: number; percentage: number; completed_at: string }[]
}

export interface LessonData {
  completed: number
  courses: { course_id: string; course_title: string; completed: number; total: number; percentage: number }[]
}

export interface StudentPerformance {
  student: StudentProfile
  mcq: MCQData
  coding: CodingData
  assignments: AssignmentData
  lessons: LessonData
}

// ─── PDF generator ────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function generateStudentPDF(perf: StudentPerformance) {
  const { student, mcq, coding, assignments, lessons } = perf
  const rollNo = student.roll_number || String(student.id)
  const safeName = student.name.replace(/\s+/g, "_")
  const filename = `Student_Report_${rollNo}_${safeName}`
  const generatedOn = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  const bar = (pct: number, color = "#00D4C8") =>
    `<div style="background:#e5e7eb;border-radius:4px;height:8px;width:100%">
       <div style="background:${color};border-radius:4px;height:8px;width:${Math.min(pct, 100)}%"></div>
     </div>`

  const diffColor = (d: string) => d === "Easy" ? "#10B981" : d === "Medium" ? "#F59E0B" : "#EF4444"
  const statusColor = (s: string) => s === "accepted" ? "#10B981" : s === "wrong_answer" ? "#EF4444" : "#F59E0B"

  const mcqTopicsRows = mcq.topics.slice(0, 12).map(t => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">${t.topic}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center">${t.total}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center;color:#10B981">${t.correct}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center;color:#EF4444">${t.total - t.correct}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">
        ${bar(t.accuracy, t.accuracy >= 70 ? "#10B981" : t.accuracy >= 40 ? "#F59E0B" : "#EF4444")}
        <span style="font-size:11px;color:#6b7280">${t.accuracy}%</span>
      </td>
    </tr>`).join("")

  const recentCodingRows = coding.recent.map(s => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">${s.problem_title}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center;color:${diffColor(s.difficulty)}">${s.difficulty}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center;color:${statusColor(s.status)}">${s.status.replace("_", " ")}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center">${s.language}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280">${fmtDate(s.submitted_at)}</td>
    </tr>`).join("")

  const assignmentRows = assignments.list.map(a => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">${a.module_id}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center">${a.correct_count}/${a.total_questions}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">
        ${bar(a.percentage, a.percentage >= 80 ? "#10B981" : a.percentage >= 50 ? "#F59E0B" : "#EF4444")}
        <span style="font-size:11px;color:${a.percentage >= 80 ? "#10B981" : a.percentage >= 50 ? "#F59E0B" : "#EF4444"}">${a.percentage}%</span>
      </td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280">${fmtDate(a.completed_at)}</td>
    </tr>`).join("")

  const courseRows = lessons.courses.map(c => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">${c.course_title}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6;text-align:center">${c.completed}/${c.total}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #f3f4f6">
        ${bar(c.percentage, "#3B82F6")}
        <span style="font-size:11px;color:#6b7280">${c.percentage}%</span>
      </td>
    </tr>`).join("")

  const codingDiffCells = coding.difficulty_breakdown.map(d => `
    <div style="text-align:center;padding:12px;border:1px solid #e5e7eb;border-radius:8px">
      <div style="font-size:22px;font-weight:700;color:${diffColor(d.difficulty)}">${d.solved}</div>
      <div style="font-size:12px;color:${diffColor(d.difficulty)};font-weight:600">${d.difficulty}</div>
      <div style="font-size:11px;color:#9ca3af">${d.attempted} attempted</div>
    </div>`).join("")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${filename}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; font-size: 13px; }
    @page { margin: 18mm 15mm; size: A4; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    .page { max-width: 820px; margin: 0 auto; padding: 24px; }
    h2 { font-size: 15px; font-weight: 700; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; color: #111827; }
    h3 { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }
    section { margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 8px; background: #f9fafb; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
    .stat-box { padding: 14px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; }
    .stat-val { font-size: 24px; font-weight: 700; color: #111827; }
    .stat-lbl { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .header-bar { background: #0A0F1E; color: #fff; padding: 20px 24px; border-radius: 10px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header-name { font-size: 22px; font-weight: 700; }
    .header-meta { font-size: 12px; color: #9ca3af; margin-top: 4px; line-height: 1.8; }
    .header-right { text-align: right; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin: 2px; }
    .badge-teal { background: #00D4C820; color: #00D4C8; border: 1px solid #00D4C840; }
    .badge-orange { background: #F59E0B20; color: #D97706; border: 1px solid #F59E0B40; }
    .footer { text-align: center; font-size: 10px; color: #9ca3af; padding-top: 16px; border-top: 1px solid #f3f4f6; margin-top: 24px; }
    .accuracy-big { font-size: 32px; font-weight: 700; color: #8B5CF6; }
    .info-row { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 12px; }
    .info-item { font-size: 12px; color: #6b7280; }
    .info-item span { color: #111827; font-weight: 500; }
  </style>
</head>
<body>
<div class="page">
  <div class="header-bar">
    <div>
      <div class="header-name">${student.name}</div>
      <div class="header-meta">
        ${student.roll_number ? `Roll No: ${student.roll_number}` : ""}
        ${student.branch ? ` &nbsp;·&nbsp; ${student.branch}${student.section ? " / " + student.section : ""}` : ""}
        ${student.passout_year ? ` &nbsp;·&nbsp; Batch ${student.passout_year}` : ""}
        <br/>${student.email}${student.phone ? ` &nbsp;·&nbsp; ${student.phone}` : ""}
      </div>
    </div>
    <div class="header-right">
      <div style="font-size:11px;color:#9ca3af;margin-bottom:6px">Generated on ${generatedOn}</div>
      <div><span class="badge badge-teal">★ ${student.points.toLocaleString()} pts</span></div>
      <div><span class="badge badge-orange">🔥 ${student.streak} day streak</span></div>
      ${student.last_active ? `<div style="font-size:10px;color:#9ca3af;margin-top:4px">Last active: ${fmtDate(student.last_active)}</div>` : ""}
    </div>
  </div>

  <section>
    <h2>Performance Summary</h2>
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-val" style="color:#8B5CF6">${mcq.accuracy}%</div><div class="stat-lbl">MCQ Accuracy</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#10B981">${coding.problems_solved}</div><div class="stat-lbl">Problems Solved</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#EC4899">${assignments.total}</div><div class="stat-lbl">Assignments Done</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#3B82F6">${lessons.completed}</div><div class="stat-lbl">Lessons Completed</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#F59E0B">${mcq.total}</div><div class="stat-lbl">MCQ Attempts</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#06B6D4">${assignments.avg_percentage}%</div><div class="stat-lbl">Avg Assignment Score</div></div>
    </div>
  </section>

  <section>
    <h2>MCQ Performance</h2>
    <div style="display:flex;gap:24px;align-items:center;margin-bottom:14px">
      <div style="text-align:center">
        <div class="accuracy-big">${mcq.accuracy}%</div>
        <div style="font-size:11px;color:#6b7280">Overall Accuracy</div>
      </div>
      <div style="flex:1">
        <div class="info-row">
          <div class="info-item">Total Attempts: <span>${mcq.total}</span></div>
          <div class="info-item">Correct: <span style="color:#10B981">${mcq.correct}</span></div>
          <div class="info-item">Wrong: <span style="color:#EF4444">${mcq.total - mcq.correct}</span></div>
        </div>
      </div>
    </div>
    ${mcq.topics.length > 0 ? `
    <h3>Topic-wise Breakdown</h3>
    <table>
      <thead><tr><th>Topic</th><th style="text-align:center">Attempts</th><th style="text-align:center">Correct</th><th style="text-align:center">Wrong</th><th>Accuracy</th></tr></thead>
      <tbody>${mcqTopicsRows}</tbody>
    </table>` : "<p style='color:#6b7280;font-size:12px'>No MCQ attempts yet.</p>"}
  </section>

  <section>
    <h2>Coding Performance</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px">${codingDiffCells}</div>
    <div class="info-row" style="margin-bottom:12px">
      <div class="info-item">Total Submissions: <span>${coding.total_submissions}</span></div>
      <div class="info-item">Problems Solved: <span style="color:#10B981">${coding.problems_solved}</span></div>
    </div>
    ${coding.recent.length > 0 ? `
    <h3>Recent Submissions</h3>
    <table>
      <thead><tr><th>Problem</th><th style="text-align:center">Difficulty</th><th style="text-align:center">Status</th><th style="text-align:center">Language</th><th style="text-align:center">Date</th></tr></thead>
      <tbody>${recentCodingRows}</tbody>
    </table>` : "<p style='color:#6b7280;font-size:12px'>No submissions yet.</p>"}
  </section>

  <section>
    <h2>Assignments</h2>
    ${assignments.list.length > 0 ? `
    <div class="info-row" style="margin-bottom:12px">
      <div class="info-item">Total Attempted: <span>${assignments.total}</span></div>
      <div class="info-item">Average Score: <span>${assignments.avg_percentage}%</span></div>
    </div>
    <table>
      <thead><tr><th>Module</th><th style="text-align:center">Score</th><th>Progress</th><th style="text-align:center">Date</th></tr></thead>
      <tbody>${assignmentRows}</tbody>
    </table>` : "<p style='color:#6b7280;font-size:12px'>No assignments attempted.</p>"}
  </section>

  <section>
    <h2>Course Progress</h2>
    ${lessons.courses.length > 0 ? `
    <div class="info-item" style="margin-bottom:12px">Total Lessons Completed: <span>${lessons.completed}</span></div>
    <table>
      <thead><tr><th>Course</th><th style="text-align:center">Lessons</th><th>Progress</th></tr></thead>
      <tbody>${courseRows}</tbody>
    </table>` : "<p style='color:#6b7280;font-size:12px'>No courses started.</p>"}
  </section>

  <div class="footer">CareerEzi · Student Performance Report · ${generatedOn} · ${student.email} · Developed by Finity Innovations</div>
</div>
<script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); } }</script>
</body>
</html>`

  const w = window.open("", "_blank", "width=900,height=700")
  if (!w) { toast.error("Allow popups to download the report"); return }
  w.document.write(html)
  w.document.close()
}
