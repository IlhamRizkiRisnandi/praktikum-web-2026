// File: script.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil elemen DOM
  const todoForm = document.querySelector("#todoForm");
  const taskInput = document.querySelector("#taskInput");
  const inputError = document.querySelector("#inputError");
  const todoList = document.querySelector("#todoList");
  const taskCounter = document.querySelector("#taskCounter"); // Elemen Fitur 1
  const clearCompletedBtn = document.querySelector("#clearCompletedBtn"); // Elemen Fitur 2

  // 2. Fungsi membaca dan menyimpan ke LocalStorage
  const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
  const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

  // Fungsi tambahan untuk mengupdate Fitur 1 (Task Counter)
  const updateCounter = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const uncompleted = total - completed;
    
    // Perbarui teks informasi
    taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${uncompleted}`;
    
    // Tampilkan tombol "Bersihkan" hanya jika ada tugas yang selesai (Opsional agar lebih rapi)
    if (completed > 0) {
      clearCompletedBtn.style.display = "block";
    } else {
      clearCompletedBtn.style.display = "none";
    }
  };

  // 3. Fungsi menampilkan daftar tugas ke layar
  const renderTasks = () => {
    const tasks = getTasks();
    todoList.innerHTML = "";
    
    // Panggil fungsi update penghitung setiap kali render
    updateCounter(tasks);
    
    if (tasks.length === 0) {
      todoList.innerHTML = "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
      return;
    }
    
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <span class="todo-text">${task.text}</span>
        <div class="todo-actions">
          <button class="action-btn complete-btn" data-index="${index}">
            ${task.completed ? 'Batal' : 'Selesai'}
          </button>
          <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
        </div>
      `;
      todoList.appendChild(li);
    });
  };

  // 4. Tambah tugas saat formulir dikirim
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    
    // Validasi input sederhana
    if (taskText.length < 3) {
      taskInput.classList.add("error");
      inputError.style.display = "block";
      return;
    }
    
    // Jika valid, hilangkan pesan error
    taskInput.classList.remove("error");
    inputError.style.display = "none";
    
    // Simpan tugas baru ke array LocalStorage
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);
    
    taskInput.value = "";
    renderTasks();
  });

  // 5. Tangani klik tombol Selesai dan Hapus menggunakan Event Listener pada todoList
  todoList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    
    if (index === undefined) return;
    
    const tasks = getTasks();
    
    if (e.target.classList.contains("complete-btn")) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    } else if (e.target.classList.contains("delete-btn")) {
      // Fitur 3: Dialog Konfirmasi Sebelum Menghapus
      const isConfirm = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
      if (isConfirm) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      }
    }
  });

  // 6. Fitur 2: Event Listener untuk Tombol Bersihkan Tugas Selesai
  clearCompletedBtn.addEventListener("click", () => {
    let tasks = getTasks();
    // Filter array: Hanya simpan tugas yang BELUM selesai (!task.completed)
    tasks = tasks.filter(task => !task.completed);
    
    saveTasks(tasks);
    renderTasks();
  });

  // Render pertama kali saat halaman selesai dimuat
  renderTasks();
});