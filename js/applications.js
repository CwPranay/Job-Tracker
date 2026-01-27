const openModalBtn = document.getElementById("openModalBtn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const deleteModal = document.getElementById("deleteModal");
const deleteText = document.getElementById("deleteText");
const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const jobForm = document.getElementById("jobForm");
const jobIdInput = document.getElementById("jobId");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const statusInput = document.getElementById("status");
const locationInput = document.getElementById("location");
const salaryInput = document.getElementById("salary");
const appliedDateInput = document.getElementById("appliedDate");
const notesInput = document.getElementById("notes");

const jobsTbody = document.getElementById("jobsTbody");
const emptyText = document.getElementById("emptyText");

const searchInput = document.getElementById("searchInput");
const statusByValue = document.getElementById("statusBy");
const sortByValue = document.getElementById("sortBy");

const openQuickAddBtn = document.getElementById("openQuickAddBtn");
const quickAddModal = document.getElementById("quickAddModal");
const closeQuickAddBtn = document.getElementById("closeQuickAddBtn");
const cancelQuickAddBtn = document.getElementById("cancelQuickAddBtn");
const submitQuickAddBtn = document.getElementById("submitQuickAddBtn");
const quickAddInput = document.getElementById("quickAddInput");

let deleteTargetId = null;

function openModal(mode = "add") {
  modal.classList.remove("hidden");

  if (mode === "add") {
    modalTitle.textContent = "Add Application";
    jobIdInput.value = "";
    jobForm.reset();
    statusInput.value = "Applied";
  }
}

function closeModal() {
  modal.classList.add("hidden");
}

function openDeleteModal(job) {
  deleteTargetId = job.id;
  deleteText.innerHTML = `Delete <b>${job.company}</b> • <b>${job.role}</b> ?`;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  deleteTargetId = null;
  deleteModal.classList.add("hidden");
}

function getStatusBadgeClass(status) {
  if (status === "Applied") return "badge--applied";
  if (status === "Interview") return "badge--interview";
  if (status === "Offer") return "badge--offer";
  if (status === "Rejected") return "badge--rejected";
  return "";
}

function normalizeText(t) {
  return (t || "").toLowerCase().trim();
}

function getFormData() {
  return {
    company: companyInput.value.trim(),
    role: roleInput.value.trim(),
    status: statusInput.value,
    location: locationInput.value.trim(),
    salary: salaryInput.value.trim(),
    appliedDate: appliedDateInput.value,
    notes: notesInput.value.trim(),
  };
}

function validateForm(data) {
  if (!data.company) return "Company is required";
  if (!data.role) return "Role is required";
  if (!data.status) return "Status is required";
  return "";
}

function addNewJob(data) {
  const newJob = {
    id: generateId(),
    ...data,
    createdAt: Date.now(),
  };

  addJob(newJob);
  toast("Application added ✅");
}

function updateJob(id, data) {
  const jobs = getjobs().map((j) => (j.id === id ? { ...j, ...data } : j));
  saveJobs(jobs);
  toast("Application updated ✅");
}

function getFilteredJobs() {
  let jobs = getjobs();

  const q = normalizeText(searchInput.value);
  if (q) {
    jobs = jobs.filter(
      (j) =>
        normalizeText(j.company).includes(q) ||
        normalizeText(j.role).includes(q)
    );
  }

  const st = statusByValue.value;
  if (st !== "All") {
    jobs = jobs.filter((j) => j.status === st);
  }

  const sort = sortByValue.value;
  if (sort === "newest") {
    jobs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (sort === "oldest") {
    jobs.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  } else if (sort === "company") {
    jobs.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
  }

  return jobs;
}

function renderJobs() {
  const jobs = getFilteredJobs();
  jobsTbody.innerHTML = "";

  if (jobs.length === 0) {
    emptyText.style.display = "block";
    return;
  }

  emptyText.style.display = "none";

  jobs.forEach((j) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${j.company}</td>
      <td>${j.role}</td>
      <td><span class="badge ${getStatusBadgeClass(j.status)}">${j.status}</span></td>
      <td>${j.location || "-"}</td>
      <td>${j.appliedDate ? formatDate(j.appliedDate) : "-"}</td>
      <td class="right">
        <div class="actions">
          <button class="btn btn--ghost" data-action="edit" data-id="${j.id}">Edit</button>
          <button class="btn btn--danger" data-action="delete" data-id="${j.id}">Delete</button>
        </div>
      </td>
    `;

    jobsTbody.appendChild(tr);
  });
}

function renderMobileCards() {
  const jobs = getFilteredJobs();
  const container = document.getElementById("jobsCards");
  if (!container) return;

  container.innerHTML = "";

  if (jobs.length === 0) return;

  jobs.forEach((j) => {
    const div = document.createElement("div");
    div.className = "jobCard";

    div.innerHTML = `
      <div class="jobCard_top">
        <div>
          <div class="jobCard_company">${j.company}</div>
          <div class="jobCard_role">${j.role}</div>
        </div>
        <span class="badge ${getStatusBadgeClass(j.status)}">${j.status}</span>
      </div>

      <div class="jobCard_meta">
        <span>📍 ${j.location || "-"}</span>
        <span>📅 ${j.appliedDate ? formatDate(j.appliedDate) : "-"}</span>
      </div>

      <div class="jobCard_actions">
        <button class="btn btn--ghost" data-action="edit" data-id="${j.id}">Edit</button>
        <button class="btn btn--danger" data-action="delete" data-id="${j.id}">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}
document.getElementById("jobsCards").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (!action || !id) return;

  const job = getjobs().find((j) => j.id === id);
  if (!job) return;

  if (action === "delete") openDeleteModal(job);
  if (action === "edit") {
    modalTitle.textContent = "Edit Application";
    jobIdInput.value = job.id;
    companyInput.value = job.company || "";
    roleInput.value = job.role || "";
    statusInput.value = job.status || "Applied";
    locationInput.value = job.location || "";
    salaryInput.value = job.salary || "";
    appliedDateInput.value = job.appliedDate || "";
    notesInput.value = job.notes || "";
    modal.classList.remove("hidden");
  }
});


openModalBtn.addEventListener("click", () => openModal("add"));
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
cancelDeleteBtn.addEventListener("click", closeDeleteModal);

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

confirmDeleteBtn.addEventListener("click", () => {
  if (!deleteTargetId) return;

  const jobs = getjobs().filter((j) => j.id !== deleteTargetId);
  saveJobs(jobs);

  toast("Deleted ✅");
  closeDeleteModal();
  renderJobs();
  renderMobileCards();

});

jobForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = getFormData();
  const error = validateForm(data);

  if (error) {
    toast(error);
    return;
  }

  const id = jobIdInput.value;

  if (id) updateJob(id, data);
  else addNewJob(data);

  closeModal();
  renderJobs();
  renderMobileCards();

});

jobsTbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (!action || !id) return;

  const job = getjobs().find((j) => j.id === id);
  if (!job) return;

  if (action === "delete") {
    openDeleteModal(job);
    return;
  }

  if (action === "edit") {
    modalTitle.textContent = "Edit Application";
    jobIdInput.value = job.id;

    companyInput.value = job.company || "";
    roleInput.value = job.role || "";
    statusInput.value = job.status || "Applied";
    locationInput.value = job.location || "";
    salaryInput.value = job.salary || "";
    appliedDateInput.value = job.appliedDate || "";
    notesInput.value = job.notes || "";

    modal.classList.remove("hidden");
  }
});

function setupCustomSelect(wrapperId, inputId, valueId, menuId, dataKey) {
  const btn = document.getElementById(wrapperId);
  const hiddenInput = document.getElementById(inputId);
  const valueText = document.getElementById(valueId);
  const menu = document.getElementById(menuId);

  if (!btn || !hiddenInput || !valueText || !menu) return;

  function closeMenu() {
    menu.classList.add("hidden");
  }

  function openMenu() {
    menu.classList.remove("hidden");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isClosed = menu.classList.contains("hidden");

    document.querySelectorAll(".customSelect_menu").forEach((m) => {
      m.classList.add("hidden");
    });

    if (isClosed) openMenu();
    else closeMenu();
  });

  menu.addEventListener("click", (e) => {
    const item = e.target.closest(".customSelect_item");
    if (!item) return;

    const val = item.dataset[dataKey];
    if (!val) return;

    hiddenInput.value = val;
    valueText.textContent = item.textContent;

    closeMenu();
    renderJobs();
    renderMobileCards();

  });

  document.addEventListener("click", () => {
    closeMenu();
  });
}
setupCustomSelect("statusBtn", "statusBy", "statusValue", "statusMenu", "status");
setupCustomSelect("sortBtn", "sortBy", "sortValue", "sortMenu", "sort");
setupCustomSelect("modalStatusBtn", "status", "modalStatusValue", "modalStatusMenu", "status");


searchInput.addEventListener("input", renderJobs);
statusByValue.addEventListener("change", renderJobs);
sortByValue.addEventListener("change", renderJobs);

function openQuickAddModal() {
  quickAddModal.classList.remove("hidden")
  quickAddInput.value = ""
  setTimeout(() => {
    quickAddInput.focus()
  }, 50);

}

function closeQuickAddModal() {
  quickAddModal.classList.add("hidden");
}

function detectStatus(text) {
  const t = text.toLowerCase();

  if (t.includes("interview")) return "Interview";
  if (t.includes("offer")) return "Offer";
  if (t.includes("reject")) return "Rejected";
  if (t.includes("applied") || t.includes("apply")) return "Applied";

  return "Applied";
}

