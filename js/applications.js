const openModalBtn=document.getElementById("openModalBtn")
const closeModalBtn=document.getElementById("closeModalBtn")
const cancelBtn=document.getElementById("cancelBtn")
const modal = document.getElementById("modal")
const modalTitle = document.getElementById("modalTitle");

const jobForm = document.getElementById("jobForm")
const jobIdInput =document.getElementById("jobId")

const companyInput=document.getElementById("company")
const roleInput =document.getElementById("role")
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

function openModal(mode="add")
{
    modal.classList.remove("hidden")

    if(mode=="add")
    {
        modalTitle.textContent ="Add Application"
        jobIdInput.value=""
        jobForm.reset()
        statusInput.value="Applied"
    }
}

function closeModal(){
    modal.classList.add("hidden")
}

openModalBtn.addEventListener("click",()=>openModal("add"))
closeModalBtn.addEventListener("click",closeModal)
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});