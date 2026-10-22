import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true, min: 1, max: 12 },
  status: { type: String, enum: ['Enrolled', 'Completed', 'Withdrawn'], default: 'Enrolled' },
  enrolledOn: { type: Date, default: Date.now }
}, { timestamps: true });
enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
