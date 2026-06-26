// ============================================================
//  MoneyMe — app.js  (Full version with all features)
// ============================================================

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxF1vWC--uS7h-6SquTc2LkP1jh_-X5Lq9TY00QrMtdSoJ0pOWqdiwQFprCawNuVjDz/exec';

// ============================================================
//  CATEGORIES
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
    { id:'util',    icon:'💡', label:'น้ำ/ไฟ' },
    { id:'install', icon:'📦', label:'ผ่อนสินค้า' },
    { id:'other',   icon:'📋', label:'อื่นๆ' },
  ],
  income: [
    { id:'salary',   icon:'💼', label:'เงินเดือน' },
    { id:'free',     icon:'💻', label:'Freelance' },
    { id:'bonus',    icon:'🎁', label:'โบนัส' },
    { id:'other_in', icon:'💵', label:'อื่นๆ' },
  ],
  invest: [
    { id:'dca',     icon:'🤖', label:'DCA กองทุน' },
    { id:'gold',    icon:'🏅', label:'ทอง' },
    { id:'bond',    icon:'🏛️', label:'หุ้นกู้' },
    { id:'stock',   icon:'📊', label:'หุ้น/ETF' },
    { id:'rmf',     icon:'🔮', label:'RMF/ThaiESG' },
    { id:'other_i', icon:'💎', label:'อื่นๆ' },
  ]
};

// ============================================================
//  DEFAULT DATA
// ============================================================
const DEFAULT_RECURRING = [
  { id:'r1', name:'ผ่อนรถ',        icon:'🚗', amount:42950, day:10, freq:1,  cat:'car',    mode:'auto', effDate:'2026-01' },
  { id:'r2', name:'เงินให้บ้าน',   icon:'🏠', amount:30000, day:10, freq:1,  cat:'family', mode:'auto', effDate:'2026-01' },
  { id:'r3', name:'DCA กองทุน AI', icon:'🤖', amount:20000, day:10, freq:1,  cat:'invest', mode:'auto', effDate:'2026-01' },
  { id:'r4', name:'กองทุน/ประกัน', icon:'🛡️', amount:81000, day:10, freq:1,  cat:'fund',   mode:'auto', effDate:'2026-01' },
  { id:'r5', name:'ฟิตเนส',        icon:'💪', amount:2500,  day:5,  freq:1,  cat:'fixed',  mode:'auto', effDate:'2026-01' },
  { id:'r6', name:'มือถือ/Canva',  icon:'📱', amount:826,   day:29, freq:1,  cat:'fixed',  mode:'auto', effDate:'2026-01' },
];

const DEFAULT_INVESTMENTS = [
  { id:'i1', name:'กองทุน Fin (ลดหย่อน)',   icon:'🔮', amount:2900000, type:'tax',   liquidity:'tax',    maturity:'ถึงอายุ 55 ปี' },
  { id:'i2', name:'กองทุนหุ้น Fin Guru (DCA)',icon:'🤖', amount:260000,  type:'dca',   liquidity:'dca',    maturity:'DCA 20,000/เดือน' },
  { id:'i3', name:'Pailin Investment',        icon:'🏛️', amount:1000000, type:'bond',  liquidity:'lock',   maturity:'ติดตามกำหนดคืน' },
  { id:'i4', name:'ทอง',                      icon:'🏅', amount:545570,  type:'gold',  liquidity:'liquid', maturity:'ขายได้ตลอด' },
  { id:'i5', name:'ขายฝาก พช ที่ดิน Q19',    icon:'🏠', amount:240625,  type:'bond',  liquidity:'lock',   maturity:'ติดตามกำหนดคืน' },
  { id:'i6', name:'DR Yuanta',                icon:'📊', amount:250000,  type:'stock', liquidity:'liquid', maturity:'ถอนได้ตลอด' },
  { id:'i7', name:'หุ้นกู้บิวท์',             icon:'🏗️', amount:400000,  type:'bond',  liquidity:'lock',   maturity:'ติดตามกำหนดคืน' },
  { id:'i8', name:'Dime',                     icon:'💎', amount:125000,  type:'other', liquidity:'lock',   maturity:'ติดตามกำหนดคืน' },
];

const HISTORICAL = {
  'Jan': { income:390340, expense:211962, saving:97378,  dca:20000, cats:{'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':45890,'เงินให้บ้าน':30000,'อาหาร':28068,'อื่นๆ':12054} },
  'Feb': { income:401023, expense:181621, saving:138402, dca:20000, cats:{'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':57944,'เงินให้บ้าน':40000,'อาหาร':20530,'อื่นๆ':6240} },
  'Mar': { income:460063, expense:272020, saving:107043, dca:20000, cats:{'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':112254,'เงินให้บ้าน':30000,'อาหาร':24280,'อื่นๆ':27204} },
  'Apr': { income:331093, expense:189669, saving:60424,  dca:20000, cats:{'กองทุน/ประกัน':81000,'ผ่อนรถ':42950,'ความสุข':56489,'เงินให้บ้าน':30000,'อาหาร':28302,'อื่นๆ':4615} },
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_TH    = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

// ============================================================
//  STATE
// ============================================================
let currentType  = 'expense';
let selectedCat  = CATS.expense[0].id;
let transactions = JSON.parse(localStorage.getItem('mm_tx')  || '[]');
let recurring    = JSON.parse(localStorage.getItem('mm_rec') || 'null') || DEFAULT_RECURRING;
let investments  = JSON.parse(localStorage.getItem('mm_inv') || 'null') || DEFAULT_INVESTMENTS;
let installments = JSON.parse(localStorage.getItem('mm_inst')|| '[]'); // ระบบผ่อน

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
  renderPredict();
  renderYearly();
  processInstallments(); // check ถ้ามีงวดที่ถึงกำหนดวันนี้
});

