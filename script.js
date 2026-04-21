const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');

const STORAGE_KEYS = {
  users: 'civicsnap_users',
  complaints: 'civicsnap_complaints',
  auth: 'civicsnap_auth'
};

const departments = {
  roads: { label: 'Roads Department', contact: '0487-2200101', category: ['Road Damage / Pothole'] },
  sanitation: { label: 'Sanitation Department', contact: '0487-2200102', category: ['Garbage / Waste Dumping'] },
  electrical: { label: 'Electrical / Streetlight Department', contact: '0487-2200103', category: ['Streetlight Failure'] },
  drainage: { label: 'Water & Drainage Department', contact: '0487-2200104', category: ['Drainage / Sewage Problem', 'Water Leakage'] },
  infrastructure: { label: 'Public Infrastructure Department', contact: '0487-2200105', category: ['Damaged Public Property', 'Public Safety Hazard'] }
};

const adminAccounts = {
  superadmin: { password: 'admin123', role: 'chief', label: 'Chief Admin' },
  roadsadmin: { password: 'roads123', role: 'office', dept: 'roads', label: 'Roads Admin' },
  sanitationadmin: { password: 'clean123', role: 'office', dept: 'sanitation', label: 'Sanitation Admin' },
  lightsadmin: { password: 'lights123', role: 'office', dept: 'electrical', label: 'Electrical Admin' },
  drainageadmin: { password: 'drain123', role: 'office', dept: 'drainage', label: 'Drainage Admin' },
  infraadmin: { password: 'infra123', role: 'office', dept: 'infrastructure', label: 'Infrastructure Admin' }
};

const categories = [
  'Road Damage / Pothole',
  'Streetlight Failure',
  'Garbage / Waste Dumping',
  'Drainage / Sewage Problem',
  'Water Leakage',
  'Damaged Public Property',
  'Public Safety Hazard'
];

function seedData() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    const users = [
      {
        id: 'U001',
        name: 'Anjali Nair',
        mobile: '9876543210',
        aadhaar: '123412341234',
        area: 'Thrissur Town',
        rewardPoints: 35,
        privacyDefault: 'anonymous'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }

  if (!localStorage.getItem(STORAGE_KEYS.complaints)) {
    const complaints = [
      createComplaintObject({
        title: 'Large pothole near KSRTC bus stand',
        category: 'Road Damage / Pothole',
        description: 'A deep pothole is causing trouble for bikes and autos.',
        area: 'Thrissur Town',
        landmark: 'KSRTC Bus Stand',
        visibility: 'public',
        dept: 'roads',
        status: 'In Progress',
        reporterMobile: '9876543210',
        reporterName: 'Anjali Nair',
        targetDate: addDays(5),
        history: presetHistory(['Submitted', 'Verified', 'Assigned', 'In Progress'])
      }, 1),
      createComplaintObject({
        title: 'Broken streetlight in Temple Road',
        category: 'Streetlight Failure',
        description: 'Streetlight has been non-functional for two nights.',
        area: 'Temple Road',
        landmark: 'Ward 3 Junction',
        visibility: 'anonymous',
        dept: 'electrical',
        status: 'Submitted',
        reporterMobile: '9991112223',
        reporterName: 'Anonymous',
        targetDate: addDays(3),
        history: presetHistory(['Submitted'])
      }, 2),
      createComplaintObject({
        title: 'Garbage pile near municipal market',
        category: 'Garbage / Waste Dumping',
        description: 'Waste collection missed for several days.',
        area: 'Market Junction',
        landmark: 'Municipal Market',
        visibility: 'public',
        dept: 'sanitation',
        status: 'Resolved',
        reporterMobile: '9988776655',
        reporterName: 'Riya Joseph',
        targetDate: addDays(-1),
        history: presetHistory(['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'])
      }, 3),
      createComplaintObject({
        title: 'Drainage overflow near school road',
        category: 'Drainage / Sewage Problem',
        description: 'Overflow after rain causing foul smell and waterlogging.',
        area: 'School Road',
        landmark: 'Govt School Gate',
        visibility: 'public',
        dept: 'drainage',
        status: 'Delayed',
        reporterMobile: '9876501234',
        reporterName: 'Devika Menon',
        targetDate: addDays(-2),
        history: presetHistory(['Submitted', 'Verified', 'Assigned', 'Delayed'])
      }, 4),
      createComplaintObject({
        title: 'Damaged bench at East Junction bus stop',
        category: 'Damaged Public Property',
        description: 'Bench is broken and unsafe for elderly people.',
        area: 'East Junction',
        landmark: 'Bus Stop',
        visibility: 'public',
        dept: 'infrastructure',
        status: 'Verified',
        reporterMobile: '9847001122',
        reporterName: 'Arjun Das',
        targetDate: addDays(4),
        history: presetHistory(['Submitted', 'Verified'])
      }, 5)
    ];
    localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
  }
}

