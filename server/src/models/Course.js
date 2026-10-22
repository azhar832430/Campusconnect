import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: [true, 'Course code is required'], trim: true, uppercase: true, unique: true, maxlength: 20 },
  title: { type: String, required: [true, 'Course title is required'], trim: true, minlength: 2, maxlength: 120 },
  creditHours: { type: Number, required: true, min: 1, max: 6 },
  instructor: { type: String, required: [true, 'Instructor is required'], trim: true, maxlength: 100 },
  department: { type: String, required: [true, 'Department is required'], trim: true, maxlength: 80 },
  description: { type: String, trim: true, default: '', maxlength: 500 }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
