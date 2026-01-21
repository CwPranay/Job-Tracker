const STORAGE_KEY = "jt_jobs_v1"

function getjobs() {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : [];
}

function saveJobs(jobs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

function addJob(job) {
    const jobs = getjobs()
    jobs.unshift(job)
    saveJobs(jobs)
}

function updateJobStatus(id, newStatus) {
    const jobs = getjobs().map(j => {
        if (j.id === id) return {
            ...j, status: newStatus

        }
        return j;
    })
    saveJobs(jobs)
}




