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

/* ---------------- Events ---------------- */

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

renderJobs();
