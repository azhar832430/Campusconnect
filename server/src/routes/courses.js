import { Router } from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

const router = Router();
const fields = ['courseCode', 'title', 'creditHours', 'instructor', 'department', 'description'];
const payload = body => Object.fromEntries(fields.filter(k => body[k] !== undefined).map(k => [k, body[k]]));
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res, next) => {
  try {
    const { search = '', department = '' } = req.query;
    const filter = {};
    if (search) {
      const sanitized = escapeRegex(search.trim());
      filter.$or = ['courseCode', 'title', 'instructor'].map(k => ({ [k]: { $regex: sanitized, $options: 'i' } }));
    }
    if (department) filter.department = department;
    const courses = await Course.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const course = await Course.create(payload(req.body));
    res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, payload(req.body), { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, message: 'Course updated successfully.', data: course });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    const linked = await Enrollment.countDocuments({ course: course._id });
    if (linked) return res.status(409).json({ success: false, message: `This course has ${linked} enrollment(s). Remove those enrollments first.` });
    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) { next(err); }
});

export default router;
