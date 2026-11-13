const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");
const gallery = document.getElementById("gallery");
const photoCount = document.getElementById("photoCount");
let selected = [];

document.getElementById("year").textContent = new Date().getFullYear();
const bn = n => new Intl.NumberFormat("bn-BD").format(n);

function setFiles(files) {
  const valid = Array.from(files).filter(f => /^image\/(jpeg|png|gif|webp)$/.test(f.type) && f.size <= 10*1024*1024);
  if (valid.length !== files.length) statusEl.textContent = "কিছু ফাইল বাদ গেছে: শুধু JPG/PNG/GIF/WEBP এবং ১০ MB-এর মধ্যে হতে হবে।";
  selected = [...selected, ...valid].slice(0, 10);
  renderPreview();
}
input.addEventListener("change", e => { setFiles(e.target.files); input.value = ""; });
["dragenter","dragover"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add("drag"); }));
["dragleave","drop"].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove("drag"); }));
dropzone.addEventListener("drop", e => setFiles(e.dataTransfer.files));

function renderPreview() {
  preview.innerHTML = "";
  selected.forEach((file, i) => {
    const card = document.createElement("div"); card.className = "preview-card";
    const img = document.createElement("img"); img.src = URL.createObjectURL(file); img.alt = file.name;
    const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label","ছবি বাদ দিন");
    remove.onclick = () => { selected.splice(i,1); renderPreview(); };
    card.append(img, remove); preview.append(card);
  });
  uploadBtn.disabled = selected.length === 0;
  if (selected.length) statusEl.textContent = `${bn(selected.length)}টি ছবি আপলোডের জন্য প্রস্তুত`;
  else statusEl.textContent = "এখনো কোনো ছবি নির্বাচন করা হয়নি";
}
uploadBtn.addEventListener("click", async () => {
  if (!selected.length) return;
  uploadBtn.disabled = true; uploadBtn.textContent = "আপলোড হচ্ছে...";
  const data = new FormData(); selected.forEach(file => data.append("photos", file));
  try {
    const res = await fetch("/api/upload", {method:"POST", body:data});
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "আপলোড ব্যর্থ হয়েছে");
    selected = []; renderPreview(); statusEl.textContent = result.message; await loadGallery();
  } catch (err) { statusEl.textContent = err.message; }
  finally { uploadBtn.innerHTML = 'আপলোড করুন <span>↗</span>'; uploadBtn.disabled = selected.length === 0; }
});

async function loadGallery() {
  try {
    const res = await fetch("/api/photos"); const photos = await res.json();
    gallery.innerHTML = ""; photoCount.textContent = `${bn(photos.length)} টি ছবি`;
    if (!photos.length) { gallery.innerHTML = '<div class="empty">এখনো কোনো ছবি আপলোড করা হয়নি। আপনার প্রথম ছবিটি আপলোড করুন!</div>'; return; }
    photos.forEach(photo => {
      const card = document.createElement("div"); card.className = "photo-card";
      const img = document.createElement("img"); img.src = photo.url; img.alt = "আপলোড করা ছবি"; img.loading = "lazy";
      card.append(img); card.onclick = () => { document.getElementById("lightboxImg").src = photo.url; document.getElementById("lightbox").classList.add("open"); };
      gallery.append(card);
    });
  } catch { gallery.innerHTML = '<div class="empty">গ্যালারি লোড করা যায়নি। সার্ভার চালু আছে কি না দেখুন।</div>'; }
}
document.getElementById("closeLightbox").onclick = () => document.getElementById("lightbox").classList.remove("open");
document.getElementById("lightbox").onclick = e => { if (e.target.id === "lightbox") e.currentTarget.classList.remove("open"); };
loadGallery();
