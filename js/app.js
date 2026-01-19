function toast(message) {
    const t = document.getElementById("toast")
    if (!t) return;

    t.textContent = message;
    t.classList.remove("hidden")

    setTimeout(() => {
        t.classList.add("hidden")

    }, 2200)

}
function generateId(){
    return "job_" + Date.now()
}

function formatDate(dateStr){
    if(!dateStr) return "N/A"
    const d = new Date(dateStr)
    return d.toLocaleDateString()
}