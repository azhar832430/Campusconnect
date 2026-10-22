import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const initial = {
  students: { name: '', rollNumber: '', email: '', department: 'Software Engineering', semester: '1', phone: '' },
  courses: { courseCode: '', title: '', creditHours: '3', instructor: '', department: 'Software Engineering', description: '' },
  enrollments: { student: '', course: '', semester: '1', status: 'Enrolled', enrolledOn: new Date().toISOString().slice(0, 10) }
};
const departments = ['Software Engineering', 'Computer Systems Engineering', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Computer Science', 'Business Administration'];

export default function RecordForm({ type, record, onCancel, onSaved, notify }) {
  const [values, setValues] = useState(initial[type]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (record) {
      const next = { ...initial[type], ...record };
      if (type === 'enrollments') {
        next.student = record.student?._id || record.student || '';
        next.course = record.course?._id || record.course || '';
        next.enrolledOn = record.enrolledOn ? new Date(record.enrolledOn).toISOString().slice(0, 10) : initial.enrollments.enrolledOn;
      }
      setValues(Object.fromEntries(Object.entries(next).map(([k,v]) => [k, v == null ? '' : String(v)])));
    }
  }, [record, type]);

  useEffect(() => {
    if (type === 'enrollments') {
      Promise.all([api('/students'), api('/courses')]).then(([s,c]) => { setStudents(s.data); setCourses(c.data); }).catch(e => setError(e.message));
    }
  }, [type]);

  const set = (key, value) => setValues(prev => ({ ...prev, [key]: value }));
  const submit = async e => {
    e.preventDefault(); setError('');
    const required = type === 'students' ? ['name','rollNumber','email','department','semester'] : type === 'courses' ? ['courseCode','title','creditHours','instructor','department'] : ['student','course','semester','status'];
    const missing = required.find(k => !String(values[k] ?? '').trim());
    if (missing) { setError(`Please complete the ${missing.replace(/[A-Z]/g, m => ` ${m.toLowerCase()}`)} field.`); return; }
    if (type === 'students' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { setError('Enter a valid email address.'); return; }
    if (type === 'students' && Number(values.semester) < 1) { setError('Semester must be at least 1.'); return; }
    if (type === 'courses' && (Number(values.creditHours) < 1 || Number(values.creditHours) > 6)) { setError('Credit hours must be between 1 and 6.'); return; }
    setBusy(true);
    try {
      const body = { ...values };
      if (type === 'students') body.semester = Number(body.semester);
      if (type === 'courses') body.creditHours = Number(body.creditHours);
      if (type === 'enrollments') body.semester = Number(body.semester);
      const result = await api(`/${type}${record ? `/${record._id}` : ''}`, { method: record ? 'PUT' : 'POST', body });
      notify(result.message || 'Saved successfully.', 'success'); onSaved();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const field = (label, key, opts = {}) => <label className={`field ${opts.full ? 'field-full' : ''}`} key={key}><span>{label}{opts.required !== false && <b> *</b>}</span>
    {opts.options ? <select value={values[key] ?? ''} onChange={e => set(key, e.target.value)} required={opts.required !== false}><option value="">Select {label.toLowerCase()}</option>{opts.options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      : opts.textarea ? <textarea rows="3" maxLength={500} value={values[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={opts.placeholder || ''} />
      : <input type={opts.type || 'text'} min={opts.min} max={opts.max} maxLength={opts.maxLength} value={values[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={opts.placeholder || ''} required={opts.required !== false} />}
  </label>;

  return <form className="record-form" onSubmit={submit} noValidate>
    <div className="form-grid">
      {type === 'students' && <>{field('Full name','name',{placeholder:'e.g. Ayesha Khan',maxLength:80})}{field('Roll number','rollNumber',{placeholder:'e.g. K23SW001',maxLength:30})}{field('Email address','email',{type:'email',placeholder:'student@university.edu'})}{field('Phone number','phone',{required:false,placeholder:'+92 300 1234567',maxLength:25})}{field('Department','department',{options:departments})}{field('Semester','semester',{type:'number',min:1,max:12})}</>}
      {type === 'courses' && <>{field('Course code','courseCode',{placeholder:'e.g. SW417',maxLength:20})}{field('Course title','title',{placeholder:'e.g. Web Engineering',maxLength:120})}{field('Instructor','instructor',{placeholder:'Instructor full name',maxLength:100})}{field('Credit hours','creditHours',{type:'number',min:1,max:6})}{field('Department','department',{options:departments})}{field('Description','description',{textarea:true,required:false,full:true,placeholder:'Short course overview (optional)'})}</>}
      {type === 'enrollments' && <>{field('Student','student',{options:students.map(s=>({value:s._id,label:`${s.rollNumber} — ${s.name}`}))})}{field('Course','course',{options:courses.map(c=>({value:c._id,label:`${c.courseCode} — ${c.title}`}))})}{field('Semester','semester',{type:'number',min:1,max:12})}{field('Status','status',{options:['Enrolled','Completed','Withdrawn']})}{field('Enrollment date','enrolledOn',{type:'date',full:true})}</>}
    </div>
    {type === 'enrollments' && (!students.length || !courses.length) && <p className="inline-note">Create at least one student and one course before adding an enrollment.</p>}
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="btn btn-primary" disabled={busy || (type === 'enrollments' && (!students.length || !courses.length))}>{busy ? 'Saving…' : record ? 'Save changes' : `Create ${type === 'students' ? 'student' : type === 'courses' ? 'course' : 'enrollment'}`}</button></div>
  </form>;
}
