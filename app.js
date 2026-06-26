// ============================================================
//  MoneyMe — app.js
//  แก้ค่า SCRIPT_URL ด้านล่างหลัง deploy Google Apps Script
// ============================================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxF1vWC--uS7h-6SquTc2LkP1jh_-X5Lq9TY00QrMtdSoJ0pOWqdiwQFprCawNuVjDz/exec';

// ============================================================
//  DATA (LocalStorage สำหรับ offline-first)
// ============================================================

const CATS = {
  expense: [
    { id:'food',    icon:'🍜', label:'อาหาร' },
    { id:'fuel',    icon:'⛽', label:'น้ำมัน' },
    { id:'happy',   icon:'🎉', label:'ความสุข' },
    { id:'health',  icon:'💊', label:'สุขภาพ' },
    { id:'family',  icon:'🏠', label:'เงินให้บ้าน' },
    { id:'car',     icon:'🚗', label:'ผ่อนรถ' },
    { id:'fund',    icon:'🛡️', label:'ประกัน/กองทุน' },
    { id:'other',   icon:'📦', label:'อื่นๆ' },
  ],
  income: [
    { id:'salary',   icon:'💼', label:'เงินเดือน' },
    { id:'free',     icon:'💻', label:'Freelance' },
    { id:'bonus',    icon:'🎁', label:'โบนัส' },
    { id:'other_in', icon:'💵', label:'อื่นๆ' },
  ],
  invest: [
    { id:'dca',    icon:'🤖', label:'DCA กองทุน' },
    { id:'gold',   icon:'🏅', label:'ทอง' },
    { id:'bond',   icon:'🏛️', label:'หุ้นกู้' },
    { id:'stock',  icon:'📊', label:'หุ้น/ETF' },
    { id:'rmf',    icon:'🔮', label:'RMF/ThaiESG' },
    { id:'other_i',icon:'💎', label:'อื่นๆ' },
  ]
};

// ค่า default recurring จากข้อมูลของคุณ
const DEFAULT_RECURRING = [
  { id:'r1', name:'ผ่อนรถ',         icon:'🚗', amount:42950, day:10, cat:'car',    mode:'auto' },
  { id:'r2', name:'เงินให้บ้าน',    icon:'🏠', amount:30000, day:10, cat:'family', mode:'auto' },
  { id:'r3', name:'DCA กองทุน AI',  icon:'🤖', amount:20000, day:10, cat:'invest', mode:'auto' },
  { id:'r4', name:'กองทุน/ประกัน',  icon:'🛡️', amount:81000, day:10, cat:'fund',   mode:'auto' },
  { id:'r5', name:'ฟิตเนส',         icon:'💪', amount:2500,  day:5,  cat:'fixed',  mode:'auto' },
  { id:'r6', name:'มือถือ/Canva',   icon:'📱', amount:826,   day:29, cat:'fixed',  mode:'auto' },
];

const DEFAULT_INVESTMENTS = [
  { id:'i1', name:'หุ้นกู้ที่ดิน', icon:'🏛️', amount:500000, type:'bond',  liquidity:'lock',   maturity:'ธ.ค. 2026' },
  { id:'i2', name:'หุ้นกู้ Built', icon:'🏛️', amount:300000, type:'bond',  liquidity:'lock',   maturity:'มี.ค. 2027' },
  { id:'i3', name:'กองทุน AI (DCA)',icon:'🤖', amount:240000, type:'dca',   liquidity:'dca',    maturity:'DCA ต่อเนื่อง' },
  { id:'i4', name:'ทอง',           icon:'🏅', amount:213611, type:'gold',  liquidity:'liquid', maturity:'ไม่มีกำหนด' },
  { id:'i5', name:'RMF + ThaiESG', icon:'🔮', amount:160000, type:'tax',   liquidity:'tax',    maturity:'ถึงอายุ 55 ปี' },
];

