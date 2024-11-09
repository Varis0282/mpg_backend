import BatchModel from '../model/batch.js'
import CourseModel from '../model/courses.js'
import _ from 'lodash'
import { successObj, errorObj } from '../../config/settings.js'
import { FilterTable } from '../../config/table.js'
import async from 'async'
import moment from 'moment'


const exp = {
    add: (data) => {
        return new Promise(async (resolve) => {
            try {
                let course = await CourseModel.findById(data.course);
                if (!course) {
                    return resolve({ ...errorObj, message: "Course not found" })
                }
                if (course.duration !== data.duration) {
                    return resolve({ ...errorObj, message: "Course Duration and Batch Duration must be equal !" });
                }

                const newBatch = new BatchModel()
                _.each(data, (value, key) => {
                    newBatch[key] = value
                })
                newBatch.duration = course.durationInWeeks
                const batch = await newBatch.save()
                course.upComingBatches.push(batch._id)
                await course.save();
                resolve({ ...successObj, message: "Batch added successfully" })
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding batch" })
            }
        })
    },
    getCourseBatch: (data) => {
        return new Promise(async (resolve) => {
            try {
                console.log(data)
                const batchList = await BatchModel.find({ course: data.courseId }).populate('course', 'name');
                resolve({ ...successObj, data: batchList })
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching batch" })
            }
        })
    },
    list: (data) => {
        return new Promise(async (resolve) => {
            try {

                data.populateArr = [{ path: 'course', select: 'name' }]

                let x = FilterTable(BatchModel, {
                    sortField: "createdAt",
                    sortOrder: "desc",
                    ...data
                })

                resolve(x)
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching batch" })
            }
        })
    },
    delete: (data) => {
        return new Promise(async (resolve) => {
            try {
                await BatchModel.deleteOne({ _id: data._id })
                resolve({ ...successObj, message: "Batch deleted successfully" })
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while deleting batch" })
            }
        })
    },
    update: (data) => {
        return new Promise(async (resolve) => {
            try {
                let batch = await BatchModel.findById(data._id)

                if (!batch) {
                    return resolve({ ...errorObj, message: "Batch not found" })
                }

                _.each(data, (value, key) => {
                    batch[key] = value
                })

                await batch.save()

                resolve({ ...successObj, message: "Batch updated successfully" })
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while updating batch" })
            }
        })
    },
    getUserBatch: (data) => {
        return new Promise(async (resolve) => {
            try {
                const batchList = await BatchModel.find({ users: data.userId })
                resolve({ ...successObj, data: batchList })
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching batch" })
            }
        })
    },
    findById: (data) => {
        return new Promise(async (resolve) => {
            try {
                const batch = await BatchModel.findById(data._id)
                resolve({ ...successObj, data: batch })
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching batch" })
            }
        })
    }
}

export default exp