// ============================================================
//  SCREEN NAV
// ============================================================
function switchScreen(id, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (id === 'dash')    renderDashboard();
  if (id === 'rec')     renderRecurring();
  if (id === 'inv')     renderInvestments();
  if (id === 'predict') renderPredict();
  if (id === 'year')    renderYearly();
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
    </button>`).join('');
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
  const tx = { id:Date.now(), date, type:currentType, catId:selectedCat,
               catName:cat.label, catIcon:cat.icon, amount, note,
               timestamp:new Date().toISOString() };

  transactions.unshift(tx);
  localStorage.setItem('mm_tx', JSON.stringify(transactions.slice(0, 500)));

  // ===== ถามว่าจะตั้งเป็นรายการประจำไหม =====
  const makeRecurring = document.getElementById('chk-make-recurring')?.checked;
  if (makeRecurring) {
    openModalSetRecurring(tx);
  }

  document.getElementById('f-amount').value = '';
  document.getElementById('f-note').value   = '';
  document.getElementById('f-date').value   = new Date().toISOString().split('T')[0];
  if (document.getElementById('chk-make-recurring')) {
    document.getElementById('chk-make-recurring').checked = false;
  }
  toggleRecurringOptions(false);

  showToast(`${cat.icon} บันทึกแล้ว ฿${fmt(amount)}`);

  const btn = document.getElementById('save-btn');
  btn.classList.add('loading');
  btn.textContent = '⏳ กำลังส่ง...';
  try {
    await sendToSheet({ action:'addTransaction', ...tx });
    btn.textContent = '✅ บันทึกสำเร็จ';
  } catch(e) {
    btn.textContent = '⚠️ บันทึก local แล้ว';
  }
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = '<span>💾</span> บันทึกเข้า Google Sheet';
  }, 2000);
}

// ============================================================
//  INSTALLMENT (ระบบผ่อน)
// ============================================================
function openInstallmentModal() {
  document.getElementById('modal-installment').classList.add('open');
}

function saveInstallment() {
  const name    = document.getElementById('inst-name').value.trim();
  const total   = parseFloat(document.getElementById('inst-total').value);
  const periods = parseInt(document.getElementById('inst-periods').value);
  const day     = parseInt(document.getElementById('inst-day').value);
  const startM  = document.getElementById('inst-start').value; // YYYY-MM
  const spread  = document.getElementById('inst-spread')?.value || 'forward'; // forward / backward

  if (!name || !total || !periods || !day) { showToast('กรุณาใส่ข้อมูลให้ครบ', true); return; }

  const perMonth = Math.round(total / periods);
  const now = new Date();
  const [sy, sm] = startM ? startM.split('-').map(Number) : [now.getFullYear(), now.getMonth()+1];

  const inst = {
    id: 'inst_' + Date.now(),
    name, total, periods, perMonth, day,
    startYear: sy, startMonth: sm,
    spread,
    paidCount: 0,
    createdAt: new Date().toISOString(),
  };

  // ถ้าเป็น backward (หักย้อนหลัง) ให้สร้าง transaction ย้อนหลังเลย
  if (spread === 'backward') {
    for (let i = 0; i < periods; i++) {
      let m = sm - i;
      let y = sy;
      while (m <= 0) { m += 12; y--; }
      const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const backTx = {
        id: Date.now() + i,
        date: dateStr,
        type: 'expense',
        catId: 'install',
        catName: `ผ่อน ${name} (งวด ${periods-i}/${periods})`,
        catIcon: '📦',
        amount: perMonth,
        note: `หักย้อนหลัง`,
        timestamp: new Date().toISOString(),
      };
      transactions.push(backTx);
      sendToSheet({ action:'addTransaction', ...backTx }).catch(()=>{});
    }
    inst.paidCount = periods; // จบแล้ว
    showToast(`📦 หัก "${name}" ย้อนหลัง ${periods} งวดแล้ว`);
  } else {
    // forward: สร้างเป็น recurring แทน
    const recItem = {
      id: 'r_inst_' + Date.now(),
      name: `ผ่อน ${name}`,
      icon: '📦',
      amount: perMonth,
      day,
      freq: 1,
      cat: 'install',
      mode: 'auto',
      effDate: `${sy}-${String(sm).padStart(2,'0')}`,
      endAfter: periods, // จบหลังกี่งวด
      paidCount: 0,
    };
    recurring.push(recItem);
    localStorage.setItem('mm_rec', JSON.stringify(recurring));
    showToast(`📦 ตั้งผ่อน "${name}" ${periods} งวด งวดละ ฿${fmt(perMonth)}`);
  }

  installments.push(inst);
  localStorage.setItem('mm_inst', JSON.stringify(installments));
  localStorage.setItem('mm_tx', JSON.stringify(transactions.slice(0,500)));
  closeModal('modal-installment');
  renderRecurring();
  clearInstallmentForm();
}

function clearInstallmentForm() {
  ['inst-name','inst-total','inst-periods','inst-day'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function processInstallments() {
  // ยังไม่มี logic พิเศษ — recurring จัดการให้แล้ว
}

// ============================================================
//  SET AS RECURRING FROM TRANSACTION
// ============================================================
function toggleRecurringOptions(show) {
  const el = document.getElementById('recurring-options');
  if (el) el.style.display = show ? 'block' : 'none';
}

function openModalSetRecurring(tx) {
  document.getElementById('mr-name').value  = tx.catName + (tx.note ? ' · ' + tx.note : '');
  document.getElementById('mr-amt').value   = tx.amount;
  document.getElementById('mr-icon').value  = tx.catIcon;
  document.getElementById('modal-make-rec').classList.add('open');
}

function confirmMakeRecurring() {
  const name  = document.getElementById('mr-name').value.trim();
  const amt   = parseFloat(document.getElementById('mr-amt').value);
  const day   = parseInt(document.getElementById('mr-day').value);
  const freq  = parseInt(document.getElementById('mr-freq').value);
  const icon  = document.getElementById('mr-icon').value.trim() || '📌';
  const mode  = document.getElementById('mr-mode').value;
  if (!name || !amt) { showToast('กรุณาใส่ชื่อและจำนวนเงิน', true); return; }

  const now = new Date();
  const effDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  recurring.push({ id:'r'+Date.now(), name, icon, amount:amt, day, freq, cat:'other', mode, effDate });
  localStorage.setItem('mm_rec', JSON.stringify(recurring));
  closeModal('modal-make-rec');
  showToast(`${icon} ตั้งเป็นรายการประจำแล้ว`);
  sendToSheet({ action:'addRecurring', name, icon, amount:amt, day, freq, mode, effDate }).catch(()=>{});
}

// ============================================================
//  DASHBOARD
// ============================================================
function renderDashboard() {
  const now = new Date();
  const monthKey = MONTH_NAMES[now.getMonth()];
  document.getElementById('dash-month-label').textContent = MONTH_TH[now.getMonth()] + ' ' + (now.getFullYear()+543);

  const hist = HISTORICAL[monthKey] || null;
  const localThisMonth = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  let income = hist ? hist.income : 0;
  let expense = hist ? hist.expense : 0;
  let dca = hist ? hist.dca : 0;
  localThisMonth.forEach(tx => {
    if (tx.type==='income') income += tx.amount;
    else if (tx.type==='expense') expense += tx.amount;
    else if (tx.type==='invest' && tx.catId==='dca') dca += tx.amount;
  });
  const saving = income - expense;
  const remain = saving - dca;

  document.getElementById('d-income').textContent  = '฿'+fmt(income);
  document.getElementById('d-expense').textContent = '฿'+fmt(expense);
  document.getElementById('d-saving').textContent  = '฿'+fmt(saving);
  document.getElementById('d-dca').textContent     = '฿'+fmt(dca);
  document.getElementById('d-remain').textContent  = '฿'+fmt(remain);

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
    const pct = total > 0 ? val/total : 0;
    const dash = pct * circ;
    const gap  = circ - dash;
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[i%colors.length]}" stroke-width="16" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += dash;
    legendHtml += `<div class="legend-item"><div class="legend-dot" style="background:${colors[i%colors.length]}"></div><span class="legend-name">${name}</span><span class="legend-pct">${total>0?Math.round(val/total*100):0}%</span></div>`;
  });
  svg.innerHTML = circles;
  legend.innerHTML = legendHtml;
}

function renderBars(cats) {
  const colors = ['#378ADD','#E24B4A','#EF9F27','#1D9E75','#7F77DD','#888780'];
  const maxVal = Math.max(...Object.values(cats), 1);
  document.getElementById('bar-chart').innerHTML = Object.entries(cats).map(([name,val],i) => `
    <div class="bar-row">
      <span class="bar-label">${name}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/maxVal*100)}%;background:${colors[i%colors.length]}"></div></div>
      <span class="bar-amount">${fmtShort(val)}</span>
    </div>`).join('');
}

function renderRecentTx() {
  const el = document.getElementById('recent-tx');
  const now = new Date();
  const thisMonth = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  if (thisMonth.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px 0;font-size:14px;">ยังไม่มีรายการเดือนนี้<br>กด + บันทึกรายแรกได้เลย</div>';
    return;
  }
  el.innerHTML = thisMonth.map(tx => {
    const sign = tx.type==='income' ? '+' : tx.type==='invest' ? '' : '-';
    const cls  = tx.type==='income' ? 'pos' : tx.type==='invest' ? 'inv' : 'neg';
    const d    = new Date(tx.date);
    const dateStr = d.toLocaleDateString('th-TH',{day:'numeric',month:'short'});
    return `<div class="tx-item" style="position:relative">
      <div class="tx-icon" style="background:#f5f5f7">${tx.catIcon}</div>
      <div class="tx-info">
        <div class="tx-name">${tx.catName}${tx.note?' · '+tx.note:''}</div>
        <div class="tx-meta">${dateStr}</div>
      </div>
      <div class="tx-amt ${cls}">${sign}฿${fmt(tx.amount)}</div>
      <button onclick="deleteTx(${tx.id})" style="margin-left:8px;background:none;border:none;color:#ababab;font-size:16px;cursor:pointer;padding:4px;flex-shrink:0">✕</button>
    </div>`;
  }).join('');
}

function deleteTx(id) {
  if (!confirm('ลบรายการนี้?')) return;
  transactions = transactions.filter(tx => tx.id !== id);
  localStorage.setItem('mm_tx', JSON.stringify(transactions));
  renderDashboard();
  showToast('ลบรายการแล้ว');
}

// ============================================================
//  RECURRING
// ============================================================
function renderRecurring() {
  const now = new Date();
  const today = now.getDate();

  const todayItems = recurring.filter(r => r.day === today);
  const upcoming   = recurring.filter(r => r.day > today).sort((a,b) => a.day - b.day);

  document.getElementById('rec-status-card').innerHTML = `
    <div style="margin-bottom:10px">
      <div style="font-size:13px;color:var(--text2);margin-bottom:6px">วันนี้ (${today} ${MONTH_TH[now.getMonth()]})</div>
      ${todayItems.length > 0
        ? todayItems.map(r => `<div style="display:flex;align-items:center;gap:8px;padding:5px 0">
            <span>${r.icon}</span>
            <span style="font-size:14px;font-weight:600">${r.name}</span>
            <span style="margin-left:auto;font-size:14px;font-weight:700;color:#1D9E75">✓ ฿${fmt(r.amount)}</span>
          </div>`).join('')
        : '<div style="font-size:13px;color:var(--text3)">ไม่มีรายการวันนี้</div>'
      }
    </div>
    <div style="height:0.5px;background:var(--border);margin:8px 0"></div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:6px">รายการถัดไป</div>
    ${upcoming.slice(0,3).map(r => `
      <div style="display:flex;align-items:center;gap:8px;padding:4px 0">
        <span>${r.icon}</span>
        <span style="font-size:13px;color:var(--text2)">${r.name}</span>
        <span class="badge badge-pending" style="margin-left:auto">วันที่ ${r.day}</span>
        <span style="font-size:13px;font-weight:600">฿${fmt(r.amount)}</span>
      </div>`).join('')}
  `;

  document.getElementById('rec-list').innerHTML = recurring.map(r => {
    const isPaid  = r.day <= today;
    const isToday = r.day === today;
    const badge   = isToday ? `<span class="badge badge-paid">✓ วันนี้</span>`
                  : isPaid  ? `<span class="badge badge-paid">✓ paid</span>`
                  :           `<span class="badge badge-pending">วันที่ ${r.day}</span>`;
    const freqLabel = !r.freq || r.freq === 1 ? 'ทุกเดือน'
                    : r.freq === 3 ? 'ทุก 3 เดือน'
                    : r.freq === 6 ? 'ทุก 6 เดือน'
                    : `ทุก ${r.freq} เดือน`;
    const endLabel = r.endAfter ? ` · ${r.paidCount||0}/${r.endAfter} งวด` : '';
    return `<div class="rec-item" onclick="openEditRecurring('${r.id}')">
      <div class="rec-icon" style="background:#f5f5f7;font-size:20px">${r.icon}</div>
      <div class="rec-info">
        <div class="rec-name">${r.name}</div>
        <div class="rec-sub">${freqLabel} · วันที่ ${r.day}${endLabel}</div>
      </div>
      <div class="rec-right">
        <div class="rec-amt">฿${fmt(r.amount)}</div>
        <div>${badge}</div>
      </div>
    </div>`;
  }).join('');
}

function openEditRecurring(id) {
  const r = recurring.find(x => x.id === id);
  if (!r) return;
  document.getElementById('edit-rec-id').value     = id;
  document.getElementById('edit-rec-name').value   = r.name;
  document.getElementById('edit-rec-amt').value    = r.amount;
  document.getElementById('edit-rec-day').value    = r.day;
  document.getElementById('edit-rec-freq').value   = r.freq || 1;
  document.getElementById('edit-rec-icon').value   = r.icon;
  document.getElementById('edit-rec-mode').value   = r.mode || 'auto';
  openModal('modal-edit-rec');
}

function updateRecurring() {
  const id   = document.getElementById('edit-rec-id').value;
  const name = document.getElementById('edit-rec-name').value.trim();
  const amt  = parseFloat(document.getElementById('edit-rec-amt').value);
  const day  = parseInt(document.getElementById('edit-rec-day').value);
  const freq = parseInt(document.getElementById('edit-rec-freq').value);
  const icon = document.getElementById('edit-rec-icon').value.trim();
  const mode = document.getElementById('edit-rec-mode').value;
  if (!name || !amt) { showToast('กรุณาใส่ชื่อและจำนวนเงิน', true); return; }

  const idx = recurring.findIndex(x => x.id === id);
  if (idx !== -1) {
    const now = new Date();
    const effDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    // เก็บ version เก่าไว้ใน history
    recurring[idx] = { ...recurring[idx], name, amount:amt, day, freq, icon, mode, effDate };
  }
  localStorage.setItem('mm_rec', JSON.stringify(recurring));
  closeModal('modal-edit-rec');
  renderRecurring();
  showToast(`${icon} อัปเดต "${name}" แล้ว`);
  sendToSheet({ action:'updateRecurring', id, name, amount:amt, day, freq, icon, mode }).catch(()=>{});
}

function deleteRecurring() {
  const id = document.getElementById('edit-rec-id').value;
  if (!confirm('ลบรายการนี้ออกจากรายการประจำ?')) return;
  recurring = recurring.filter(r => r.id !== id);
  localStorage.setItem('mm_rec', JSON.stringify(recurring));
  closeModal('modal-edit-rec');
  renderRecurring();
  showToast('ลบรายการแล้ว');
}

function saveRecurring() {
  const name = document.getElementById('rec-name').value.trim();
  const amt  = parseFloat(document.getElementById('rec-amt').value);
  const day  = parseInt(document.getElementById('rec-day').value);
  const freq = parseInt(document.getElementById('rec-freq-new').value || '1');
  const cat  = document.getElementById('rec-cat').value;
  const mode = document.getElementById('rec-mode').value;
  const icon = document.getElementById('rec-icon').value.trim() || '📌';
  if (!name || !amt) { showToast('กรุณาใส่ชื่อและจำนวนเงิน', true); return; }
  const now = new Date();
  const effDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  recurring.push({ id:'r'+Date.now(), name, icon, amount:amt, day, freq, cat, mode, effDate });
  localStorage.setItem('mm_rec', JSON.stringify(recurring));
  closeModal('modal-add-rec');
  renderRecurring();
  showToast(`${icon} เพิ่ม "${name}" แล้ว`);
  ['rec-name','rec-amt','rec-icon'].forEach(id => { document.getElementById(id).value = ''; });
}

function saveSettings() {
  const settings = {
    autoLog:   document.getElementById('tog-auto').checked,
    emailNotif:document.getElementById('tog-email').checked,
    safeMode:  document.getElementById('tog-safe').checked,
  };
  localStorage.setItem('mm_settings', JSON.stringify(settings));
  sendToSheet({ action:'updateSettings', ...settings }).catch(()=>{});
}

// ============================================================
//  INVESTMENTS
// ============================================================
function renderInvestments() {
  // นับ DCA จาก transactions จริง
  const dcaTx = transactions.filter(tx => tx.type==='invest' && tx.catId==='dca');
  const dcaReal = dcaTx.reduce((s,tx) => s+tx.amount, 0);

  const updatedInvestments = investments.map(inv => {
    if (inv.type === 'dca') return { ...inv, amount: (inv.amount || 0) };
    return inv;
  });

  const locked  = updatedInvestments.filter(i=>i.liquidity==='lock').reduce((s,i)=>s+i.amount,0);
  const liquid  = updatedInvestments.filter(i=>i.liquidity==='liquid').reduce((s,i)=>s+i.amount,0);
  const total   = updatedInvestments.reduce((s,i)=>s+i.amount,0);

  document.getElementById('inv-total').textContent  = '฿'+fmt(total);
  document.getElementById('inv-locked').textContent = '฿'+fmt(locked);
  document.getElementById('inv-liquid').textContent = '฿'+fmt(liquid);

  const tagMap = { lock:['🔒 Lock','tag-lock'], liquid:['💧 Liquid','tag-liquid'], dca:['🔄 DCA','tag-dca'], tax:['🔮 ลดหย่อน','tag-tax'] };
  document.getElementById('inv-list').innerHTML = updatedInvestments.map(inv => {
    const [tagLabel,tagClass] = tagMap[inv.liquidity] || ['',''];
    return `<div class="inv-item" onclick="openEditInvestment('${inv.id}')">
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