// historical data จากไฟล์ excel
const HISTORICAL = {
  'Jan': { income:390340, expense:211962, saving:97378, dca:20000,
    cats: { 'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':45890,'เงินให้บ้าน':30000,'อาหาร':28068,'น้ำมัน+อื่นๆ':12054 } },
  'Feb': { income:401023, expense:181621, saving:138402, dca:20000,
    cats: { 'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':57944,'เงินให้บ้าน':40000,'อาหาร':20530,'น้ำมัน+อื่นๆ':6240 } },
  'Mar': { income:460063, expense:272020, saving:107043, dca:20000,
    cats: { 'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':112254,'เงินให้บ้าน':30000,'อาหาร':24280,'น้ำมัน+อื่นๆ':27204 } },
  'Apr': { income:331093, expense:189669, saving:60424, dca:20000,
    cats: { 'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':56489,'เงินให้บ้าน':30000,'อาหาร':28302,'น้ำมัน+อื่นๆ':4615 } },
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

// ============================================================
//  STATE
// ============================================================
let currentType = 'expense';
let selectedCat = CATS.expense[0].id;
let transactions = JSON.parse(localStorage.getItem('mm_tx') || '[]');
let recurring    = JSON.parse(localStorage.getItem('mm_rec') || 'null') || DEFAULT_RECURRING;
let investments  = JSON.parse(localStorage.getItem('mm_inv') || 'null') || DEFAULT_INVESTMENTS;

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  document.getElementById('f-date').value = now.toISOString().split('T')[0];
  document.getElementById('add-date-display').textContent =
    now.toLocaleDateString('th-TH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  renderCats();
  renderDashboard();
  renderRecurring();
  renderInvestments();
  renderYearly();
});

// ============================================================
//  SCREEN NAVIGATION
// ============================================================
function switchScreen(id, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (id === 'dash')  renderDashboard();
  if (id === 'rec')   renderRecurring();
  if (id === 'inv')   renderInvestments();
  if (id === 'year')  renderYearly();
}

// ============================================================
//  ADD TRANSACTION FORM
// ============================================================
function setType(type, btn) {
  currentType = type;
  document.querySelectorAll('.type-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedCat = CATS[type][0].id;
  renderCats();
}

function renderCats() {
  const grid = document.getElementById('cat-grid');
  grid.innerHTML = CATS[currentType].map(c => `
    <button class="cat-btn ${c.id === selectedCat ? 'sel' : ''}" onclick="selCat('${c.id}',this)">
      <span class="icon">${c.icon}</span>
      <span class="label">${c.label}</span>
    </button>
  `).join('');
}

function selCat(id, btn) {
  selectedCat = id;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

async function saveTransaction() {
  const amount = parseFloat(document.getElementById('f-amount').value);
  const date   = document.getElementById('f-date').value;
  const note   = document.getElementById('f-note').value.trim();

  if (!amount || amount <= 0) { showToast('กรุณาใส่จำนวนเงิน', true); return; }
  if (!date) { showToast('กรุณาเลือกวันที่', true); return; }

  const cat = CATS[currentType].find(c => c.id === selectedCat);
  const tx = { id: Date.now(), date, type: currentType, catId: selectedCat,
               catName: cat.label, catIcon: cat.icon, amount, note,
               timestamp: new Date().toISOString() };

  // save local first (offline-first)
  transactions.unshift(tx);
  localStorage.setItem('mm_tx', JSON.stringify(transactions.slice(0, 500)));

  // reset form
  document.getElementById('f-amount').value = '';
  document.getElementById('f-note').value = '';

  showToast(`${cat.icon} บันทึกแล้ว ฿${fmt(amount)}`);

  // sync to Google Sheet
  const btn = document.getElementById('save-btn');
  btn.classList.add('loading');
  btn.textContent = '⏳ กำลังส่งไป Google Sheet...';
  try {
    await sendToSheet({ action: 'addTransaction', ...tx });
    btn.textContent = '✅ บันทึกสำเร็จ';
  } catch(e) {
    btn.textContent = '⚠️ บันทึก local แล้ว (sync ทีหลัง)';
  }
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = '<span>💾</span> บันทึกเข้า Google Sheet';
  }, 2500);
}

