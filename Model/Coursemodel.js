import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String // URL for an image of the course
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // A course must have an instructor
    },
    lectures: [{
        date: {
            type: Date,
            required: true
        },
        topic: {
            type: String,
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
}, { timestamps: true });

// Pre-save hook to prevent scheduling conflicts
courseSchema.pre('save', async function (next) {
    const course = this;

    for (const lecture of course.lectures) {
        // Check for a lecture with the same date and instructor in other courses
        const conflict = await CourseModel.findOne({
            _id: { $ne: course._id },
            'lectures.date': lecture.date,
            'lectures.instructor': lecture.instructor
        });

        if (conflict) {
            const error = new Error(`Instructor is already assigned to another lecture on ${lecture.date}.`);
            return next(error); // Stop saving if there's a conflict
        }
    }

    next(); // Continue saving if no conflicts
});



const CourseModel = mongoose.model('Course', courseSchema);

export default CourseModel;