function openEditInvestment(id) {
  const inv = investments.find(i => i.id === id);
  if (!inv) return;
  document.getElementById('edit-inv-id').value       = id;
  document.getElementById('edit-inv-name').value     = inv.name;
  document.getElementById('edit-inv-amt').value      = inv.amount;
  document.getElementById('edit-inv-maturity').value = inv.maturity;
  document.getElementById('edit-inv-liq').value      = inv.liquidity;
  openModal('modal-edit-inv');
}

function updateInvestment() {
  const id       = document.getElementById('edit-inv-id').value;
  const name     = document.getElementById('edit-inv-name').value.trim();
  const amount   = parseFloat(document.getElementById('edit-inv-amt').value);
  const maturity = document.getElementById('edit-inv-maturity').value.trim();
  const liq      = document.getElementById('edit-inv-liq').value;
  const idx = investments.findIndex(i => i.id === id);
  if (idx !== -1) investments[idx] = { ...investments[idx], name, amount, maturity, liquidity:liq };
  localStorage.setItem('mm_inv', JSON.stringify(investments));
  closeModal('modal-edit-inv');
  renderInvestments();
  showToast(`อัปเดต "${name}" แล้ว`);
}

function deleteInvestment() {
  const id = document.getElementById('edit-inv-id').value;
  const inv = investments.find(i => i.id === id);
  if (!confirm(`ลบ "${inv?.name}" ออก? (เช่น ได้รับเงินคืนแล้ว)`)) return;
  investments = investments.filter(i => i.id !== id);
  localStorage.setItem('mm_inv', JSON.stringify(investments));
  closeModal('modal-edit-inv');
  renderInvestments();
  showToast('ลบรายการลงทุนแล้ว');
}