// ============================================================
//  DASHBOARD
// ============================================================
function renderDashboard() {
  const now = new Date();
  const monthKey = MONTH_NAMES[now.getMonth()];
  const monthTH = MONTH_TH[now.getMonth()] + ' ' + (now.getFullYear() + 543);
  document.getElementById('dash-month-label').textContent = monthTH;

  // merge historical + local transactions for this month
  const hist = HISTORICAL[monthKey] || null;
  const localThisMonth = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  let income = hist ? hist.income : 0;
  let expense = hist ? hist.expense : 0;
  let dca = hist ? hist.dca : 0;

  localThisMonth.forEach(tx => {
    if (tx.type === 'income') income += tx.amount;
    else if (tx.type === 'expense') expense += tx.amount;
    else if (tx.type === 'invest' && tx.catId === 'dca') dca += tx.amount;
  });

  const saving = income - expense;
  const remain = saving - dca;

  document.getElementById('d-income').textContent  = '฿' + fmt(income);
  document.getElementById('d-expense').textContent = '฿' + fmt(expense);
  document.getElementById('d-saving').textContent  = '฿' + fmt(saving);
  document.getElementById('d-dca').textContent     = '฿' + fmt(dca);
  document.getElementById('d-remain').textContent  = '฿' + fmt(remain);

  // donut + bars
  const cats = hist ? hist.cats : {};
  renderDonut(cats, expense);
  renderBars(cats);
  renderRecentTx();
}

function renderDonut(cats, total) {
  const colors = ['#378ADD','#E24B4A','#EF9F27','#1D9E75','#7F77DD','#888780'];
  const entries = Object.entries(cats);
  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');

  const r = 38; const cx = 50; const cy = 50;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  let circles = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f0f0f0" stroke-width="16"/>`;
  let legendHtml = '';

  entries.forEach(([name, val], i) => {
    const pct = total > 0 ? val / total : 0;
    const dash = pct * circ;
    const gap  = circ - dash;
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[i % colors.length]}"
      stroke-width="16" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}"
      stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += dash;

    legendHtml += `<div class="legend-item">
      <div class="legend-dot" style="background:${colors[i % colors.length]}"></div>
      <span class="legend-name">${name}</span>
      <span class="legend-pct">${total > 0 ? Math.round(val/total*100) : 0}%</span>
    </div>`;
  });

  svg.innerHTML = circles;
  legend.innerHTML = legendHtml;
}

function renderBars(cats) {
  const maxVal = Math.max(...Object.values(cats), 1);
  const colors = ['#378ADD','#E24B4A','#EF9F27','#1D9E75','#7F77DD','#888780'];
  const entries = Object.entries(cats);
  document.getElementById('bar-chart').innerHTML = entries.map(([name, val], i) => `
    <div class="bar-row">
      <span class="bar-label">${name}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/maxVal*100)}%;background:${colors[i % colors.length]}"></div></div>
      <span class="bar-amount">${fmtShort(val)}</span>
    </div>
  `).join('');
}

function renderRecentTx() {
  const el = document.getElementById('recent-tx');
  const recent = transactions.slice(0, 8);
  if (recent.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px 0;font-size:14px;">ยังไม่มีรายการ<br>กด + บันทึกรายแรกได้เลย</div>';
    return;
  }
  el.innerHTML = recent.map(tx => {
    const sign = tx.type === 'income' ? '+' : tx.type === 'invest' ? '' : '-';
    const cls  = tx.type === 'income' ? 'pos' : tx.type === 'invest' ? 'inv' : 'neg';
    const d = new Date(tx.date);
    const dateStr = d.toLocaleDateString('th-TH', { day:'numeric', month:'short' });
    return `<div class="tx-item">
      <div class="tx-icon" style="background:#f5f5f7">${tx.catIcon}</div>
      <div class="tx-info">
        <div class="tx-name">${tx.catName}${tx.note ? ' · ' + tx.note : ''}</div>
        <div class="tx-meta">${dateStr} · ${tx.type === 'income' ? 'รายรับ' : tx.type === 'invest' ? 'ลงทุน' : 'รายจ่าย'}</div>
      </div>
      <div class="tx-amt ${cls}">${sign}฿${fmt(tx.amount)}</div>
    </div>`;
  }).join('');
}