function extractDate(text) {
  // yyyy-mm-dd
  let match = text.match(/\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  // mm/dd/yyyy
  match = text.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
  if (match) return match[0];

  return "";
}


function smartParseJob(message) {
  const clean = message.trim()
  const status = detectStatus(clean)
  const appliedDate = extractDate(clean)

  let text = clean
    .replace(/\d{4}-\d{2}-\d{2}/g, "")
    .replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, "")
    .replace(/applied|apply|interview|offer|rejected|reject/gi, "")
    .trim();

  let salary = "";
  const salaryMatch = text.match(/(\d+(\.\d+)?\s?(lpa|lakh|k|kpm|per month|per annum))/i);
  if (salaryMatch) {
    salary = salaryMatch[0];
    text = text.replace(salaryMatch[0], "").trim();
  }

  text = text.replace(/[,]+/g, " ").replace(/\s+/g, " ").trim();

  if (text.includes("|")) {
    const parts = text.split("|").map((x) => x.trim()).filter(Boolean);

    return {
      company: (parts[0] || "").toUpperCase(),
      role: parts[1] || "Unknown Role",
      location: parts[2] || "-",
      salary: salary || "",
      appliedDate: appliedDate || "",
      status,
      notes: "Added via Quick Add",
    };
  }

  const words = text.split(" ").filter(Boolean);

  const locations = [
    "remote", "onsite", "hybrid",
    "mumbai", "pune", "bangalore", "bengaluru",
    "hyderabad", "delhi", "noida", "gurgaon", "chennai", "kolkata",
    "india"
  ];

  let location = "-";
  let locIndex = words.findIndex((w) => locations.includes(w.toLowerCase()));
  let beforeLocation = words;
  if (locIndex !== -1) {
    location = words[locIndex];
    beforeLocation = words.slice(0, locIndex);
  }

  const roleKeywords = [
    "developer", "engineer", "intern", "designer", "analyst",
    "tester", "qa", "consultant", "manager", "lead", "architect",
    "sde", "sdet"
  ];

  const roleIndex = beforeLocation.findIndex((w) =>
    roleKeywords.includes(w.toLowerCase())
  );

  let company = "";
  let role = "";

  if (roleIndex !== -1) {
    const roleWord = beforeLocation[roleIndex].toLowerCase();

    // Special handling for SDE / SDET
    if (roleWord === "sde" || roleWord === "sdet") {
      role = beforeLocation[roleIndex];
      company = beforeLocation.slice(0, roleIndex).join(" ");
    } else {
      // normal roles like "full stack developer"
      const roleStart = Math.max(0, roleIndex - 2);
      role = beforeLocation.slice(roleStart, roleIndex + 1).join(" ");
      company = beforeLocation.slice(0, roleStart).join(" ");
    }
  }
  else {

    if (beforeLocation.length >= 3) {
      company = beforeLocation.slice(0, 2).join(" ");
      role = beforeLocation.slice(2).join(" ");
    } else {
      company = beforeLocation[0] || "";
      role = beforeLocation.slice(1).join(" ");
    }
  }

  return {
    company: company ? company.toUpperCase() : "",
    role: role || "Unknown Role",
    status,
    location: location || "-",
    salary: salary || "",
    appliedDate,
    notes: "Added via Quick Add",
  };
}

function submitQuickAdd() {
  const msg = quickAddInput.value.trim()
  if (!msg) {
    toast("Type something first")
    return
  }

  const data = smartParseJob(msg)

  if (!data.company || data.role < 3) {
    toast('Try : "Applied TCS Frontend Mumbai 2026-01-12"')
    return
  }


  const newJob = {
    id: generateId(),
    ...data,
    createdAt: Date.now()
  };

  addJob(newJob)
  toast("Added ");
  closeQuickAddModal();
  renderJobs();
  renderMobileCards();

}

if (openQuickAddBtn) openQuickAddBtn.addEventListener("click", openQuickAddModal);
if (closeQuickAddBtn) closeQuickAddBtn.addEventListener("click", closeQuickAddModal);
if (cancelQuickAddBtn) cancelQuickAddBtn.addEventListener("click", closeQuickAddModal);

if (submitQuickAddBtn) submitQuickAddBtn.addEventListener("click", submitQuickAdd);

if (quickAddModal) {
  quickAddModal.addEventListener("click", (e) => {
    if (e.target === quickAddModal) closeQuickAddModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && quickAddModal && !quickAddModal.classList.contains("hidden")) {
    closeQuickAddModal();
  }
});

if (quickAddInput) {
  quickAddInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitQuickAdd();
    }
  });
}

renderJobs();
renderMobileCards();