function saveInvestment() {
  const name     = document.getElementById('inv-name-inp').value.trim();
  const amount   = parseFloat(document.getElementById('inv-amt-inp').value);
  const type     = document.getElementById('inv-type-inp').value;
  const liq      = document.getElementById('inv-liq-inp').value;
  const maturity = document.getElementById('inv-maturity-inp').value.trim() || 'ไม่มีกำหนด';
  const iconMap  = { bond:'🏛️', fund:'📊', gold:'🏅', stock:'📈', dca:'🤖', tax:'🔮', other:'💎' };
  if (!name || !amount) { showToast('กรุณาใส่ชื่อและจำนวนเงิน', true); return; }
  const newInv = { id:'i'+Date.now(), name, icon:iconMap[type]||'💎', amount, type, liquidity:liq, maturity };
  investments.push(newInv);
  localStorage.setItem('mm_inv', JSON.stringify(investments));
  closeModal('modal-add-inv');
  renderInvestments();
  showToast(`${newInv.icon} เพิ่ม "${name}" แล้ว`);
  sendToSheet({ action:'addInvestment', ...newInv }).catch(()=>{});
  ['inv-name-inp','inv-amt-inp','inv-maturity-inp'].forEach(id => { document.getElementById(id).value=''; });
}

// ============================================================
//  PREDICT
// ============================================================
const PREDICT_ITEMS = [
  { id:'dca',    name:'DCA Fin Guru',          icon:'🤖', monthlyAmount:20000, type:'recurring', baseAmount:260000, active:true },
  { id:'gold',   name:'ทอง',                   icon:'🏅', monthlyAmount:0,     type:'liquid',    baseAmount:545570, active:true },
  { id:'pailin', name:'Pailin Investment',     icon:'🏛️', monthlyAmount:0,     type:'lump',      baseAmount:1000000, active:true },
  { id:'phch',   name:'ขายฝาก พช ที่ดิน',     icon:'🏠', monthlyAmount:0,     type:'lump',      baseAmount:240625,  active:true },
  { id:'dr',     name:'DR Yuanta',             icon:'📊', monthlyAmount:0,     type:'liquid',    baseAmount:250000, active:true },
  { id:'built',  name:'หุ้นกู้บิวท์',          icon:'🏗️', monthlyAmount:0,     type:'lump',      baseAmount:400000,  active:true },
  { id:'dime',   name:'Dime',                  icon:'💎', monthlyAmount:0,     type:'lump',      baseAmount:125000, active:true },
  { id:'fund',   name:'กองทุน Fin (ลดหย่อน)', icon:'🔮', monthlyAmount:0,     type:'tax',       baseAmount:2900000, active:true },
];

