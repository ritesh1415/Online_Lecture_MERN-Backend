import mongoose from "mongoose";
import Coursemodel from "../Model/Coursemodel.js";
import Adminmodel from "../Model/Adminmodel.js";

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { name, level, description, image, instructor } = req.body;

        const instructorData = await Adminmodel.findOne({ username: instructor });

        if (!instructorData) {
            return res.status(400).send({
                success: false,
                message: "Instructor not found",
            });
        }

        // Create the new course with ObjectId for the instructor
        const instructorObjectId = new mongoose.Types.ObjectId(instructorData._id);

        const course = new Coursemodel({
            name,
            level,
            description,
            image,
            instructor: instructorObjectId,
        });

        await course.save();

        res.status(201).send({
            success: true,
            message: "Course created successfully",
            course
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error creating course",
            error: error.message
        });
    }
};

// Retrieve all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Coursemodel.find().populate("instructor", "username");
        
        res.status(200).send({
            success: true,
            message: "Courses retrieved successfully",
            courses
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error retrieving courses",
            error: error.message
        });
    }
};


// Add a lecture to a course
const addLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { date, topic, instructor } = req.body;

        const course = await Coursemodel.findById(courseId);

        if (!course) {
            return res.status(404).send({
                success: false,
                message: 'Course not found',
            });
        }

        // Check for a scheduling conflict
        const conflict = await Coursemodel.findOne({
            'lectures.date': date,
            'lectures.instructor': instructor
        });

        if (conflict) {
            return res.status(400).send({
                success: false,
                message: `Instructor is already assigned to another lecture on ${date}.`,
            });
        }

        course.lectures.push({
            date,
            topic,
            instructor
        });

        await course.save();

        res.status(201).send({
            success: true,
            message: 'Lecture added successfully',
            course,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error adding lecture',
            error: error.message,
        });
    }
};


// Get all instructors
const instructor= async(req, res) => {
    try {
        const instructors = await Adminmodel.find({ role: 'instructor' }).select('username email'); // Fetch all instructors
        
        res.status(200).send({
            success: true,
            message: 'Instructors retrieved successfully',
            instructors, // Return the list of instructors
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error retrieving instructors',
            error: error.message,
        });
    }}

    const Allcourse = async (req, res) => {
        try {
            const { instructorId } = req.params;
    
            const courses = await Coursemodel.find({ 'lectures.instructor': instructorId });
    
            const lectures = courses.flatMap((course) => {
                return course.lectures
                    .filter((lecture) => lecture.instructor.toString() === instructorId)
                    .map((lecture) => ({
                        courseName: course.name, 
                        date: lecture.date,
                        topic: lecture.topic,
                    }));
            });
    
            res.status(200).send({
                success: true,
                message: 'Lectures retrieved successfully',
                lectures,
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error retrieving lectures',
                error: error.message,
            });
        }
    };
    

export { createCourse, getAllCourses,  addLecture,instructor,Allcourse };
