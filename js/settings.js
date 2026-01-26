

const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const importBtn = document.getElementById("importBtn");

const resetBtn = document.getElementById("resetBtn");
const resetModal = document.getElementById("resetModal");
const closeResetModalBtn = document.getElementById("closeResetModalBtn");
const cancelResetBtn = document.getElementById("cancelResetBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn");

function downloadFile(filename, text) {
    const blob = new Blob([text], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

exportBtn.addEventListener("click", () => {
    const jobs = getjobs()
    const payload = {
        version: "jt_backup_v1",
        exportedAt: new Date().toString(),
        total: jobs.length,
        jobs,
    }
    downloadFile("job-applications-backup.json",JSON.stringify(payload,null,2))
    toast("Backup downloaded ")
})

importBtn.addEventListener("click",()=>{
    const file = importFile.files[0]
    if(!file)
    {
        toast("choose a json file first")
        return;
    }

    const reader = new FileReader()

    reader.onload=()=>{
        try {
            const data = JSON.parse(reader.result)
            const jobs = Array.isArray(data) ? data :data.jobs;

            if(!Array.isArray(jobs))
            {
                toast("Invalid backup file")
                return
            }

            saveJobs(jobs)
            toast("Backup imported")
        } catch (error) {
            toast("Failed to import JSON")
        }
    }

    reader.readAsText(file)
})

function openResetModal()
{
    resetModal.classList.remove("hidden")
}

function closeResetModal()
{
    resetModal.classList.add("hidden")
}

resetBtn.addEventListener("click", openResetModal);
closeResetModalBtn.addEventListener("click", closeResetModal);
cancelResetBtn.addEventListener("click", closeResetModal);

resetModal.addEventListener("click",(e)=>{
    if(e.target===resetModal) closeResetModal()
})

confirmResetBtn.addEventListener("click",()=>{
    localStorage.removeItem("jt_jobs_v1")
    toast("All data deleted")
    closeResetModal()
})