let predictSettings = JSON.parse(localStorage.getItem('mm_predict')||'null') || { horizon:6, items:PREDICT_ITEMS };

function renderPredict() {
  const now = new Date();
  const currentMonth = now.getMonth()+1;
  const horizon = predictSettings.horizon;
  const totalNow = predictSettings.items.filter(i=>i.active).reduce((s,i)=>s+(i.baseAmount||0),0);
  const months = [];
  let running = totalNow;
  for (let i = 1; i <= horizon; i++) {
    const m = (currentMonth + i - 1) % 12;
    let added = 0;
    predictSettings.items.forEach(item => { if (item.active && item.type==='recurring') added += item.monthlyAmount; });
    running += added;
    months.push({ label: MONTH_TH[m], total: running, added });
  }
  const totalEnd = months.length > 0 ? months[months.length-1].total : totalNow;
  const el = document.getElementById('s-predict');
  if (!el) return;
  el.innerHTML = `
    <div style="background:#1a1a2e;padding:52px 20px 20px;color:white">
      <div style="font-size:22px;font-weight:600">คาดการณ์การลงทุน</div>
      <div style="font-size:13px;opacity:.55;margin-top:2px">Scenario Planning</div>
      <div style="font-size:36px;font-weight:700;margin-top:10px;letter-spacing:-1px"><span style="font-size:18px;font-weight:400;opacity:.6;margin-right:4px">เป้าหมาย</span>฿${fmt(totalEnd)}</div>
    </div>
    <div style="padding:14px 16px 0">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        ${[3,6,12,24].map(h=>`<button onclick="setHorizon(${h},this)" style="padding:5px 12px;border-radius:20px;font-size:12px;font-family:inherit;cursor:pointer;border:1.5px solid ${h===horizon?'#1a1a2e':'rgba(0,0,0,.1)'};background:${h===horizon?'#1a1a2e':'white'};color:${h===horizon?'white':'#6b6b6b'};font-weight:500">${h} เดือน</button>`).join('')}
        <button onclick="setHorizonCustom()" style="padding:5px 12px;border-radius:20px;font-size:12px;font-family:inherit;cursor:pointer;border:1.5px solid rgba(0,0,0,.1);background:white;color:#6b6b6b">กำหนดเอง</button>
      </div>
    </div>
    <div style="padding:0 16px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div style="background:white;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)"><div style="font-size:11px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:5px">ตอนนี้</div><div style="font-size:18px;font-weight:700">฿${fmt(totalNow)}</div></div>
        <div style="background:white;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)"><div style="font-size:11px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:5px">อีก ${horizon} เดือน</div><div style="font-size:18px;font-weight:700;color:#1D9E75">฿${fmt(totalEnd)}</div></div>
        <div style="background:white;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)"><div style="font-size:11px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:5px">เพิ่มขึ้น</div><div style="font-size:18px;font-weight:700;color:#378ADD">+฿${fmt(totalEnd-totalNow)}</div></div>
        <div style="background:white;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06)"><div style="font-size:11px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:5px">DCA/เดือน</div><div style="font-size:18px;font-weight:700;color:#7F77DD">฿${fmt(20000)}</div></div>
      </div>
      <div style="background:white;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:14px">${renderMiniChart(months,totalNow)}</div>
      <div style="font-size:11px;color:#ababab;text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:10px">toggle รายการ</div>
      <div style="background:white;border-radius:12px;padding:4px 16px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:14px">
        ${predictSettings.items.map(item=>`
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:0.5px solid rgba(0,0,0,.06)">
            <span style="font-size:18px">${item.icon}</span>
            <div style="flex:1"><div style="font-size:13px;font-weight:600">${item.name}</div><div style="font-size:11px;color:#ababab">฿${fmt(item.baseAmount||0)}</div></div>
            <label style="position:relative;width:36px;height:20px;flex-shrink:0">
              <input type="checkbox" ${item.active?'checked':''} onchange="togglePredictItem('${item.id}',this.checked)" style="opacity:0;width:0;height:0;position:absolute">
              <div style="position:absolute;inset:0;background:${item.active?'#34C759':'rgba(0,0,0,.15)'};border-radius:20px;transition:.2s"><div style="position:absolute;width:16px;height:16px;background:white;border-radius:50%;top:2px;left:${item.active?'18px':'2px'};transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)"></div></div>
            </label>
          </div>`).join('')}
      </div>
      <div style="font-size:11px;color:#ababab;text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:10px">ลอง Scenario DCA</div>
      <div style="background:white;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:20px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${[25000,30000,40000,50000].map(amt=>{
            const extra=(amt-20000)*horizon;
            return `<button onclick="showScenario(${amt})" style="padding:8px 12px;border-radius:8px;font-size:12px;font-family:inherit;cursor:pointer;border:1.5px solid rgba(0,0,0,.1);background:white;color:#1a1a2e;font-weight:500;line-height:1.4">฿${fmt(amt)}/เดือน<br><span style="color:#1D9E75;font-size:10px">+฿${fmt(extra)}</span></button>`;
          }).join('')}
        </div>
        <div id="scenario-result"></div>
      </div>
    </div>`;
}