// ============================================================
//  RECURRING
// ============================================================
function renderRecurring() {
  const now = new Date();
  const today = now.getDate();

  // status card
  const todayItems = recurring.filter(r => r.day === today);
  const paidItems  = recurring.filter(r => r.day < today);
  const upcoming   = recurring.filter(r => r.day > today).sort((a,b) => a.day - b.day);

  document.getElementById('rec-status-card').innerHTML = `
    <div style="margin-bottom:12px">
      <div style="font-size:13px;color:var(--text2);margin-bottom:6px;">วันนี้ (${today} ${MONTH_TH[now.getMonth()]})</div>
      ${todayItems.length > 0
        ? todayItems.map(r => `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;">
            <span>${r.icon}</span>
            <span style="font-size:14px;font-weight:600">${r.name}</span>
            <span style="margin-left:auto;font-size:14px;font-weight:700;color:var(--green)">✓ ฿${fmt(r.amount)}</span>
          </div>`).join('')
        : '<div style="font-size:13px;color:var(--text3)">ไม่มีรายการวันนี้</div>'
      }
    </div>
    <div class="divider"></div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:6px;">รายการถัดไป</div>
    ${upcoming.slice(0,3).map(r => `
      <div style="display:flex;align-items:center;gap:8px;padding:4px 0;">
        <span>${r.icon}</span>
        <span style="font-size:13px;color:var(--text2)">${r.name}</span>
        <span class="badge badge-pending" style="margin-left:auto">วันที่ ${r.day}</span>
        <span style="font-size:13px;font-weight:600">฿${fmt(r.amount)}</span>
      </div>`).join('')}
  `;

  // list
  document.getElementById('rec-list').innerHTML = recurring.map(r => {
    const isPaid  = r.day <= today;
    const isToday = r.day === today;
    const badge   = isToday
      ? `<span class="badge badge-paid">✓ วันนี้</span>`
      : isPaid
        ? `<span class="badge badge-paid">✓ paid</span>`
        : `<span class="badge badge-pending">วันที่ ${r.day}</span>`;
    const modeBadge = r.mode === 'auto'
      ? `<span class="badge badge-auto" style="margin-left:4px">auto</span>` : '';
    return `<div class="rec-item">
      <div class="rec-icon" style="background:#f5f5f7;font-size:20px">${r.icon}</div>
      <div class="rec-info">
        <div class="rec-name">${r.name}</div>
        <div class="rec-sub">ทุกวันที่ ${r.day} ของทุกเดือน</div>
      </div>
      <div class="rec-right">
        <div class="rec-amt">฿${fmt(r.amount)}</div>
        <div>${badge}${modeBadge}</div>
      </div>
    </div>`;
  }).join('');
}

function saveRecurring() {
  const name = document.getElementById('rec-name').value.trim();
  const amt  = parseFloat(document.getElementById('rec-amt').value);
  const day  = parseInt(document.getElementById('rec-day').value);
  const cat  = document.getElementById('rec-cat').value;
  const mode = document.getElementById('rec-mode').value;
  const icon = document.getElementById('rec-icon').value.trim() || '📌';

  if (!name || !amt) { showToast('กรุณาใส่ชื่อและจำนวนเงิน', true); return; }

  recurring.push({ id: 'r' + Date.now(), name, icon, amount: amt, day, cat, mode });
  localStorage.setItem('mm_rec', JSON.stringify(recurring));
  closeModal('modal-add-rec');
  renderRecurring();
  showToast(`${icon} เพิ่ม "${name}" แล้ว`);

  // clear inputs
  ['rec-name','rec-amt','rec-icon'].forEach(id => document.getElementById(id).value = '');
}

function saveSettings() {
  const settings = {
    autoLog: document.getElementById('tog-auto').checked,
    emailNotif: document.getElementById('tog-email').checked,
    safeMode: document.getElementById('tog-safe').checked,
  };
  localStorage.setItem('mm_settings', JSON.stringify(settings));
  sendToSheet({ action: 'updateSettings', ...settings }).catch(() => {});
}

// ============================================================
//  INVESTMENTS
// ============================================================
function renderInvestments() {
  const locked  = investments.filter(i => i.liquidity === 'lock').reduce((s,i) => s + i.amount, 0);
  const liquid  = investments.filter(i => i.liquidity === 'liquid').reduce((s,i) => s + i.amount, 0);
  const total   = investments.reduce((s,i) => s + i.amount, 0);

  document.getElementById('inv-total').textContent  = '฿' + fmt(total);
  document.getElementById('inv-locked').textContent = '฿' + fmt(locked);
  document.getElementById('inv-liquid').textContent = '฿' + fmt(liquid);

  const tagMap = {
    lock: ['🔒 Lock', 'tag-lock'],
    liquid: ['💧 Liquid', 'tag-liquid'],
    dca: ['🔄 DCA', 'tag-dca'],
    tax: ['🔮 ลดหย่อน', 'tag-tax'],
  };

  document.getElementById('inv-list').innerHTML = investments.map(inv => {
    const [tagLabel, tagClass] = tagMap[inv.liquidity] || ['', ''];
    return `<div class="inv-item">
      <div class="inv-icon" style="background:#f5f5f7;font-size:20px">${inv.icon}</div>
      <div class="inv-info">
        <div class="inv-name">${inv.name}</div>
        <div class="inv-sub">${inv.maturity}</div>
      </div>
      <div class="inv-right">
        <div class="inv-amt">฿${fmt(inv.amount)}</div>
        <div><span class="tag ${tagClass}">${tagLabel}</span></div>
      </div>
    </div>`;
  }).join('');
}

