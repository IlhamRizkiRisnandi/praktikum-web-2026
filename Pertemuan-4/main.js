// Data Awal Proyek Portofolio
let projects = [
  { id: 1, title: "Sistem Inventaris Keuangan", category: "Web App", budget: 2500000, completed: true },
  { id: 2, title: "Sistem Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
  { id: 3, title: "Landing Page Profil Perusahaan", category: "Web App", budget: 1500000, completed: false },
  { id: 4, title: "Aplikasi Presensi GPS Mobile", category: "Mobile App", budget: 4500000, completed: false }
];

let currentCategory = "Semua";

// Pemeta Warna & Ikon Kategori
const categoryConfig = {
  "Web App": { color: "bg-sky-50 text-sky-700 border-sky-200", icon: "fa-solid fa-globe" },
  "Mobile App": { color: "bg-purple-50 text-purple-700 border-purple-200", icon: "fa-solid fa-mobile-screen-button" },
  "Desktop App": { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "fa-solid fa-desktop" },
  "UI/UX Design": { color: "bg-pink-50 text-pink-700 border-pink-200", icon: "fa-solid fa-palette" }
};

// Format Angka ke Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0
  }).format(angka);
};

// Notifikasi Toast
const showToast = (message, type = 'info') => {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgClass = type === 'success' ? 'bg-emerald-600 text-white' : (type === 'danger' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white');
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'danger' ? 'fa-trash' : 'fa-circle-info');

  toast.className = `${bgClass} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => toast.classList.remove("translate-y-2", "opacity-0"), 10);
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Memperbarui Papan Statistik & Progress Bar
const updateStats = (dataList) => {
  const totalElem = document.getElementById("stat-total-projects");
  const completedElem = document.getElementById("stat-completed-projects");
  const inProgressElem = document.getElementById("stat-in-progress");
  const budgetElem = document.getElementById("stat-total-budget");
  const percentElem = document.getElementById("stat-progress-percent");
  const progressBar = document.getElementById("stat-progress-bar");

  const total = dataList.length;
  const completed = dataList.filter(item => item.completed).length;
  const inProgress = total - completed;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (totalElem) totalElem.textContent = total;
  if (completedElem) completedElem.textContent = completed;
  if (inProgressElem) inProgressElem.textContent = inProgress;
  if (budgetElem) budgetElem.textContent = formatRupiah(totalBudget);
  if (percentElem) percentElem.textContent = `${percentage}%`;
  if (progressBar) progressBar.style.width = `${percentage}%`;

  updateFilterCounts();
};

// Hitung jumlah item per kategori
const updateFilterCounts = () => {
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    const cat = btn.getAttribute("data-category");
    const countBadge = btn.querySelector(".filter-count");
    if (countBadge) {
      if (cat === "Semua") {
        countBadge.textContent = projects.length;
      } else {
        countBadge.textContent = projects.filter(p => p.category === cat).length;
      }
    }
  });
};

// Render Kartu Proyek ke DOM
const renderProjects = (filteredList) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <p class="text-slate-600 font-semibold text-sm">Tidak ada proyek yang sesuai.</p>
        <p class="text-slate-400 text-xs">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredList.map(proj => {
    const isCompleted = proj.completed;
    const badgeStatusClass = isCompleted 
      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
      : "bg-amber-50 text-amber-700 border-amber-200";
    const statusText = isCompleted ? "Selesai" : "Dalam Pengerjaan";
    const statusIcon = isCompleted ? "fa-circle-check" : "fa-clock";

    const catInfo = categoryConfig[proj.category] || { color: "bg-slate-50 text-slate-700 border-slate-200", icon: "fa-solid fa-tag" };

    // FITUR 3: Tombol Aksi Interaktif (Ubah Status & Hapus)
    return `
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
        <div class="space-y-2 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${catInfo.color}">
              <i class="${catInfo.icon} text-[10px]"></i> ${proj.category}
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badgeStatusClass}">
              <i class="fa-solid ${statusIcon} text-[10px]"></i> ${statusText}
            </span>
          </div>

          <h4 class="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">${proj.title}</h4>
          
          <p class="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
            <i class="fa-solid fa-money-bill-wave text-emerald-500 text-xs"></i>
            <span>${formatRupiah(proj.budget)}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button onclick="toggleStatus(${proj.id})" class="flex-1 sm:flex-none px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95">
            <i class="fa-solid fa-rotate text-xs"></i> Ubah Status
          </button>
          <button onclick="deleteProject(${proj.id})" class="flex-1 sm:flex-none px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95">
            <i class="fa-solid fa-trash-can text-xs"></i> Hapus
          </button>
        </div>
      </div>
    `;
  }).join("");
};

// Fungsi sentral untuk menerapkan filter pencarian (Fitur 2) & kategori
function applyFilters() {
  const searchInput = document.getElementById("search");
  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
  
  const filtered = projects.filter(p => {
    const matchCategory = currentCategory === "Semua" || p.category === currentCategory;
    const matchKeyword = p.title.toLowerCase().includes(keyword); 
    return matchCategory && matchKeyword;
  });

  renderProjects(filtered);
  updateStats(projects);
}

// FITUR 3a: Aksi Ubah Status
window.toggleStatus = function(id) {
  let updatedTitle = "";
  let newStatus = false;

  projects = projects.map(proj => {
    if (proj.id === id) {
      updatedTitle = proj.title;
      newStatus = !proj.completed;
      return { ...proj, completed: newStatus };
    }
    return proj;
  });

  applyFilters();
  showToast(`Status "${updatedTitle}" diubah ke ${newStatus ? 'Selesai' : 'Dalam Pengerjaan'}`, 'info');
};

// FITUR 3b: Aksi Hapus Proyek
window.deleteProject = function(id) {
  const targetProject = projects.find(p => p.id === id);
  const title = targetProject ? targetProject.title : "Proyek";

  projects = projects.filter(proj => proj.id !== id);
  applyFilters();
  showToast(`Proyek "${title}" telah dihapus`, 'danger');
};

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();

  // FITUR 1: Formulir Input Dinamis
  const projectForm = document.getElementById("project-form");
  if (projectForm) {
    projectForm.addEventListener("submit", function(e) {
      e.preventDefault(); 
      
      const titleInput = document.getElementById("title").value;
      const categoryInput = document.getElementById("category").value;
      const budgetInput = parseInt(document.getElementById("budget").value);
      const completedInput = document.getElementById("completed").checked;

      if (!titleInput.trim() || isNaN(budgetInput) || budgetInput <= 0) {
        showToast("Judul tidak boleh kosong & anggaran harus lebih dari 0!", 'danger');
        return;
      }

      const newProject = {
        id: Date.now(),
        title: titleInput.trim(),
        category: categoryInput,
        budget: budgetInput,
        completed: completedInput
      };
      
      projects = [newProject, ...projects];
      applyFilters();
      this.reset();
      showToast(`Proyek "${newProject.title}" berhasil ditambahkan!`, 'success');
    });
  }

  // FITUR 2: Pencarian Real-Time
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // Filter Kategori
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => {
        b.classList.remove("active", "bg-sky-500", "text-white", "border-sky-500", "shadow-sm");
        b.classList.add("bg-white", "text-slate-600", "border-slate-200");
        const countBadge = b.querySelector(".filter-count");
        if (countBadge) {
          countBadge.classList.remove("bg-white/20", "text-white");
          countBadge.classList.add("bg-slate-100", "text-slate-600");
        }
      });

      const target = e.currentTarget;
      target.classList.add("active", "bg-sky-500", "text-white", "border-sky-500", "shadow-sm");
      target.classList.remove("bg-white", "text-slate-600", "border-slate-200");
      
      const countBadge = target.querySelector(".filter-count");
      if (countBadge) {
        countBadge.classList.remove("bg-slate-100", "text-slate-600");
        countBadge.classList.add("bg-white/20", "text-white");
      }

      currentCategory = target.getAttribute("data-category");
      applyFilters();
    });
  });
});