function renderMiniChart(months, baseline) {
  if (months.length === 0) return '';
  const maxVal = Math.max(...months.map(m=>m.total));
  const minVal = baseline;
  const range = maxVal - minVal || 1;
  const h = 80; const w = 280;
  const pts = months.map((m,i)=>{
    const x=(i/(months.length-1||1))*w;
    const y=h-((m.total-minVal)/range)*h;
    return `${x},${y}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${w} ${h+30}" style="width:100%;overflow:visible">
    <polyline points="${pts}" fill="none" stroke="#378ADD" stroke-width="2" stroke-linejoin="round"/>
    ${months.map((m,i)=>{
      const x=(i/(months.length-1||1))*w;
      const y=h-((m.total-minVal)/range)*h;
      return `<circle cx="${x}" cy="${y}" r="3" fill="#378ADD"/>
        <text x="${x}" y="${h+18}" text-anchor="middle" font-size="9" fill="#ababab">${m.label}</text>
        ${i===months.length-1?`<text x="${x}" y="${y-8}" text-anchor="middle" font-size="9" fill="#1D9E75" font-weight="600">฿${fmtShort(m.total)}</text>`:''}`;
    }).join('')}
  </svg>`;
}

function getTotalInvested() { return predictSettings.items.filter(i=>i.active).reduce((s,i)=>s+(i.baseAmount||0),0); }
function setHorizon(h) { predictSettings.horizon=h; localStorage.setItem('mm_predict',JSON.stringify(predictSettings)); renderPredict(); }
function setHorizonCustom() {
  const val = prompt('กรอกจำนวนเดือนที่ต้องการ:');
  if (val && !isNaN(val) && parseInt(val)>0) { setHorizon(parseInt(val)); }
}
function togglePredictItem(id, active) {
  const item = predictSettings.items.find(i=>i.id===id);
  if (item) { item.active=active; localStorage.setItem('mm_predict',JSON.stringify(predictSettings)); renderPredict(); }
}
function showScenario(newDCA) {
  const horizon=predictSettings.horizon;
  const extra=(newDCA-20000)*horizon;
  const newTotal=getTotalInvested()+extra;
  document.getElementById('scenario-result').innerHTML=`
    <div style="background:#E1F5EE;border-radius:8px;padding:10px 12px;margin-top:10px">
      <div style="font-size:13px;color:#085041;font-weight:600">DCA ฿${fmt(newDCA)}/เดือน อีก ${horizon} เดือน</div>
      <div style="font-size:12px;color:#0F6E56;margin-top:3px">เพิ่มจากแผนเดิม +฿${fmt(extra)}</div>
      <div style="font-size:15px;color:#085041;font-weight:700;margin-top:4px">รวม ≈ ฿${fmt(newTotal)}</div>
    </div>`;
}

// ============================================================
//  YEARLY
// ============================================================
function renderYearly() {
  let totalSaving = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let totalInvest = 0;

  // month grid (กดได้)
  const monthHtml = MONTH_NAMES.map((m,i) => {
    const h = HISTORICAL[m];
    if (!h) return `<div class="month-card empty"><div class="mn">${MONTH_TH[i]}</div><div class="mv">—</div></div>`;
    totalSaving  += h.saving;
    totalIncome  += h.income;
    totalExpense += h.expense;
    totalInvest  += (h.dca||0);
    return `<div class="month-card" onclick="showMonthDetail('${m}',${i})" style="cursor:pointer">
      <div class="mn">${MONTH_TH[i]}</div>
      <div class="mv ${h.saving>=0?'pos':'neg'}">${fmtShort(h.saving)}</div>
    </div>`;
  }).join('');

  document.getElementById('year-total-saving').textContent = '฿'+fmt(totalSaving);
  document.getElementById('month-grid').innerHTML = monthHtml;

  // yearly summary table
  const colors = ['#378ADD','#E24B4A','#EF9F27','#1D9E75','#7F77DD','#888780'];
  const aggCats = {};
  Object.values(HISTORICAL).forEach(h => Object.entries(h.cats).forEach(([k,v])=>{ aggCats[k]=(aggCats[k]||0)+v; }));
  const maxV = Math.max(...Object.values(aggCats),1);

  document.getElementById('year-cat-breakdown').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div style="background:#f5f5f7;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:3px">รายรับรวม</div>
        <div style="font-size:15px;font-weight:700;color:#1D9E75">฿${fmt(totalIncome)}</div>
      </div>
      <div style="background:#f5f5f7;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:3px">รายจ่ายรวม</div>
        <div style="font-size:15px;font-weight:700;color:#E24B4A">฿${fmt(totalExpense)}</div>
      </div>
      <div style="background:#f5f5f7;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:3px">ออมรวม</div>
        <div style="font-size:15px;font-weight:700;color:#1a1a2e">฿${fmt(totalSaving)}</div>
      </div>
      <div style="background:#f5f5f7;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:3px">DCA รวม</div>
        <div style="font-size:15px;font-weight:700;color:#378ADD">฿${fmt(totalInvest)}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#ababab;font-weight:600;margin-bottom:8px">รายจ่ายแยกหมวด (สะสม)</div>
    ${Object.entries(aggCats).map(([name,val],i)=>`
      <div class="bar-row">
        <span class="bar-label">${name}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/maxV*100)}%;background:${colors[i%colors.length]}"></div></div>
        <span class="bar-amount">${fmtShort(val)}</span>
      </div>`).join('')}
  `;
}

function showMonthDetail(monthKey, monthIdx) {
  const h = HISTORICAL[monthKey];
  if (!h) return;
  const monthName = MONTH_TH[monthIdx] + ' 2569';
  const colors = ['#378ADD','#E24B4A','#EF9F27','#1D9E75','#7F77DD','#888780'];
  const maxV = Math.max(...Object.values(h.cats),1);

  document.getElementById('modal-month-title').textContent = monthName;
  document.getElementById('modal-month-body').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      <div style="background:#E1F5EE;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#085041;font-weight:600;text-transform:uppercase;margin-bottom:3px">รายรับ</div>
        <div style="font-size:16px;font-weight:700;color:#085041">฿${fmt(h.income)}</div>
      </div>
      <div style="background:#FCEBEB;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#A32D2D;font-weight:600;text-transform:uppercase;margin-bottom:3px">รายจ่าย</div>
        <div style="font-size:16px;font-weight:700;color:#A32D2D">฿${fmt(h.expense)}</div>
      </div>
      <div style="background:#f5f5f7;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#ababab;font-weight:600;text-transform:uppercase;margin-bottom:3px">ออม</div>
        <div style="font-size:16px;font-weight:700">฿${fmt(h.saving)}</div>
      </div>
      <div style="background:#E6F1FB;border-radius:8px;padding:10px">
        <div style="font-size:10px;color:#0C447C;font-weight:600;text-transform:uppercase;margin-bottom:3px">DCA</div>
        <div style="font-size:16px;font-weight:700;color:#0C447C">฿${fmt(h.dca||0)}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#ababab;font-weight:600;margin-bottom:10px">แจกแจงรายจ่าย</div>
    ${Object.entries(h.cats).map(([name,val],i)=>`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:8px;height:8px;border-radius:50%;background:${colors[i%colors.length]};flex-shrink:0"></div>
        <span style="font-size:13px;color:#444;flex:1">${name}</span>
        <div style="width:80px;height:6px;background:#f0f0f0;border-radius:3px;overflow:hidden">
          <div style="width:${Math.round(val/maxV*100)}%;height:100%;background:${colors[i%colors.length]};border-radius:3px"></div>
        </div>
        <span style="font-size:13px;font-weight:600;width:64px;text-align:right">฿${fmt(val)}</span>
      </div>`).join('')}
  `;
  openModal('modal-month-detail');
}

// ============================================================
//  MODAL
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target.id===id) closeModal(id); }