function createComplaintObject(data, n = null) {
  return {
    id: `CS${String(n || Date.now()).slice(-3).padStart(3, '0')}`,
    createdAt: new Date().toLocaleString(),
    imageData: data.imageData || '',
    ...data
  };
}

function presetHistory(statuses) {
  return statuses.map((s, i) => ({ status: s, time: new Date(Date.now() - (statuses.length - i) * 3600000).toLocaleString(), note: `${s} by system/admin.` }));
}

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]'); }
function setUsers(v) { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(v)); }
function getComplaints() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.complaints) || '[]'); }
function setComplaints(v) { localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(v)); }
function setAuth(v) { localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(v)); }
function getAuth() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.auth) || 'null'); }
function logout() { localStorage.removeItem(STORAGE_KEYS.auth); render(); }

function badgeClass(status) {
  const k = status.toLowerCase().replace(/\s+/g, '');
  if (k === 'inprogress') return 'inprogress';
  return k;
}

function routeDept(category) {
  return Object.keys(departments).find(key => departments[key].category.includes(category)) || 'roads';
}

function maskAadhaar(v) { return `XXXX-XXXX-${String(v).slice(-4)}`; }
function maskMobile(v) { return `${String(v).slice(0,2)}XXXXXX${String(v).slice(-2)}`; }

function render() {
  seedData();
  const auth = getAuth();
  if (!auth) return renderLanding();
  if (auth.type === 'citizen') return renderCitizenApp(auth.mobile);
  return renderAdminApp(auth.username);
}

