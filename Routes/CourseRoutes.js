import express from 'express';
import { Allcourse, addLecture, createCourse, instructor } from '../Controller/CourseController.js';
const router=express.Router();
router.post('/create',createCourse)
router.post('/add/:courseId',addLecture)

router.get('/instructor',instructor)
router.get('/Allcourse/:instructorId',Allcourse)
export default router
