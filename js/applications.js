const openModalBtn = document.getElementById("openModalBtn");

const deleteModal = document.getElementById("deleteModal");
const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteText = document.getElementById("deleteText");

const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");

const statusBtn = document.getElementById("statusBtn");
const statusMenu = document.getElementById("statusMenu");
const statusValue = document.getElementById("statusValue");

const modalStatusBtn = document.getElementById("modalStatusBtn");
const modalStatusMenu = document.getElementById("modalStatusMenu");
const modalStatusValue = document.getElementById("modalStatusValue");

const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");
const sortValue = document.getElementById("sortValue");

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
const statusByValue = document.getElementById("status");
const sortByValue = document.getElementById("sortBy");

let deleteTargetId = null;

function positionDropdown(btn, menu) {
  const r = btn.getBoundingClientRect();
  menu.style.width = r.width + "px";
  menu.style.left = r.left + "px";
  menu.style.top = r.bottom + 8 + "px";
}

function closeAllDropdowns() {
  statusMenu.classList.add("hidden");
  sortMenu.classList.add("hidden");
  modalStatusMenu.classList.add("hidden");
}

function openModal(mode = "add") {
  modal.classList.remove("hidden");

  if (mode === "add") {
    modalTitle.textContent = "Add Application";
    jobIdInput.value = "";
    jobForm.reset();
    statusInput.value = "Applied";
    if (modalStatusValue) modalStatusValue.textContent = "Applied";
  }
}

function closeModal() {
  modal.classList.add("hidden");
  closeAllDropdowns();
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

function getFilteredJobs() {
  let jobs = getjobs();

  const q = normalizeText(searchInput.value);
  if (q) {
    jobs = jobs.filter((j) => {
      return normalizeText(j.company).includes(q) || normalizeText(j.role).includes(q);
    });
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
  } else {
    emptyText.style.display = "none";
  }

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
  const jobs = getjobs().map((j) => {
    if (j.id === id) return { ...j, ...data };
    return j;
  });

  saveJobs(jobs);
  toast("Application updated ✅");
}

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

sortBtn.addEventListener("click", () => {
  const isClosed = sortMenu.classList.contains("hidden");
  closeAllDropdowns();

  if (isClosed) {
    sortMenu.classList.remove("hidden");
    positionDropdown(sortBtn, sortMenu);
  }
});

sortMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".customSelect_item");
  if (!item) return;

  const val = item.dataset.sort;
  if (!val) return;

  sortByValue.value = val;
  sortValue.textContent = item.textContent;

  sortMenu.classList.add("hidden");
  renderJobs();
});

statusBtn.addEventListener("click", () => {
  const isClosed = statusMenu.classList.contains("hidden");
  closeAllDropdowns();

  if (isClosed) {
    statusMenu.classList.remove("hidden");
    positionDropdown(statusBtn, statusMenu);
  }
});

statusMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".customSelect_item");
  if (!item) return;

  const st = item.dataset.status;
  if (!st) return;

  statusInput.value = st;
  statusValue.textContent = item.textContent;

  statusMenu.classList.add("hidden");
});

modalStatusBtn.addEventListener("click", () => {
  const isClosed = modalStatusMenu.classList.contains("hidden");
  closeAllDropdowns();

  if (isClosed) {
    modalStatusMenu.classList.remove("hidden");
    positionDropdown(modalStatusBtn, modalStatusMenu);
  }
});

modalStatusMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".customSelect_item");
  if (!item) return;

  const st = item.dataset.status;
  if (!st) return;

  statusInput.value = st;
  modalStatusValue.textContent = item.textContent;

  modalStatusMenu.classList.add("hidden");
});

document.addEventListener("click", (e) => {
  const insideStatus = statusBtn.contains(e.target) || statusMenu.contains(e.target);
  const insideSort = sortBtn.contains(e.target) || sortMenu.contains(e.target);
  const insideModalStatus = modalStatusBtn.contains(e.target) || modalStatusMenu.contains(e.target);

  if (!insideStatus && !insideSort && !insideModalStatus) {
    closeAllDropdowns();
  }
});

window.addEventListener("resize", () => {
  if (!statusMenu.classList.contains("hidden")) positionDropdown(statusBtn, statusMenu);
  if (!sortMenu.classList.contains("hidden")) positionDropdown(sortBtn, sortMenu);
  if (!modalStatusMenu.classList.contains("hidden")) positionDropdown(modalStatusBtn, modalStatusMenu);
});

window.addEventListener(
  "scroll",
  () => {
    if (!statusMenu.classList.contains("hidden")) positionDropdown(statusBtn, statusMenu);
    if (!sortMenu.classList.contains("hidden")) positionDropdown(sortBtn, sortMenu);
    if (!modalStatusMenu.classList.contains("hidden")) positionDropdown(modalStatusBtn, modalStatusMenu);
  },
  true
);

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

  if (action === "delete") {
    const job = getjobs().find((j) => j.id === id);
    if (!job) return;
    openDeleteModal(job);
    return;
  }

  if (action === "edit") {
    const job = getjobs().find((j) => j.id === id);
    if (!job) return;

    modalTitle.textContent = "Edit Application";
    jobIdInput.value = job.id;

    companyInput.value = job.company || "";
    roleInput.value = job.role || "";
    statusInput.value = job.status || "Applied";
    if (modalStatusValue) modalStatusValue.textContent = statusInput.value;

    locationInput.value = job.location || "";
    salaryInput.value = job.salary || "";
    appliedDateInput.value = job.appliedDate || "";
    notesInput.value = job.notes || "";

    modal.classList.remove("hidden");
    closeAllDropdowns();
    return;
  }
});

searchInput.addEventListener("input", renderJobs);

renderJobs();
