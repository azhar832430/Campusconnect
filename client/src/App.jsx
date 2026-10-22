import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
import Modal from './components/Modal';
import RecordForm from './components/RecordForm';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BookOpen, Check, ChevronDown, CircleHelp,
  Clock3, GraduationCap, LayoutDashboard, Menu, MoreHorizontal, Pencil, Plus, Search,
  Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, Users, X, BookMarked,
  CalendarDays, RefreshCw, AlertCircle, CheckCircle2, Database, Server, ExternalLink
} from 'lucide-react';

const sections = {
  dashboard: { title: 'Dashboard', singular: '', plural: '' },
  students: { title: 'Students', singular: 'student', plural: 'students' },
  courses: { title: 'Courses', singular: 'course', plural: 'courses' },
  enrollments: { title: 'Enrollments', singular: 'enrollment', plural: 'enrollments' }
};
const initials = name => (name || '?').trim().split(/\s+/).slice(0,2).map(v=>v[0]).join('').toUpperCase();
const formatDate = value => value ? new Date(value).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'}) : '—';

function Toast({ toast, onClose }) {
  useEffect(() => { if (!toast) return; const timer = setTimeout(onClose, 4200); return () => clearTimeout(timer); }, [toast, onClose]);
  if (!toast) return null;
  return <div className={`toast toast-${toast.type}`} role="status">{toast.type === 'success' ? <CheckCircle2 size={19}/> : <AlertCircle size={19}/>}<span>{toast.message}</span><button onClick={onClose} aria-label="Dismiss message"><X size={16}/></button></div>;
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const nav = [{id:'dashboard',label:'Overview',icon:LayoutDashboard},{id:'students',label:'Students',icon:Users},{id:'courses',label:'Courses',icon:BookOpen},{id:'enrollments',label:'Enrollments',icon:BookMarked}];
  return <><div className={`sidebar-scrim ${mobileOpen?'show':''}`} onClick={()=>setMobileOpen(false)}/><aside className={`sidebar ${mobileOpen?'sidebar-open':''}`}>
    <div className="brand"><div className="brand-mark"><GraduationCap size={24}/></div><div><strong>Campus<span>Connect</span></strong><small>UNIVERSITY PORTAL</small></div><button className="icon-btn sidebar-close" onClick={()=>setMobileOpen(false)} aria-label="Close menu"><X size={19}/></button></div>
    <div className="workspace"><div className="workspace-icon">MU</div><div className="workspace-copy"><b>MUET Campus</b><span>Administration</span></div><ChevronDown size={15} className="muted-icon"/></div>
    <div className="nav-caption">WORKSPACE</div><nav className="side-nav">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${active===item.id?'nav-active':''}`} onClick={()=>{setActive(item.id);setMobileOpen(false)}}><Icon size={19}/><span>{item.label}</span>{active===item.id&&<span className="nav-active-dot"/>}</button>})}</nav>
    <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>Need a hand?</b><p>Find your way around CampusConnect.</p><button onClick={()=>window.alert('CampusConnect help: use the sidebar to navigate. Create students and courses before adding enrollments. All records are stored in your configured database.')}>Visit help center <ExternalLink size={13}/></button></div><div className="profile"><div className="profile-avatar">AD</div><div className="profile-info"><b>Campus Admin</b><span>Administrator</span></div><button className="icon-btn profile-more" title="Profile settings" onClick={()=>window.alert('This academic project uses a demonstration admin profile. Authentication is not included in the assignment scope.')}><MoreHorizontal size={20}/></button></div></div>
  </aside></>;
}

function StatCard({ label, value, sub, icon: Icon, tone, trend }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={19}/></span></div><div className="stat-number">{value ?? '—'}</div><div className="stat-foot"><span className="stat-sub">{sub}</span>{trend && <span className="trend"><ArrowUpRight size={14}/>{trend}</span>}</div></article>;
}

function EmptyState({ icon: Icon, title, description, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={25}/></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

function Dashboard({ data, loading, onNavigate, refresh }) {
  const recent = data?.recent || [];
  const total = data?.students || 0;
  const activeRate = data?.enrollments ? Math.round((data.activeEnrollments / data.enrollments)*100) : 0;
  return <div className="page-stack">
    <section className="welcome-banner"><div className="welcome-content"><div className="eyebrow"><Sparkles size={14}/> YOUR CAMPUS, IN ONE PLACE</div><h2>Make room for what<br className="desktop-break"/> matters most.</h2><p>Manage your campus records, keep courses organized, and make every enrollment count.</p><button className="btn btn-light" onClick={()=>onNavigate('students')}><Plus size={17}/> Add a student</button></div><div className="welcome-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-cap"><GraduationCap size={78} strokeWidth={1.25}/></div><div className="art-pill pill-one"><Users size={15}/><span>Students</span></div><div className="art-pill pill-two"><BookOpen size={15}/><span>Learning</span></div><div className="art-spark spark-one">✦</div><div className="art-spark spark-two">✧</div></div></section>
    <div className="section-heading"><div><h2>Campus at a glance</h2><p>Here’s what’s happening across your campus.</p></div><button className="btn btn-secondary btn-sm" onClick={refresh}><RefreshCw size={15}/> Refresh</button></div>
    <div className="stats-grid"><StatCard label="Total students" value={loading?'…':total} sub="Registered students" icon={Users} tone="tone-blue"/><StatCard label="Active courses" value={loading?'…':data?.courses??0} sub="Available courses" icon={BookOpen} tone="tone-violet"/><StatCard label="Total enrollments" value={loading?'…':data?.enrollments??0} sub="Course registrations" icon={BookMarked} tone="tone-orange"/><StatCard label="Active enrollment rate" value={loading?'…':`${activeRate}%`} sub={`${data?.activeEnrollments??0} currently enrolled`} icon={Activity} tone="tone-green"/></div>
    <div className="dashboard-grid"><section className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>Pick up where you left off.</p></div><span className="soft-icon"><SlidersHorizontal size={18}/></span></div><div className="quick-actions"><button onClick={()=>onNavigate('students')} className="quick-action"><span className="quick-icon q-blue"><Users size={19}/></span><span><b>Manage students</b><small>Profiles and records</small></span><Plus size={17} className="quick-plus"/></button><button onClick={()=>onNavigate('courses')} className="quick-action"><span className="quick-icon q-purple"><BookOpen size={19}/></span><span><b>Manage courses</b><small>Courses and instructors</small></span><Plus size={17} className="quick-plus"/></button><button onClick={()=>onNavigate('enrollments')} className="quick-action"><span className="quick-icon q-orange"><BookMarked size={19}/></span><span><b>Manage enrollments</b><small>Registration records</small></span><Plus size={17} className="quick-plus"/></button></div></section>
      <section className="panel recent-panel"><div className="panel-heading"><div><h3>Recent enrollments</h3><p>The latest course registrations.</p></div><button className="text-link" onClick={()=>onNavigate('enrollments')}>View all <ArrowUpRight size={14}/></button></div>{recent.length ? <div className="recent-list">{recent.map(e=><div className="recent-row" key={e._id}><div className="recent-avatar">{initials(e.student?.name)}</div><div className="recent-copy"><b>{e.student?.name || 'Deleted student'}</b><span>{e.course?.courseCode || '—'} · {e.course?.title || 'Deleted course'}</span></div><div className="recent-meta"><span className={`status status-${(e.status||'enrolled').toLowerCase()}`}>{e.status}</span><small>{formatDate(e.createdAt)}</small></div></div>)}</div> : <EmptyState icon={CalendarDays} title="No enrollments yet" description="Once you enroll a student in a course, the latest records will appear here." action={<button className="text-link" onClick={()=>onNavigate('enrollments')}>Create an enrollment <ArrowUpRight size={14}/></button>}/>}</section></div>
    <section className="system-note"><div className="system-note-icon"><ShieldCheck size={20}/></div><div><b>Your campus data, organized.</b><p>Keep student and course records up to date. Changes are saved to the connected database.</p></div><div className="system-note-tag"><span/> System overview</div></section>
  </div>;
}

function DataTable({ type, rows, onEdit, onDelete, loading }) {
  const headers = type==='students' ? ['Student','Roll number','Department','Semester','Contact',''] : type==='courses' ? ['Course','Code','Department','Credits','Instructor',''] : ['Student','Course','Semester','Enrolled on','Status',''];
  if (loading) return <div className="table-loading"><span className="spinner"/> Loading records…</div>;
  if (!rows.length) return <EmptyState icon={type==='students'?Users:type==='courses'?BookOpen:BookMarked} title={`No ${type} found`} description={`Your ${type} list is empty or no records match your search. Create a record to get started.`} />;
  return <div className="table-wrap"><table><thead><tr>{headers.map((h,i)=><th key={`${h}-${i}`}>{h}</th>)}</tr></thead><tbody>{rows.map(row=>{
    if(type==='students') return <tr key={row._id}><td><div className="person-cell"><div className="table-avatar avatar-blue">{initials(row.name)}</div><div><b>{row.name}</b><small>{row.email}</small></div></div></td><td><span className="code-chip">{row.rollNumber}</span></td><td><span className="department-cell">{row.department}</span></td><td><span className="semester-chip">Semester {row.semester}</span></td><td><span className="contact-cell">{row.phone||'—'}</span></td><td><Actions row={row} onEdit={onEdit} onDelete={onDelete}/></td></tr>;
    if(type==='courses') return <tr key={row._id}><td><div className="course-cell"><div className="table-avatar avatar-purple"><BookOpen size={17}/></div><div><b>{row.title}</b><small>{row.creditHours} credit hours</small></div></div></td><td><span className="code-chip">{row.courseCode}</span></td><td><span className="department-cell">{row.department}</span></td><td><span className="credits-chip">{row.creditHours} cr</span></td><td><div className="instructor-cell"><div className="mini-avatar">{initials(row.instructor)}</div>{row.instructor}</div></td><td><Actions row={row} onEdit={onEdit} onDelete={onDelete}/></td></tr>;
    return <tr key={row._id}><td><div className="person-cell"><div className="table-avatar avatar-blue">{initials(row.student?.name)}</div><div><b>{row.student?.name||'Missing student'}</b><small>{row.student?.rollNumber||'—'}</small></div></div></td><td><div className="course-cell"><div className="table-avatar avatar-purple"><BookOpen size={16}/></div><div><b>{row.course?.title||'Missing course'}</b><small>{row.course?.courseCode||'—'}</small></div></div></td><td><span className="semester-chip">Semester {row.semester}</span></td><td><span className="contact-cell">{formatDate(row.enrolledOn)}</span></td><td><span className={`status status-${(row.status||'enrolled').toLowerCase()}`}>{row.status}</span></td><td><Actions row={row} onEdit={onEdit} onDelete={onDelete}/></td></tr>;
  })}</tbody></table></div>;
}

function Actions({ row, onEdit, onDelete }) { return <div className="row-actions"><button className="row-action edit-action" title="Edit record" aria-label="Edit record" onClick={()=>onEdit(row)}><Pencil size={15}/></button><button className="row-action delete-action" title="Delete record" aria-label="Delete record" onClick={()=>onDelete(row)}><Trash2 size={15}/></button></div>; }

function ManagementPage({ type, rows, loading, search, setSearch, onCreate, onEdit, onDelete, refresh, error }) {
  const cfg = sections[type];
  const descriptions = { students:'Keep student profiles, departments, and academic details in one place.', courses:'Organize your course catalog, credit hours, and teaching staff.', enrollments:'Track student registrations and their course enrollment status.' };
  const Icon = type==='students'?Users:type==='courses'?BookOpen:BookMarked;
  const [statusFilter,setStatusFilter] = useState('');
  const filtered = useMemo(()=> type==='enrollments' && statusFilter ? rows.filter(r=>r.status===statusFilter) : rows,[rows,type,statusFilter]);
  return <div className="page-stack"><div className="management-hero"><div className="management-icon"><Icon size={23}/></div><div className="management-copy"><div className="eyebrow">CAMPUS DIRECTORY / {type.toUpperCase()}</div><h2>{cfg.title}</h2><p>{descriptions[type]}</p></div><button className="btn btn-primary create-btn" onClick={onCreate}><Plus size={17}/> Add {cfg.singular}</button></div>
    <div className="list-summary"><div><div className="summary-count">{rows.length}<span> {rows.length===1?cfg.singular:cfg.plural}</span></div><p>All records in your campus directory</p></div><div className="list-controls"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${type}…`} aria-label={`Search ${type}`}/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search"><X size={14}/></button>}</div>{type==='enrollments'&&<select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} aria-label="Filter by enrollment status"><option value="">All statuses</option><option>Enrolled</option><option>Completed</option><option>Withdrawn</option></select>}<button className="icon-btn refresh-btn" onClick={refresh} title="Refresh records"><RefreshCw size={17}/></button></div></div>
    <section className="panel table-panel"><div className="table-panel-head"><div><h3>{cfg.title} directory</h3><p>View, update, and organize your records.</p></div><span className="record-count"><span/> {filtered.length} records</span></div>{error&&<div className="inline-error"><AlertCircle size={16}/>{error}</div>}<DataTable type={type} rows={filtered} loading={loading} onEdit={onEdit} onDelete={onDelete}/><div className="table-footer"><span>Showing <b>{filtered.length}</b> of <b>{rows.length}</b> loaded records</span><span><ShieldCheck size={14}/> Connected records</span></div></section>
    <div className="tip-banner"><div className="tip-icon"><Sparkles size={17}/></div><p><b>Quick tip</b> {type==='students'?'Use unique roll numbers and valid email addresses to keep student records accurate.':type==='courses'?'Course codes should be unique. Courses with enrollments cannot be deleted until those enrollments are removed.':'Create students and courses first. An enrollment links one student to one course for a given semester.'}</p></div>
  </div>;
}

