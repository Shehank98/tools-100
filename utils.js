/* =============================================
   ToolBox — Shared Utilities
   ============================================= */

// ---------- Dark Mode ----------
(function () {
  const stored = localStorage.getItem('tb-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', stored);
})();

function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tb-theme', next);
  const btn = document.getElementById('darkToggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('darkToggle');
  if (btn) {
    const theme = document.documentElement.getAttribute('data-theme');
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
});

// ---------- Mobile Nav ----------
function openMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.add('open');
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
}

// ---------- Toast Notifications ----------
function showToast(msg, type = 'success', duration = 2800) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span>
                     <span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ---------- Copy to Clipboard ----------
async function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); showToast(successMsg); return true; }
    catch { showToast('Copy failed — please copy manually.', 'error'); return false; }
    finally { document.body.removeChild(ta); }
  }
}

// ---------- File Size Formatter ----------
function formatBytes(bytes, decimals = 2) {
  if (!bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ---------- Download Blob ----------
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
}

// ---------- Download with Ad Delay Modal ----------
function showDownloadModal(downloadFn, seconds) {
  if (seconds === undefined) seconds = 6;

  const overlay = document.createElement('div');
  overlay.className = 'dl-overlay';
  overlay.innerHTML = `
    <div class="dl-modal" role="dialog" aria-modal="true" aria-label="Preparing download">
      <div class="dl-header">
        <div class="dl-spinner"></div>
        <div class="dl-info">
          <p class="dl-title">Preparing your download</p>
          <p class="dl-sub">Please wait while we process your file</p>
        </div>
      </div>
      <div class="dl-progress-track">
        <div class="dl-progress-fill" id="dlFill"></div>
      </div>
      <p class="dl-countdown">Download starts in <strong id="dlCount">${seconds}</strong>s</p>
      <div class="dl-ad-wrap">
        <span class="dl-ad-lbl">Advertisement</span>
        <ins class="adsbygoogle"
             style="display:block;width:100%;min-height:120px;"
             data-ad-client="ca-pub-7825416731856682"
             data-ad-slot="8888888888"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}

  const fill    = overlay.querySelector('#dlFill');
  const countEl = overlay.querySelector('#dlCount');
  const total   = seconds * 1000;
  let elapsed   = 0;
  const TICK    = 80;

  const timer = setInterval(() => {
    elapsed += TICK;
    fill.style.width = Math.min(elapsed / total * 100, 100) + '%';
    const left = Math.ceil(Math.max(total - elapsed, 0) / 1000);
    if (parseInt(countEl.textContent) !== left) countEl.textContent = left;
    if (elapsed >= total) {
      clearInterval(timer);
      downloadFn();
      setTimeout(() => {
        overlay.classList.add('dl-overlay-out');
        setTimeout(() => overlay.remove(), 380);
      }, 700);
    }
  }, TICK);
}

// ---------- Drag-over drop zone ----------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); });
  });
});