// ============================================================
//  GOOGLE SHEET SYNC
// ============================================================
async function sendToSheet(data) {
  if (SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') return;
  try {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([k,v]) => params.append(k, v));
    await fetch(SCRIPT_URL + '?' + params.toString(), { method:'GET', mode:'no-cors' });
    return { ok:true };
  } catch(e) {
    console.error('sendToSheet:', e);
    return { ok:false };
  }
}

// ============================================================
//  UTILS
// ============================================================
function fmt(n) { return Math.round(n).toLocaleString('th-TH'); }
function fmtShort(n) {
  if (n>=1000000) return (n/1000000).toFixed(1)+'M';
  if (n>=1000) return Math.round(n/1000)+'k';
  return Math.round(n).toString();
}
function showToast(msg, isError=false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast'+(isError?' error':'');
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

// ============================================================
//  CLEAR LOCAL DATA
// ============================================================
function clearAllLocalData() {
  if (!confirm('ล้างข้อมูลทดสอบทั้งหมดในแอป?\n(ข้อมูลใน Google Sheet จะไม่หาย)')) return;
  localStorage.removeItem('mm_tx');
  localStorage.removeItem('mm_rec');
  localStorage.removeItem('mm_inv');
  localStorage.removeItem('mm_inst');
  localStorage.removeItem('mm_predict');
  localStorage.removeItem('mm_settings');
  showToast('🗑️ ล้างข้อมูลแล้ว กำลัง reload...');
  setTimeout(() => location.reload(), 1500);
}
