const listApplied = document.getElementById("listApplied");
const listInterview = document.getElementById("listInterview");
const listOffer = document.getElementById("listOffer");
const listRejected = document.getElementById("listRejected");

const countApplied = document.getElementById("countApplied");
const countInterview = document.getElementById("countInterview");
const countOffer = document.getElementById("countOffer");
const countRejected = document.getElementById("countRejected");

const cols = document.querySelectorAll(".kanban_col");

let draggingJobId = null;

function groupJobs() {
  const jobs = getjobs();

  return {
    Applied: jobs.filter((j) => j.status === "Applied"),
    Interview: jobs.filter((j) => j.status === "Interview"),
    Offer: jobs.filter((j) => j.status === "Offer"),
    Rejected: jobs.filter((j) => j.status === "Rejected"),
  };
}

function makeCard(job) {
  const card = document.createElement("div");
  card.className = "kcard";
  card.draggable = true;
  card.dataset.id = job.id;

  card.innerHTML = `
    <div class="kcard_title">${job.company} • ${job.role}</div>
    <div class="kcard_meta">${job.location || "-"} • ${job.appliedDate ? formatDate(job.appliedDate) : "-"}</div>
  `;

  card.addEventListener("dragstart", () => {
    draggingJobId = job.id;
    card.style.opacity = "0.6";
  });

  card.addEventListener("dragend", () => {
    draggingJobId = null;
    card.style.opacity = "1";
    cols.forEach((c) => c.classList.remove("dropActive"));
  });

  return card;
}

function renderKanban() {
  const grouped = groupJobs();

  listApplied.innerHTML = "";
  listInterview.innerHTML = "";
  listOffer.innerHTML = "";
  listRejected.innerHTML = "";

  grouped.Applied.forEach((j) => listApplied.appendChild(makeCard(j)));
  grouped.Interview.forEach((j) => listInterview.appendChild(makeCard(j)));
  grouped.Offer.forEach((j) => listOffer.appendChild(makeCard(j)));
  grouped.Rejected.forEach((j) => listRejected.appendChild(makeCard(j)));

  countApplied.textContent = grouped.Applied.length;
  countInterview.textContent = grouped.Interview.length;
  countOffer.textContent = grouped.Offer.length;
  countRejected.textContent = grouped.Rejected.length;
}

function moveJobToStatus(id, newStatus) {
  updateJobStatus(id, newStatus);
}

cols.forEach((col) => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
    col.classList.add("dropActive");
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("dropActive");
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("dropActive");

    if (!draggingJobId) return;

    const newStatus = col.dataset.status;
    moveJobToStatus(draggingJobId, newStatus);
    toast(`Moved to ${newStatus}`);
    renderKanban();
  });
});

renderKanban();
