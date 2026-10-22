import { Router } from 'express';
import Student from '../models/Student.js';
import Enrollment from '../models/Enrollment.js';

const router = Router();
const fields = ['name', 'rollNumber', 'email', 'department', 'semester', 'phone'];
const payload = body => Object.fromEntries(fields.filter(k => body[k] !== undefined).map(k => [k, body[k]]));
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res, next) => {
  try {
    const { search = '', department = '', semester = '' } = req.query;
    const filter = {};
    if (search) {
      const sanitized = escapeRegex(search.trim());
      filter.$or = ['name', 'rollNumber', 'email'].map(k => ({ [k]: { $regex: sanitized, $options: 'i' } }));
    }
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);
    const students = await Student.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, data: students });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, data: student });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create(payload(req.body));
    res.status(201).json({ success: true, message: 'Student created successfully.', data: student });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, payload(req.body), { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.json({ success: true, message: 'Student updated successfully.', data: student });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const linked = await Enrollment.countDocuments({ student: student._id });
    if (linked) return res.status(409).json({ success: false, message: `This student has ${linked} enrollment(s). Remove those enrollments first.` });
    await student.deleteOne();
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (err) { next(err); }
});

export default router;
