const openModalBtn = document.getElementById("openModalBtn")
const closeModalBtn = document.getElementById("closeModalBtn")
const cancelBtn = document.getElementById("cancelBtn")
const modal = document.getElementById("modal")
const modalTitle = document.getElementById("modalTitle");

const jobForm = document.getElementById("jobForm")
const jobIdInput = document.getElementById("jobId")

const companyInput = document.getElementById("company")
const roleInput = document.getElementById("role")
const statusInput = document.getElementById("status");
const locationInput = document.getElementById("location");
const salaryInput = document.getElementById("salary");
const appliedDateInput = document.getElementById("appliedDate");
const notesInput = document.getElementById("notes");

const jobsTbody = document.getElementById("jobsTbody");
const emptyText = document.getElementById("emptyText");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortBy = document.getElementById("sortBy");

function openModal(mode = "add") {
    modal.classList.remove("hidden")

    if (mode == "add") {
        modalTitle.textContent = "Add Application"
        jobIdInput.value = ""
        jobForm.reset()
        statusInput.value = "Applied"
    }
}

function closeModal() {
    modal.classList.add("hidden")
}

openModalBtn.addEventListener("click", () => openModal("add"))
closeModalBtn.addEventListener("click", closeModal)
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

function getStatusBadgeClass(status) {
    if (status === "Applied") return "badge--applied"
    if (status === "Interview") return "badge--interview";
    if (status === "Offer") return "badge--offer";
    if (status === "Rejected") return "badge--rejected";
    return "";
}
function normalizeText(t) {
    return (t || "").toLowerCase().trim()

}

function getFilterdJobs() {
    let jobs = getjobs()

    const q = normalizeText(searchInput.value)
    if (q) {
        jobs = jobs.filter((j) => {
            return (
                normalizeText(j.company).includes(q) || normalizeText(j.role).includes(q)

            )
        })
    }

    const st = statusFilter.value;
    if (st !== "All") {
        jobs = jobs.filter((j) => j.status === st)
    }

    const sort = sortBy.value;
    if (sort === "newest") {
        jobs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

    } else if (sort === "oldest") {
        jobs.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))

    } else if (sort === "company") {
        jobs.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
    }
    return jobs;
}

function renderJobs() {
    const jobs = getFilterdJobs()

    jobsTbody.innerHTML = ""

    if (jobs.length === 0) {
        emptyText.style.display = "block"
        return

    }
    else {
        emptyText.style.display = "none"
    }

    jobs.forEach((j) => {
        const tr = document.createElement("tr")

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
        jobsTbody.appendChild(tr)
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
    }
}

function validateForm(data) {
  if (!data.company) return "Company is required";
  if (!data.role) return "Role is required";
  if (!data.status) return "Status is required";
  return "";
}

function addNewJob(data){
    const newJob={
        id:generateId(),
        ...data,
        createdAt:Date.now()
    }

    addJob(newJob);
    toast("Application added")
}

function updateJob(id,data)
{
    const jobs=getJobs().map((j)=>{
        if(j.id===id)
        {
            return {...j,...data}
        }
        return j
    })
    saveJobs(jobs)

    toast("Application updated")
}

jobForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const data =getFormData()
    const error=validateForm(data)

    if(error)
    {
        toast(error)
        return;
    }

    const id = jobIdInput.value

    if(id)
    {
        updateJob(id,data)
    }
    else{
        addNewJob(data)
    }
    closeModal()
    renderJobs()
})

jobsTbody.addEventListener("click",(e)=>{
    const btn = e.target.closest("button")
    if(!btn) return ;
    
    const action = btn.dataset.action
    const id = btn.dataset.id

    if(!action || !id) return;

    if(action ==="delete")
    {
        const  ok = confirm("Delete this application?")
        if(!ok) return;

        const jobs=getjobs().filter((j)=>j.id !==id)
        saveJobs(jobs)
        toast("Deleted")
        renderJobs()
    }

      if (action === "edit") {
    const job = getJobs().find((j) => j.id === id);
    if (!job) return;

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
})
searchInput.addEventListener("input", renderJobs);
statusFilter.addEventListener("change", renderJobs);
sortBy.addEventListener("change", renderJobs);
renderJobs()