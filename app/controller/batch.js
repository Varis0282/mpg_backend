import BatchModel from '../model/batch.js'
import CourseCtrl from '../controller/course.js'
import _ from 'lodash'
import { successObj, errorObj } from '../../config/settings.js'
import { FilterTable } from '../../config/table.js'
import async from 'async'
import moment from 'moment'


const exp = {
    add: (data) => {
        return new Promise(async (resolve) => {
            try {
                let { data: course } = await CourseCtrl.findById({ _id: data.course });

                if (!course) {
                    return resolve({ ...errorObj, message: "Course not found" })
                }

                const newBatch = new BatchModel()
                _.each(data, (value, key) => {
                    newBatch[key] = value
                })
                newBatch.duration = course.durationInWeeks
                await newBatch.save()
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
                const batchList = await BatchModel.find({ course: data.courseId })
                console.log("🚀 => batchList:", batchList);
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