function saveInvestment() {
  const name     = document.getElementById('inv-name-inp').value.trim();
  const amount   = parseFloat(document.getElementById('inv-amt-inp').value);
  const type     = document.getElementById('inv-type-inp').value;
  const liq      = document.getElementById('inv-liq-inp').value;
  const maturity = document.getElementById('inv-maturity-inp').value.trim() || 'ไม่มีกำหนด';
  const iconMap  = { bond:'🏛️', fund:'📊', gold:'🏅', stock:'📈', dca:'🤖', tax:'🔮', other:'💎' };

  if (!name || !amount) { showToast('กรุณาใส่ชื่อและจำนวนเงิน', true); return; }

  const newInv = { id: 'i' + Date.now(), name, icon: iconMap[type] || '💎', amount, type, liquidity: liq, maturity };
  investments.push(newInv);
  localStorage.setItem('mm_inv', JSON.stringify(investments));
  closeModal('modal-add-inv');
  renderInvestments();
  showToast(`${newInv.icon} เพิ่ม "${name}" แล้ว`);
  sendToSheet({ action: 'addInvestment', ...newInv }).catch(() => {});
  ['inv-name-inp','inv-amt-inp','inv-maturity-inp'].forEach(id => document.getElementById(id).value = '');
}

// ============================================================
//  YEARLY OVERVIEW
// ============================================================
function renderYearly() {
  const months = Object.keys(HISTORICAL);
  let totalSaving = 0;

  const monthHtml = MONTH_NAMES.map((m, i) => {
    const h = HISTORICAL[m];
    if (!h) {
      return `<div class="month-card empty">
        <div class="mn">${MONTH_TH[i]}</div>
        <div class="mv">—</div>
      </div>`;
    }
    totalSaving += h.saving;
    const cls = h.saving >= 0 ? 'pos' : 'neg';
    return `<div class="month-card">
      <div class="mn">${MONTH_TH[i]}</div>
      <div class="mv ${cls}">${fmtShort(h.saving)}</div>
    </div>`;
  }).join('');

  document.getElementById('year-total-saving').textContent = '฿' + fmt(totalSaving);
  document.getElementById('month-grid').innerHTML = monthHtml;

  // aggregate cats
  const aggCats = {};
  Object.values(HISTORICAL).forEach(h => {
    Object.entries(h.cats).forEach(([k, v]) => { aggCats[k] = (aggCats[k] || 0) + v; });
  });
  const totalExp = Object.values(aggCats).reduce((s,v) => s+v, 0);
  const colors = ['#378ADD','#E24B4A','#EF9F27','#1D9E75','#7F77DD','#888780'];
  const maxV = Math.max(...Object.values(aggCats), 1);

  document.getElementById('year-cat-breakdown').innerHTML = Object.entries(aggCats).map(([name, val], i) => `
    <div class="bar-row">
      <span class="bar-label">${name}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/maxV*100)}%;background:${colors[i%colors.length]}"></div></div>
      <span class="bar-amount">${fmtShort(val)}</span>
    </div>
  `).join('');
}

// ============================================================
//  MODAL
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }

// ============================================================
//  GOOGLE SHEET SYNC
// ============================================================
async function sendToSheet(data) {
  if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') return; // not configured yet
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res;
}

// ============================================================
//  UTILS
// ============================================================
function fmt(n) {
  return Math.round(n).toLocaleString('th-TH');
}
function fmtShort(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000)    return Math.round(n/1000) + 'k';
  return Math.round(n).toString();
}

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
