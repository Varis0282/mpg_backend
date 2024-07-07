import DoubtModel from '../model/doubts.js';
import _ from 'lodash';
import { errorObj, successObj } from '../../config/settings.js'
import moment from 'moment/moment.js';


const exp = {
    add: (data) => {
        return new Promise(async (resolve) => {
            try {

                let newDoubt = new DoubtModel();

                _.each(data, (v, k) => {
                    newDoubt[k] = v;
                })

                let msgObj = {
                    senderId: data?.userId,
                    messageText: `I have a doubt names <b>${data?.title}</b> and the description is <b><i>${data?.description}</i></b>`,
                    isRead: false,
                    senderType: "user",
                    receiverType: "mentor"
                }

                newDoubt.messages.push(msgObj);

                let savedDoubt = await newDoubt.save();

                return resolve({ ...successObj, data: savedDoubt });

            } catch (error) {
                console.log("Error in add doubt", error)
                return resolve({ ...errorObj, message: error.message });
            }
        })
    },
    getByCourse: (data) => {
        return new Promise(async (resolve) => {
            try {
                let doubts = await DoubtModel.find({ courseId: data?.courseId }).populate('userId', 'name email profilePic')
                return resolve({ ...successObj, data: doubts });
            } catch (error) {
                console.log("Error in get doubt by course", error)
                return resolve({ ...errorObj, message: error.message });
            }
        })
    },
    list: (data) => {
        return new Promise(async (resolve) => {
            try {

                if (data?.courseId.length) {
                    data.courseId = { $in: data.courseId }
                }

                if (data?.status.length) {
                    data.status = { $in: data.status }
                }

                if (data?.userId.length) {
                    data.userId = { $in: data.userId }
                }

                if (data.title) {
                    data.title = { $regex: data.title, $options: 'i' }
                }

                if (data.createdAt.length) {
                    data.createdAt = {
                        $gte: moment(data.createdAt[0]).startOf('day').toDate(),
                        $lte: moment(data.createdAt[1]).endOf('day').toDate()
                    }
                }

                if (data.lastMessageAt.length) {
                    data.lastMessageAt = {
                        $gte: moment(data.lastMessageAt[0]).startOf('day').toDate(),
                        $lte: moment(data.lastMessageAt[1]).endOf('day').toDate()
                    }
                }

                let x = FilterTable(DoubtModel, {
                    sortField: "createdAt",
                    sortOrder: "desc",
                })

                return resolve({ ...successObj, data: doubts });
            } catch (error) {
                console.log("Error in get doubt by course", error)
                return resolve({ ...errorObj, message: error.message });
            }
        })
    },
    addResponseByMentor: (data) => {
        return new Promise(async (resolve) => {
            try {
                let doubt = await DoubtModel.findById(data?._id);

                let msgObj = {
                    senderId: data?.mentorId,
                    receiverId: data?.userId,
                    messageText: data?.message,
                    senderType: "mentor",
                    receiverType: "user",
                    isRead: false
                }

                doubt = await exp.markOldMessageRead({ doubt: doubt, userId: doubt?.userId });

                doubt.messages.push(msgObj);

                let savedDoubt = await doubt.save();
                return resolve({ ...successObj, data: savedDoubt });
            } catch (error) {
                console.log("Error in update doubt by mentor", error)
                return resolve({ ...errorObj, message: error.message });
            }
        })
    },
    markOldMessageRead: (data) => {
        return new Promise(async (resolve) => {
            try {
                let doubt ;

                if(data.doubt){
                    doubt = data.doubt;
                }else{
                    doubt = await DoubtModel.findById(data?._id);
                }


                // all messages mark as read send by a particular user or mentor
                _.each(doubt.messages, (msg) => {
                    if (msg.senderId === data?.userId) {
                        msg.isRead = true;
                    }
                })

                return resolve({ ...successObj, data: doubt });
            } catch (error) {
                console.log("Error in update doubt by mentor", error)
                return resolve({ ...errorObj, message: error.message });
            }
        })
    },
    // getDoubtById => where we'll get a doubt and it's messages and mark all messages as read only for the user who is requesting
    // queryMoreById => where the student will query for more doubt by adding more msgs and marking all messages read send by mentor previously
};


export default exp;