import { Router } from 'express';
import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

const router = Router();
const fields = ['student', 'course', 'semester', 'status', 'enrolledOn'];
const payload = body => Object.fromEntries(fields.filter(k => body[k] !== undefined).map(k => [k, body[k]]));
const populated = query => query.populate('student', 'name rollNumber department').populate('course', 'title courseCode creditHours');

router.get('/', async (req, res, next) => {
  try {
    const { search = '', status = '' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    let rows = await populated(Enrollment.find(filter).sort({ createdAt: -1 }).limit(1000));
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(e => e.student && e.course && [e.student.name, e.student.rollNumber, e.course.title, e.course.courseCode].some(v => v?.toLowerCase().includes(s)));
    }
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const enrollment = await populated(Enrollment.findById(req.params.id));
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    res.json({ success: true, data: enrollment });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = payload(req.body);
    if (!body.student || !body.course) return res.status(400).json({ success: false, message: 'Choose both a student and a course.' });
    const [student, course] = await Promise.all([Student.findById(body.student), Course.findById(body.course)]);
    if (!student) return res.status(400).json({ success: false, message: 'Selected student does not exist.' });
    if (!course) return res.status(400).json({ success: false, message: 'Selected course does not exist.' });
    const enrollment = await Enrollment.create(body);
    const data = await populated(Enrollment.findById(enrollment._id));
    res.status(201).json({ success: true, message: 'Enrollment created successfully.', data });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const body = payload(req.body);
    if (body.student && !await Student.exists({ _id: body.student })) return res.status(400).json({ success: false, message: 'Selected student does not exist.' });
    if (body.course && !await Course.exists({ _id: body.course })) return res.status(400).json({ success: false, message: 'Selected course does not exist.' });
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    const data = await populated(Enrollment.findById(enrollment._id));
    res.json({ success: true, message: 'Enrollment updated successfully.', data });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found.' });
    await enrollment.deleteOne();
    res.json({ success: true, message: 'Enrollment deleted successfully.' });
  } catch (err) { next(err); }
});

export default router;
