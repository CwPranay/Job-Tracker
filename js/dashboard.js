

function countByStatus(jobs, status) {
    return jobs.filter(j => j.status === status).length;
}

function renderStats() {
    const jobs = getjobs()
    const total = jobs.length;
    const applied = countByStatus(jobs, "Applied")
    const interview = countByStatus(jobs, "Interview")
    const offer = countByStatus(jobs, "Offer")
    const rejected = countByStatus(jobs, "Rejected")

    document.getElementById("totalApps").textContent = total;
    document.getElementById("appliedCount").textContent = applied
    document.getElementById("interviewCount").textContent = interview
    document.getElementById("offerCount").textContent = offer
    document.getElementById("rejectedCount").textContent = rejected;

    const successRate = total === 0 ? 0 : Math.round((offer / total) * 100);
    document.getElementById("successRate").textContent = `${successRate}`
}

function renderRecent() {
    const jobs = getjobs().slice(0, 4)
    const box = document.getElementById("recentList")

    box.innerHTML = ""

    if (jobs.length === 0) {
        box.innerHTML = `<p style="margin:10px" class="muted">No applications yet. Go to Applications → Add one.</p>`;
        return;
    }

    jobs.forEach(j => {
        const div = document.createElement("div")
        div.className = "item"

        div.innerHTML = `
      <div class="item__left">
        <p class="item__title">${j.company} • ${j.role}</p>
        <p class="item__meta">${j.location} • ${formatDate(j.appliedDate)}</p>
      </div>
      <span class="badge">${j.status}</span>
    `;
        box.appendChild(div)
    });
}

function seedSampleData() {
    const existing = getjobs()
    if (existing.length > 0) {
        toast("You already have data!!");
        return;

    }

    const sample = [
        {
            id: generateId(),
            company: "TCS",
            role: "Frontend Developer",
            status: "Applied",
            location: "Mumbai",
            salary: "4-6 LPA",
            appliedDate: "2026-01-10",
            notes: "Applied via LinkedIn",
            createdAt: Date.now()
        },
        {
            id: generateId(),
            company: "Infosys",
            role: "Web Developer Intern",
            status: "Interview",
            location: "Remote",
            salary: "Stipend",
            appliedDate: "2026-01-12",
            notes: "HR call done",
            createdAt: Date.now()
        },
        {
            id: generateId(),
            company: "Startup X",
            role: "React Developer",
            status: "Rejected",
            location: "Pune",
            salary: "6-8 LPA",
            appliedDate: "2026-01-14",
            notes: "No response for 7 days",
            createdAt: Date.now()
        }
    ];

    saveJobs(sample);
    toast("Sample data added ");
    renderStats()
    renderRecent()
}

document.getElementById("seedBtn").addEventListener("click", seedSampleData);

renderStats();
renderRecent();