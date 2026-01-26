const openSidebarBtn = document.getElementById("openSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const mobileSidebar = document.getElementById("mobileSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openSidebar() {
  mobileSidebar.classList.add("show");
  mobileSidebar.classList.remove("hidden");
  sidebarOverlay.classList.remove("hidden");
}

function closeSidebar() {
  mobileSidebar.classList.remove("show");
  sidebarOverlay.classList.add("hidden");

  setTimeout(() => {
    mobileSidebar.classList.add("hidden");
  }, 250);
}

if (openSidebarBtn) openSidebarBtn.addEventListener("click", openSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});
