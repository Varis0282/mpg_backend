import _ from 'lodash';
import UserModel from '../model/users.js';
import LoginHistory from '../model/loginHistory.js';
import { errorObj, successObj } from '../../config/settings.js';
import { FilterTable } from '../../config/table.js';

const exp = {
    add: (data) => {
        return new Promise(async (resolve) => {
            try {
                const newUser = new UserModel();
                _.each(data, (value, key) => {
                    newUser[key] = value;
                });
                await newUser.save();
                resolve({ ...successObj, message: "User added successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding user" })
            }
        })
    },
    list: (data) => {
        return new Promise(async (resolve) => {
            try {
                const x = await FilterTable(UserModel, {
                    sortField: "createdAt",
                    sortOrder: "descend",
                    ...data
                });
                resolve(x);
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching users" })
            }
        })
    },
    findById: (data) => {
        return new Promise(async (resolve) => {
            try {
                const user = await UserModel.findById(data._id);
                if (!user) {
                    resolve({ ...errorObj, message: "User with the given id doesn't exists." });
                }
                user.password = undefined;
                resolve({ ...successObj, data: user });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while fetching user" })
            }
        })
    },
    login: (data) => {
        return new Promise(async (resolve) => {
            try {
                const user = await UserModel.findOne({ $or: [{ email: data.key.toLowerCase() }, { phone: data.key }] });
                if (!user) {
                    resolve({ ...errorObj, message: "User with the given details doesn't exists." });
                }
                const isMatch = await user.validPassword(data.password);
                if (!isMatch) {
                    resolve({ ...errorObj, message: "Wrong Password" });
                }
                const token = await user.generateToken();
                await exp.addLoginHistory(data);
                resolve({ ...successObj, data: { token, ...user._doc } });
            } catch (error) {

            }
        })
    },
    addLoginHistory: (data) => {
        return new Promise(async (resolve) => {
            try {
                const newLogin = new LoginHistory();
                _.each(data, (value, key) => {
                    newLogin[key] = value;
                });
                await newLogin.save();
                resolve({ ...successObj, message: "Login history added successfully" });
            } catch (error) {
                console.log(error)
                resolve({ ...errorObj, message: error.message ? error.message : "Error while adding login history" })
            }
        })
    }
}

export default exp;