// Earned-trophy state for the Leonida Trophy Guide: kept in the browser's
// localStorage, exportable to a file and importable back.
export const STORAGE_KEY = 'leonida-trophy-guide-earned-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function toggleEarned(earned, id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  saveEarned(earned);
  return earned;
}

export function exportProgress(earned) {
  const payload = {
    app: 'leonida-trophy-guide',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-trophies-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function parseProgressFile(text) {
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) throw new Error('No earned list found in file');
  return new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  return new Set();
}
