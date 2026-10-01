const SUPABASE_URL = "MASUKKAN_API_URL_KAMU_DI_SINI";
const SUPABASE_KEY = "sb_publishable_RebghkRTbSEY4gq_xYCNRA_b_vZd6f5";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadTasks() {
  const taskList = document.getElementById("taskList");

  const { data, error } = await db
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    taskList.innerHTML = "Gagal mengambil data.";
    console.error(error);
    return;
  }

  if (data.length === 0) {
    taskList.innerHTML = "Belum ada tugas.";
    return;
  }

  taskList.innerHTML = data.map(task => `
    <div class="task ${task.completed ? "done" : ""}">
      <h3>${escapeHTML(task.title)}</h3>
      <p>${escapeHTML(task.description || "")}</p>
      <small>Deadline: ${task.due_date || "-"}</small>
      <br><br>

      <button onclick="toggleTask(${task.id}, ${task.completed})">
        ${task.completed ? "Belum selesai" : "Selesai"}
      </button>

      <button onclick="deleteTask(${task.id})">
        Hapus
      </button>
    </div>
  `).join("");
}

async function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("dueDate").value;

  if (!title) {
    alert("Nama tugas belum diisi.");
    return;
  }

  const { error } = await db.from("tasks").insert({
    title: title,
    description: description,
    due_date: dueDate || null
  });

  if (error) {
    alert("Gagal menambahkan tugas.");
    console.error(error);
    return;
  }

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("dueDate").value = "";

  loadTasks();
}

async function toggleTask(id, currentStatus) {
  const { error } = await db
    .from("tasks")
    .update({ completed: !currentStatus })
    .eq("id", id);

  if (error) {
    alert("Gagal mengubah tugas.");
    console.error(error);
    return;
  }

  loadTasks();
}

async function deleteTask(id) {
  if (!confirm("Hapus tugas ini?")) return;

  const { error } = await db
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Gagal menghapus tugas.");
    console.error(error);
    return;
  }

  loadTasks();
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

loadTasks();