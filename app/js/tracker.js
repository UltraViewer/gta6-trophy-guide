// tracker.js — earned state: localStorage persistence, export to file, import back.
const STORAGE_KEY = "gta6-trophy-guide-progress";

export class TrophyTracker {
  constructor(total) {
    this.total = total;
    this.earned = new Set(this.loadStoredIds());
  }

  loadStoredIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.earned].sort((a, b) => a - b)));
  }

  isEarned(id) {
    return this.earned.has(id);
  }

  toggle(id) {
    if (this.earned.has(id)) this.earned.delete(id);
    else this.earned.add(id);
    this.save();
  }

  setEarned(ids) {
    this.earned = new Set(ids.filter((id) => Number.isInteger(id) && id >= 1 && id <= this.total));
    this.save();
  }

  earnedCount() {
    return this.earned.size;
  }

  earnedPercent() {
    return this.total ? Math.round((this.earned.size / this.total) * 100) : 0;
  }

  exportToFile() {
    const payload = {
      app: "leonida-trophy-guide",
      exportedAt: new Date().toISOString(),
      earned: [...this.earned].sort((a, b) => a - b),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gta6-trophy-progress.json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async importFromFile(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(ids)) throw new Error("Progress file has no earned list.");
    this.setEarned(ids);
    return this.earned.size;
  }
}