export default function App() {
  const [active,setActive] = useState('dashboard');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [dashboard,setDashboard] = useState(null);
  const [rows,setRows] = useState({students:[],courses:[],enrollments:[]});
  const [loading,setLoading] = useState(false);
  const [search,setSearch] = useState('');
  const [modal,setModal] = useState(null);
  const [toast,setToast] = useState(null);
  const [pageError,setPageError] = useState('');
  const [apiStatus,setApiStatus] = useState('checking');
  const [now,setNow] = useState(new Date());

  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),60000); return ()=>clearInterval(t); },[]);
  const notify = useCallback((message,type='success')=>setToast({message,type}),[]);
  const loadDashboard = useCallback(async()=>{ try { const result=await api('/dashboard');setDashboard(result.data);setApiStatus('connected'); } catch(e) {setApiStatus('offline');setPageError(e.message);} },[]);
  const loadRows = useCallback(async(type,query='')=>{
    setLoading(true);setPageError('');
    try { const result=await api(`/${type}${query?`?search=${encodeURIComponent(query)}`:''}`);setRows(prev=>({...prev,[type]:result.data}));setApiStatus('connected'); }
    catch(e){setPageError(e.message);setApiStatus('offline');setRows(prev=>({...prev,[type]:[]}));}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{loadDashboard();},[loadDashboard]);
  useEffect(()=>{if(active!=='dashboard')loadRows(active,search);},[active,search,loadRows]);
  const refresh = ()=> active==='dashboard' ? loadDashboard() : loadRows(active,search);
  const openCreate = ()=>setModal({type:active,record:null});
  const openEdit = record=>setModal({type:active,record});
  const saveDone = async()=>{const type=modal.type;setModal(null);await Promise.all([loadRows(type,search),loadDashboard()]);};
  const remove = async record=>{
    const label=active==='students'?`${record.name} (${record.rollNumber})`:active==='courses'?`${record.title} (${record.courseCode})`:`${record.student?.name||'student'} — ${record.course?.title||'course'}`;
    if(!window.confirm(`Delete this ${sections[active].singular}?\n\n${label}\n\nThis action cannot be undone.`))return;
    try{const result=await api(`/${active}/${record._id}`,{method:'DELETE'});notify(result.message||'Record deleted.');await Promise.all([loadRows(active,search),loadDashboard()]);}
    catch(e){notify(e.message,'error');}
  };
  const greeting = now.getHours()<12?'Good morning':now.getHours()<17?'Good afternoon':'Good evening';
  const dateText = now.toLocaleDateString('en-PK',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
  return <div className="app-shell"><Sidebar active={active} setActive={id=>{setActive(id);setSearch('');setPageError('');}} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><main className="main-area"><header className="topbar"><div className="topbar-left"><button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu size={21}/></button><div className="breadcrumb"><span>CampusConnect</span><span className="breadcrumb-slash">/</span><b>{sections[active].title}</b></div></div><div className="topbar-right"><div className="date-chip"><CalendarDays size={15}/><span>{dateText}</span></div><span className={`connection-chip ${apiStatus}`} title={apiStatus==='connected'?'Backend API reachable':'Backend connection unavailable'}><span/>{apiStatus==='connected'?'System online':apiStatus==='checking'?'Connecting…':'API offline'}</span><div className="topbar-avatar">AD</div></div></header>
    <div className="page-content"><div className="page-greeting"><div><div className="greeting-label">{greeting}, Campus Admin <span>✦</span></div><h1>{active==='dashboard'?'Welcome back to your campus.':`Your ${sections[active].title.toLowerCase()}, simplified.`}</h1><p>{active==='dashboard'?'A clear view of your campus operations starts here.':'Everything you need to manage your academic records, all in one place.'}</p></div><div className="greeting-actions"><button className="btn btn-secondary btn-sm" onClick={refresh}><RefreshCw size={15}/> Sync data</button><button className="btn btn-primary btn-sm" onClick={()=>{if(active==='dashboard')setActive('students');else openCreate();}}><Plus size={16}/> {active==='dashboard'?'New student':`New ${sections[active].singular}`}</button></div></div>
      {apiStatus==='offline'&&<div className="connection-alert"><AlertCircle size={18}/><div><b>Backend connection issue</b><p>{pageError||'Make sure the API server is running and connected to MongoDB.'}</p></div><button className="btn btn-secondary btn-sm" onClick={refresh}>Retry</button></div>}
      {active==='dashboard'?<Dashboard data={dashboard} loading={apiStatus==='checking'} onNavigate={setActive} refresh={loadDashboard}/>:<ManagementPage key={active} type={active} rows={rows[active]} loading={loading} search={search} setSearch={setSearch} onCreate={openCreate} onEdit={openEdit} onDelete={remove} refresh={refresh} error={pageError}/>}
      <footer className="app-footer"><span>© {now.getFullYear()} CampusConnect <span className="footer-dot">·</span> Built for better campus management</span><span className="footer-right"><span><Database size={13}/> MongoDB-backed</span><span><ShieldCheck size={13}/> Academic project</span></span></footer>
    </div></main>
    {modal&&<Modal title={`${modal.record?'Edit':'Add'} ${sections[modal.type].singular}`} subtitle={modal.record?'Update the information below and save your changes.':'Enter the details below to create a new record.'} onClose={()=>setModal(null)}><RecordForm type={modal.type} record={modal.record} onCancel={()=>setModal(null)} onSaved={saveDone} notify={notify}/></Modal>}
    <Toast toast={toast} onClose={()=>setToast(null)}/></div>;
}
