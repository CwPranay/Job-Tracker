function toast(message) {
    const t = document.getElementById("toast")
    if (!t) return;

    t.textContent = message;
    t.classList.remove("hidden")

    setTimeout(() => {
        t.classList.add("hidden")

    }, 2200)

}

function generateId() {
    return "job_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

function formatDate(dateStr) {
    if (!dateStr) return "N/A"
    const d = new Date(dateStr)
    return d.toLocaleDateString()
}

