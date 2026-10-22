import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Student name is required'], trim: true, minlength: 2, maxlength: 80 },
  rollNumber: { type: String, required: [true, 'Roll number is required'], trim: true, uppercase: true, unique: true, maxlength: 30 },
  email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, unique: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'] },
  department: { type: String, required: [true, 'Department is required'], trim: true, maxlength: 80 },
  semester: { type: Number, required: true, min: 1, max: 12 },
  phone: { type: String, trim: true, default: '', maxlength: 25 }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