function renderLanding() {
  app.innerHTML = `
    <div class="auth-shell">
      <div class="auth-card">
        <div class="hero">
          <h1>CivicSnap</h1>
          <p>Report local issues, track actions, and make communities better with a transparent civic grievance platform.</p>
          <div class="stats">
            <div class="stat"><strong>5</strong><br><span class="small">Sample issues</span></div>
            <div class="stat"><strong>5</strong><br><span class="small">Departments</span></div>
            <div class="stat"><strong>3-level</strong><br><span class="small">Admin structure</span></div>
          </div>
          <p class="footer-note">Prototype note: Aadhaar and OTP are simulated for academic demonstration.</p>
        </div>
        <div class="forms">
          <div class="tabs">
            <button class="active" data-tab="citizen-login">Citizen Login</button>
            <button class="secondary" data-tab="citizen-signup">Citizen Sign Up</button>
            <button class="secondary" data-tab="admin-login">Admin Login</button>
          </div>
          <div id="tab-content"></div>
          <div class="footer-note">
            Demo user mobile: <strong>9876543210</strong><br>
            Chief admin: <strong>superadmin / admin123</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  const tabContent = $('#tab-content');
  let active = 'citizen-login';
  const setTab = (tab) => {
    active = tab;
    document.querySelectorAll('.tabs button').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
      b.classList.toggle('secondary', b.dataset.tab !== tab);
    });
    tabContent.innerHTML = tab === 'citizen-login' ? citizenLoginTemplate() : tab === 'citizen-signup' ? citizenSignupTemplate() : adminLoginTemplate();
    bindLandingForms();
  };
  document.querySelectorAll('.tabs button').forEach(btn => btn.onclick = () => setTab(btn.dataset.tab));
  setTab(active);
}

function citizenLoginTemplate() {
  return `
    <h3>Citizen Login</h3>
    <div class="form-grid">
      <div class="full"><input id="loginMobile" maxlength="10" placeholder="Enter registered mobile number" /></div>
      <div><button id="sendLoginOtp">Send OTP</button></div>
      <div><input id="loginOtp" placeholder="Enter OTP shown on screen" /></div>
      <div class="full"><button id="verifyLoginOtp" class="success">Verify & Login</button></div>
    </div>
    <div id="loginMsg" class="notice hidden"></div>
  `;
}

function citizenSignupTemplate() {
  return `
    <h3>Citizen Sign Up</h3>
    <div class="form-grid">
      <div><input id="signupName" placeholder="Full name" /></div>
      <div><input id="signupArea" placeholder="Area / Ward" /></div>
      <div><input id="signupMobile" maxlength="10" placeholder="Mobile number" /></div>
      <div><input id="signupAadhaar" maxlength="12" placeholder="Simulated Aadhaar number" /></div>
      <div><button id="sendSignupOtp">Send OTP</button></div>
      <div><input id="signupOtp" placeholder="Enter OTP shown on screen" /></div>
      <div class="full"><button id="completeSignup" class="success">Create Account</button></div>
    </div>
    <div id="signupMsg" class="notice hidden"></div>
  `;
}

function adminLoginTemplate() {
  return `
    <h3>Admin Login</h3>
    <div class="form-grid">
      <div><input id="adminUser" placeholder="Username" /></div>
      <div><input id="adminPass" type="password" placeholder="Password" /></div>
      <div class="full"><button id="adminLoginBtn" class="success">Login</button></div>
    </div>
    <div id="adminMsg" class="notice hidden"></div>
    <div class="footer-note small">
      Office admin samples: roadsadmin / roads123, sanitationadmin / clean123, lightsadmin / lights123, drainageadmin / drain123, infraadmin / infra123
    </div>
  `;
}

function bindLandingForms() {
  const show = (id, text, type='') => {
    const el = $(id); if (!el) return;
    el.textContent = text; el.className = `notice ${type}`;
  };

  if ($('#sendLoginOtp')) {
    $('#sendLoginOtp').onclick = () => {
      const mobile = $('#loginMobile').value.trim();
      const user = getUsers().find(u => u.mobile === mobile);
      if (!user) return show('#loginMsg', 'No account found with this mobile number. Please sign up first.', 'error');
      sessionStorage.setItem('loginOtp', '123456');
      show('#loginMsg', `Welcome back. OTP generated for demo: 123456`, 'success');
    };
    $('#verifyLoginOtp').onclick = () => {
      const mobile = $('#loginMobile').value.trim();
      const otp = $('#loginOtp').value.trim();
      const user = getUsers().find(u => u.mobile === mobile);
      if (!user) return show('#loginMsg', 'No account found with this mobile number. Please sign up first.', 'error');
      if (otp !== sessionStorage.getItem('loginOtp')) return show('#loginMsg', 'Invalid OTP. Use the demo OTP shown above.', 'error');
      setAuth({ type: 'citizen', mobile });
      render();
    };
  }

  if ($('#sendSignupOtp')) {
    $('#sendSignupOtp').onclick = () => {
      const mobile = $('#signupMobile').value.trim();
      if (mobile.length !== 10) return show('#signupMsg', 'Enter a valid 10-digit mobile number.', 'error');
      if (getUsers().some(u => u.mobile === mobile)) return show('#signupMsg', 'This mobile number is already registered. Please use login.', 'error');
      sessionStorage.setItem('signupOtp', '654321');
      show('#signupMsg', 'Demo OTP generated: 654321', 'success');
    };
    $('#completeSignup').onclick = () => {
      const name = $('#signupName').value.trim();
      const area = $('#signupArea').value.trim();
      const mobile = $('#signupMobile').value.trim();
      const aadhaar = $('#signupAadhaar').value.trim();
      const otp = $('#signupOtp').value.trim();
      if (!name || !area || mobile.length !== 10 || aadhaar.length !== 12) return show('#signupMsg', 'Fill all fields correctly before creating the account.', 'error');
      if (otp !== sessionStorage.getItem('signupOtp')) return show('#signupMsg', 'Invalid OTP. Use the demo OTP shown above.', 'error');
      const users = getUsers();
      users.push({ id: `U${String(users.length+1).padStart(3,'0')}`, name, area, mobile, aadhaar, rewardPoints: 0, privacyDefault: 'anonymous' });
      setUsers(users);
      setAuth({ type: 'citizen', mobile });
      render();
    };
  }

  if ($('#adminLoginBtn')) {
    $('#adminLoginBtn').onclick = () => {
      const username = $('#adminUser').value.trim();
      const password = $('#adminPass').value.trim();
      const acc = adminAccounts[username];
      if (!acc || acc.password !== password) return show('#adminMsg', 'Invalid admin credentials.', 'error');
      setAuth({ type: 'admin', username });
      render();
    };
  }
}

function renderCitizenApp(mobile) {
  const user = getUsers().find(u => u.mobile === mobile);
  const complaints = getComplaints();
  const myComplaints = complaints.filter(c => c.reporterMobile === mobile);
  const state = { page: 'home' };

  app.innerHTML = shellTemplate('Citizen Portal', user.name, `
    <button class="secondary" id="helpTop">Help</button>
    <button class="secondary" id="profileTop">Profile</button>
    <button class="danger" id="logoutBtn">Logout</button>
  `, citizenMenu());

  $('#logoutBtn').onclick = logout;

  const main = $('#page-root');
  const setPage = (p) => {
    state.page = p;
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.toggle('active', btn.dataset.page === p));
    if (p === 'home') main.innerHTML = citizenHome(user, myComplaints, complaints);
    if (p === 'report') main.innerHTML = citizenReport(user);
    if (p === 'my') main.innerHTML = citizenMyComplaints(myComplaints);
    if (p === 'search') main.innerHTML = citizenSearch(complaints, user.area);
    if (p === 'rewards') main.innerHTML = citizenRewards(user, myComplaints);
    if (p === 'departments') main.innerHTML = departmentsPage();
    if (p === 'privacy') main.innerHTML = privacyPage();
    if (p === 'help') main.innerHTML = helpPage();
    if (p === 'profile') main.innerHTML = profilePage(user, myComplaints);
    bindCitizenPage(user);
  };

  document.querySelectorAll('.menu button').forEach(btn => btn.onclick = () => setPage(btn.dataset.page));
  $('#helpTop').onclick = () => setPage('help');
  $('#profileTop').onclick = () => setPage('profile');
  setPage('home');
}

function shellTemplate(title, subtitle, actions, menu) {
  return `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">CivicSnap</div>
        <div class="small" style="margin-bottom:16px; opacity:.9;">${title}<br>${subtitle}</div>
        <div class="menu">${menu}</div>
      </aside>
      <main class="main">
        <div class="topbar">
          <div>
            <h2 style="margin:0;">${title}</h2>
            <div class="small">Transparent civic issue reporting and tracking</div>
          </div>
          <div class="top-actions">${actions}</div>
        </div>
        <div id="page-root"></div>
      </main>
    </div>
  `;
}

function citizenMenu() {
  return `
    <button data-page="home">🏠 Home</button>
    <button data-page="report">📝 Report Complaint</button>
    <button data-page="my">📌 My Complaints</button>
    <button data-page="search">🔎 Search Public Issues</button>
    <button data-page="rewards">🏅 Reward Points</button>
    <button data-page="departments">📞 Departments & Contacts</button>
    <button data-page="privacy">🔐 Privacy & Security</button>
    <button data-page="help">❓ Help & Support</button>
    <button data-page="profile">👤 Profile</button>
  `;
}

function citizenHome(user, myComplaints, allComplaints) {
  const nearby = allComplaints.filter(c => c.area.toLowerCase().includes((user.area || '').toLowerCase()) && c.visibility !== 'private').slice(0, 3);
  const resolved = myComplaints.filter(c => c.status === 'Resolved').length;
  const progress = myComplaints.filter(c => ['Assigned','In Progress','Verified','Submitted','Delayed'].includes(c.status)).length;
  return `
    <div class="grid cols-4">
      <div class="panel metric"><div class="small">My Complaints</div><div class="value">${myComplaints.length}</div></div>
      <div class="panel metric"><div class="small">In Progress</div><div class="value">${progress}</div></div>
      <div class="panel metric"><div class="small">Resolved</div><div class="value">${resolved}</div></div>
      <div class="panel metric"><div class="small">Reward Points</div><div class="value">${user.rewardPoints || 0}</div></div>
    </div>
    <div class="grid cols-2" style="margin-top:16px;">
      <div class="panel">
        <div class="section-title"><h3 style="margin:0;">Quick Actions</h3></div>
        <button id="quickReport">Report a new issue</button>
        <div class="footer-note">Your stored details are auto-fetched after OTP login for faster complaint filing.</div>
      </div>
      <div class="panel">
        <div class="section-title"><h3 style="margin:0;">Recent Nearby Issues</h3></div>
        <div class="list">
          ${nearby.length ? nearby.map(cardTemplate).join('') : '<div class="empty">No nearby public complaints to show.</div>'}
        </div>
      </div>
    </div>
  `;
}

function citizenReport(user) {
  return `
    <div class="panel">
      <div class="section-title"><h3 style="margin:0;">Register Complaint</h3></div>
      <div class="form-grid">
        <div><input id="rName" value="${user.name}" disabled /></div>
        <div><input id="rMobile" value="${maskMobile(user.mobile)}" disabled /></div>
        <div><input id="rArea" value="${user.area || ''}" placeholder="Area / Ward" /></div>
        <div><input id="rLandmark" placeholder="Landmark" /></div>
        <div class="full"><input id="rTitle" placeholder="Issue title" /></div>
        <div><select id="rCategory"><option value="">Select category</option>${categories.map(c => `<option>${c}</option>`).join('')}</select></div>
        <div><select id="rVisibility"><option value="public">Public</option><option value="anonymous">Anonymous to public</option><option value="private">Private to admin</option></select></div>
        <div class="full"><textarea id="rDesc" placeholder="Describe the issue clearly"></textarea></div>
        <div><input id="rTarget" type="date" /></div>
        <div><input id="rImage" type="file" accept="image/*" /></div>
        <div class="full"><div id="deptPreview" class="notice">Department will be auto-assigned based on category.</div></div>
        <div class="full"><button id="submitComplaint" class="success">Submit Complaint</button></div>
      </div>
      <div id="reportMsg" class="notice hidden"></div>
    </div>
  `;
}

function citizenMyComplaints(myComplaints) {
  return `
    <div class="panel">
      <div class="section-title"><h3 style="margin:0;">My Complaints</h3></div>
      <div class="list">${myComplaints.length ? myComplaints.map(detailCardTemplate).join('') : '<div class="empty">No complaints submitted yet.</div>'}</div>
    </div>
  `;
}

function citizenSearch(complaints, area) {
  const publicIssues = complaints.filter(c => c.visibility !== 'private');
  return `
    <div class="panel">
      <div class="section-title"><h3 style="margin:0;">Search Public Issues</h3></div>
      <div class="filters">
        <input id="sKeyword" placeholder="Search by keyword" />
        <select id="sCategory"><option value="">All categories</option>${categories.map(c => `<option>${c}</option>`).join('')}</select>
        <select id="sArea"><option value="">All areas</option><option selected>${area}</option>${[...new Set(publicIssues.map(c => c.area))].filter(a => a !== area).map(a => `<option>${a}</option>`).join('')}</select>
        <button id="searchBtn">Search</button>
      </div>
      <div id="searchResults" style="margin-top:14px;"></div>
    </div>
  `;
}

function citizenRewards(user, myComplaints) {
  const badges = [];
  if (myComplaints.length >= 1) badges.push('First Reporter');
  if (myComplaints.length >= 3) badges.push('Active Citizen');
  if ((user.rewardPoints || 0) >= 30) badges.push('Community Watch');
  return `
    <div class="grid cols-2">
      <div class="panel"><h3>Reward Summary</h3><div class="value" style="font-size:2rem;font-weight:700;">${user.rewardPoints || 0} pts</div><div class="small">Points are awarded for verified and resolved complaints.</div></div>
      <div class="panel"><h3>Badges</h3>${badges.length ? badges.map(b => `<span class="badge verified" style="margin-right:8px;">${b}</span>`).join('') : '<div class="empty">No badges earned yet.</div>'}</div>
    </div>
  `;
}

function departmentsPage() {
  return `
    <div class="panel">
      <h3>Departments & Contacts</h3>
      <div class="list">${Object.values(departments).map(d => `<div class="item"><h4>${d.label}</h4><div class="meta"><span>Contact: ${d.contact}</span></div></div>`).join('')}</div>
    </div>
  `;
}

function privacyPage() {
  return `<div class="panel"><h3>Privacy & Security</h3><div class="list"><div class="item">Simulated Aadhaar is masked in the interface.</div><div class="item">Public complaints can show your name only when you choose public visibility.</div><div class="item">Private complaints are visible only to authorized admins and the complainant.</div></div></div>`;
}
function helpPage() {
  return `<div class="panel"><h3>Help & Support</h3><div class="list"><div class="item"><h4>How to report</h4><div class="small">Login, open Report Complaint, fill category, description, location and submit.</div></div><div class="item"><h4>Why a complaint may be rejected</h4><div class="small">Insufficient details, duplicate submission, or invalid category.</div></div><div class="item"><h4>Customer care</h4><div class="small">Phone: 1800-123-456 • Email: support@civicsnap.demo</div></div></div></div>`;
}
function profilePage(user, myComplaints) {
  return `<div class="panel"><h3>Profile</h3><div class="kv"><div>Name</div><div>${user.name}</div><div>Mobile</div><div>${maskMobile(user.mobile)}</div><div>Demo ID</div><div>${maskAadhaar(user.aadhaar)}</div><div>Area</div><div>${user.area}</div><div>Total Complaints</div><div>${myComplaints.length}</div></div></div>`;
}

function bindCitizenPage(user) {
  if ($('#quickReport')) $('#quickReport').onclick = () => document.querySelector('[data-page="report"]').click();

  if ($('#rCategory')) {
    $('#rCategory').onchange = () => {
      const dept = routeDept($('#rCategory').value);
      $('#deptPreview').textContent = `Auto-assigned office: ${departments[dept].label}`;
    };
    $('#rTarget').value = addDays(5);
    $('#submitComplaint').onclick = () => {
      const title = $('#rTitle').value.trim();
      const category = $('#rCategory').value;
      const description = $('#rDesc').value.trim();
      const area = $('#rArea').value.trim();
      const landmark = $('#rLandmark').value.trim();
      const visibility = $('#rVisibility').value;
      const targetDate = $('#rTarget').value;
      if (!title || !category || !description || !area) return msg('#reportMsg', 'Please fill all required complaint details.', 'error');
      const file = $('#rImage').files[0];
      const saveComplaint = (imageData = '') => {
        const complaints = getComplaints();
        const dept = routeDept(category);
        const userList = getUsers();
        const index = userList.findIndex(u => u.mobile === user.mobile);
        userList[index].rewardPoints = (userList[index].rewardPoints || 0) + 5;
        setUsers(userList);
        complaints.unshift(createComplaintObject({
          title, category, description, area, landmark, visibility, targetDate,
          dept, status: 'Submitted', reporterMobile: user.mobile,
          reporterName: visibility === 'anonymous' ? 'Anonymous' : user.name,
          imageData, history: [{ status: 'Submitted', time: new Date().toLocaleString(), note: 'Complaint submitted by citizen.' }]
        }, complaints.length + 1));
        setComplaints(complaints);
        msg('#reportMsg', 'Complaint submitted successfully. It is now available for tracking.', 'success');
        setTimeout(() => renderCitizenApp(user.mobile), 700);
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = e => saveComplaint(e.target.result);
        reader.readAsDataURL(file);
      } else saveComplaint('');
    };
  }

  if ($('#searchBtn')) {
    const runSearch = () => {
      const key = $('#sKeyword').value.trim().toLowerCase();
      const cat = $('#sCategory').value;
      const area = $('#sArea').value;
      let results = getComplaints().filter(c => c.visibility !== 'private');
      results = results.filter(c => (!key || [c.title, c.description, c.area, c.landmark].join(' ').toLowerCase().includes(key)) && (!cat || c.category === cat) && (!area || c.area === area));
      $('#searchResults').innerHTML = results.length ? `<div class="list">${results.map(cardTemplate).join('')}</div>` : `<div class="empty"><h3>No issues found</h3><div>Try another keyword, category, or location, or report this issue as a new complaint.</div></div>`;
    };
    $('#searchBtn').onclick = runSearch;
    runSearch();
  }
}

function renderAdminApp(username) {
  const admin = adminAccounts[username];
  const title = admin.role === 'chief' ? 'Chief Admin Portal' : `${departments[admin.dept].label}`;
  const subtitle = admin.label;
  app.innerHTML = shellTemplate(title, subtitle, `<button class="danger" id="logoutBtn">Logout</button>`, admin.role === 'chief' ? chiefMenu() : officeMenu());
  $('#logoutBtn').onclick = logout;
  const main = $('#page-root');
  const setPage = (p) => {
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.toggle('active', btn.dataset.page === p));
    if (admin.role === 'chief') {
      if (p === 'dashboard') main.innerHTML = chiefDashboard();
      if (p === 'complaints') main.innerHTML = chiefComplaints();
      if (p === 'departments') main.innerHTML = chiefDepartments();
      if (p === 'users') main.innerHTML = chiefUsers();
      if (p === 'escalations') main.innerHTML = chiefEscalations();
    } else {
      if (p === 'dashboard') main.innerHTML = officeDashboard(admin.dept);
      if (p === 'complaints') main.innerHTML = officeComplaints(admin.dept);
    }
    bindAdminPage(admin);
  };
  document.querySelectorAll('.menu button').forEach(btn => btn.onclick = () => setPage(btn.dataset.page));
  setPage('dashboard');
}

function chiefMenu() {
  return `<button data-page="dashboard">📊 Dashboard</button><button data-page="complaints">📁 All Complaints</button><button data-page="departments">🏢 Department Admins</button><button data-page="users">👥 Users</button><button data-page="escalations">⚠️ Escalations</button>`;
}
function officeMenu() {
  return `<button data-page="dashboard">📊 Dashboard</button><button data-page="complaints">📁 Department Complaints</button>`;
}

function chiefDashboard() {
  const complaints = getComplaints();
  const users = getUsers();
  const overdue = complaints.filter(c => ['Delayed','Escalated'].includes(c.status)).length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  return `<div class="grid cols-4"><div class="panel metric"><div class="small">Total Users</div><div class="value">${users.length}</div></div><div class="panel metric"><div class="small">Total Complaints</div><div class="value">${complaints.length}</div></div><div class="panel metric"><div class="small">Resolved</div><div class="value">${resolved}</div></div><div class="panel metric"><div class="small">Overdue / Escalated</div><div class="value">${overdue}</div></div></div><div class="panel" style="margin-top:16px;"><h3>Recent Complaints</h3><div class="list">${complaints.slice(0,5).map(adminComplaintCard).join('')}</div></div>`;
}
function chiefComplaints() { return complaintManagementView(getComplaints(), true); }
function chiefDepartments() { return `<div class="panel"><h3>Department Admin Accounts</h3><div class="list">${Object.entries(adminAccounts).filter(([,a])=>a.role==='office').map(([u,a])=>`<div class="item"><h4>${a.label}</h4><div class="meta"><span>Username: ${u}</span><span>Department: ${departments[a.dept].label}</span></div></div>`).join('')}</div></div>`; }
function chiefUsers() { return `<div class="panel"><h3>Registered Users</h3><div class="list">${getUsers().map(u=>`<div class="item"><h4>${u.name}</h4><div class="meta"><span>${maskMobile(u.mobile)}</span><span>${u.area}</span><span>${u.rewardPoints||0} pts</span></div></div>`).join('')}</div></div>`; }
function chiefEscalations() { return `<div class="panel"><h3>Escalation Monitoring</h3><div class="list">${getComplaints().filter(c=>['Delayed','Escalated'].includes(c.status)).map(adminComplaintCard).join('') || '<div class="empty">No escalated complaints.</div>'}</div></div>`; }
function officeDashboard(dept) {
  const items = getComplaints().filter(c => c.dept === dept);
  return `<div class="grid cols-4"><div class="panel metric"><div class="small">Assigned</div><div class="value">${items.length}</div></div><div class="panel metric"><div class="small">New</div><div class="value">${items.filter(c=>c.status==='Submitted').length}</div></div><div class="panel metric"><div class="small">In Progress</div><div class="value">${items.filter(c=>c.status==='In Progress').length}</div></div><div class="panel metric"><div class="small">Overdue</div><div class="value">${items.filter(c=>c.status==='Delayed').length}</div></div></div><div class="panel" style="margin-top:16px;"><h3>Department Queue</h3><div class="list">${items.map(adminComplaintCard).join('')}</div></div>`;
}
function officeComplaints(dept) { return complaintManagementView(getComplaints().filter(c => c.dept === dept), false); }

function complaintManagementView(items, chief) {
  return `
    <div class="panel">
      <h3>${chief ? 'Manage All Complaints' : 'Manage Department Complaints'}</h3>
      <div class="list">
        ${items.length ? items.map(c => `
          <div class="item">
            ${adminComplaintCard(c)}
            <div class="form-grid" style="margin-top:10px;">
              <div><select data-id="${c.id}" class="statusSelect">${['Submitted','Verified','Assigned','In Progress','Resolved','Delayed','Escalated','Rejected'].map(s=>`<option ${c.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
              <div><input data-id="${c.id}" class="noteInput" placeholder="Add note / remark" /></div>
              ${chief ? `<div><select data-id="${c.id}" class="deptSelect">${Object.entries(departments).map(([k,d])=>`<option value="${k}" ${c.dept===k?'selected':''}>${d.label}</option>`).join('')}</select></div>` : '<div></div>'}
              <div><button data-id="${c.id}" class="saveComplaint success">Save Update</button></div>
            </div>
          </div>`).join('') : '<div class="empty">No complaints available.</div>'}
      </div>
    </div>
  `;
}

function bindAdminPage(admin) {
  document.querySelectorAll('.saveComplaint').forEach(btn => btn.onclick = () => {
    const id = btn.dataset.id;
    const complaints = getComplaints();
    const idx = complaints.findIndex(c => c.id === id);
    const status = document.querySelector(`.statusSelect[data-id="${id}"]`).value;
    const note = document.querySelector(`.noteInput[data-id="${id}"]`).value.trim() || 'Status updated by admin.';
    complaints[idx].status = status;
    if (admin.role === 'chief') complaints[idx].dept = document.querySelector(`.deptSelect[data-id="${id}"]`).value;
    complaints[idx].history.push({ status, time: new Date().toLocaleString(), note });
    setComplaints(complaints);
    renderAdminApp(getAuth().username);
  });
}

function cardTemplate(c) {
  const publicName = c.visibility === 'anonymous' ? 'Anonymous User' : c.reporterName;
  return `
    <div class="item">
      <h4>${c.title}</h4>
      <div class="meta"><span>${c.id}</span><span>${c.area}</span><span>${departments[c.dept].label}</span><span class="badge ${badgeClass(c.status)}">${c.status}</span></div>
      <p>${c.description}</p>
      <div class="small">Reporter: ${publicName}</div>
      ${c.imageData ? `<img class="image-preview" src="${c.imageData}" alt="Issue image" />` : ''}
    </div>
  `;
}

function detailCardTemplate(c) {
  return `
    <div class="item">
      <h4>${c.title}</h4>
      <div class="meta"><span>${c.id}</span><span>${c.createdAt}</span><span>${departments[c.dept].label}</span><span class="badge ${badgeClass(c.status)}">${c.status}</span></div>
      <div class="kv" style="margin:10px 0 14px;">
        <div>Category</div><div>${c.category}</div>
        <div>Area</div><div>${c.area}</div>
        <div>Target Date</div><div>${c.targetDate || '-'}</div>
        <div>Visibility</div><div>${c.visibility}</div>
      </div>
      <div class="timeline">${c.history.map(h => `<div class="timeline-item"><strong>${h.status}</strong><div class="small">${h.time}</div><div>${h.note}</div></div>`).join('')}</div>
    </div>
  `;
}

function adminComplaintCard(c) {
  return `
    <div>
      <h4 style="margin:0 0 8px;">${c.title}</h4>
      <div class="meta"><span>${c.id}</span><span>${c.area}</span><span>${departments[c.dept].label}</span><span>Target: ${c.targetDate || '-'}</span><span class="badge ${badgeClass(c.status)}">${c.status}</span></div>
      <div class="small" style="margin-top:6px;">Reporter: ${c.visibility === 'public' ? c.reporterName : 'Protected to public'} | Landmark: ${c.landmark || '-'}</div>
    </div>
  `;
}

function msg(selector, text, type='') {
  const el = $(selector); if (!el) return;
  el.textContent = text; el.className = `notice ${type}`;
}

render();
