import CourseModel from '../model/courses.js';
import UserModel from '../model/users.js';
import BatchModel from '../model/batch.js';
import _ from 'lodash';
import { successObj, errorObj } from '../../config/settings.js';
import { FilterTable } from '../../config/table.js';
import async from 'async';
import moment from 'moment';

const exp = {
    add: (data) => {
        return new Promise(async (resolve) => {
            try {
                const newCourse = new CourseModel();
                _.each(data, (value, key) => {
                    newCourse[key] = value;
                });
                await newCourse.save();
                resolve({ ...successObj, message: "Course added successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding course" })
            }
        })
    },
    list: (data) => {
        return new Promise(async (resolve) => {
            try {
                if (data?.skills?.length) {
                    data = {
                        skills: { $elemMatch: { name: { $in: data.skills } } }
                    }
                }

                const x = await FilterTable(CourseModel, {
                    sortField: "createdAt",
                    sortOrder: "descend",
                    ...data
                });
                resolve(x);
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching courses" })
            }
        })
    },
    findById: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data._id);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                resolve({ ...successObj, data: course });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching course" })
            }
        })
    },
    update: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data._id);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                _.each(data, (value, key) => {
                    course[key] = value;
                });
                await course.save();
                resolve({ ...successObj, message: "Course updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while updating course" })
            }
        })
    },
    delete: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findByIdAndDelete(data._id);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                resolve({ ...successObj, message: "Course deleted successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while deleting course" })
            }
        })
    },
    addReview: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.reviews.push(data);
                await course.save();
                resolve({ ...successObj, message: "Review added successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding review" })
            }
        })
    },
    addProject: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.projects = data.projects;
                await course.save();
                resolve({ ...successObj, message: "Project updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding project" })
            }
        })
    },
    addKeyFeature: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.keyFeatures = data.keyFeatures;
                await course.save();
                resolve({ ...successObj, message: "Key feature updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding key feature" })
            }
        })
    },
    addMeta: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.meta = data.meta;
                await course.save();
                resolve({ ...successObj, message: "Meta updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding meta" })
            }
        })
    },
    addModule: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.modules = data.modules;
                await course.save();
                resolve({ ...successObj, message: "Module updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding module" })
            }
        })
    },
    addMentor: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.mentors = data.mentors;
                await course.save();
                resolve({ ...successObj, message: "Mentor updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding mentor" })
            }
        })
    },
    addSkill: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.skills = data.skills;
                await course.save();
                resolve({ ...successObj, message: "Skill updated successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding skill" })
            }
        })
    },
    enroll: (data) => {
        return new Promise(async (resolve) => {
            try {
                const course = await CourseModel.findById(data.courseId);
                if (!course) {
                    resolve({ ...errorObj, message: "Course with the given id doesn't exists." });
                }
                course.usersEnrolled.push(data.userId);
                await course.save();
                resolve({ ...successObj, message: "Enrolled successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while enrolling" })
            }
        })
    }
}


export default exp;