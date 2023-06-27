const User = require('../models/User')
const bcrypt = require('bcryptjs');
// const transport = require('../util/email')
// const ejs = require('ejs')
const paginate = require('../helper/paginate');

exports.addUser = (req, res) => {
    try {
        const addUserData = { ...req.body };
        let avatar = 'def.png'
        if (req.file !== undefined) {
            avatar = req.file.filename;
        }
        addUserData['avatar'] = avatar

        User.findOne({ email: addUserData.email }, async (err, user) => {
            if (user) {
                return res.status(409).json({ message: 'User already exits!!' });
            }

            const AddUser = new User(addUserData)
            const checkData = await AddUser.save()
            if (!checkData) {
                return res.status(400).json({ data: `User Not Added!!` })
            }
            // else {
            //     const userData = new User(data)
            //     const user1 = await userData.save()
            //     if (!user1) {
            //         return res.status(400).json({ data: `User Not Added!!` })
            //     }

            //     const token = jwt.sign({
            //         email: email,
            //         id: user1._id.toString()
            //     }, process.env.SECRET_KEY, { expiresIn: '5m' });


            //     await User.findOneAndUpdate({ email: email },
            //         {
            //             resetPasswordToken: token,
            //             expireTokenTime: new Date().getTime() + 300 * 1000
            //         })
            //     const templateData = {
            //         firstName: firstName,
            //         lastName: lastName,
            //         email: email,
            //         url: req.headers.origin + '/reset-password',
            //         token: token
            //     }
            //     const template = await ejs.renderFile("views/setPassword.ejs", templateData);

            //     const mailOptions = {

            //         from: 'no-reply<fparmar986@gmail.com>',
            //         to: email,
            //         subject: 'Set Your Password',
            //         html: template
            //     }
            //     await transport.sendMail(mailOptions)

            return res.status(200).json({ message: `User Added Succesfully!!` })
            // }
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const oldData = await User.findOne({ _id: req.params._id })
        const updateUserData = { ...req.body }
        const checkEmail = await User.findOne({ email: updateUserData.email, _id: { $ne: req.params._id } })
        let avatar = oldData.avatar

        // if (updateUserData.password) {
        //     await User.findOneAndUpdate({ _id: req.params._id }, { password: updateUserData.password })
        //     return res.status(200).json({ message: `User's Password Updated Successfully!!` })
        // }

        if (req.file !== undefined) {
            avatar = req.file.filename
        }
        updateUserData['avatar'] = avatar

        if (updateUserData.email === oldData.email) {
            delete updateUserData['email']
        }
        if (checkEmail) {
            return res.status(400).json({ message: 'User already exist with this email!!' })
        }

        const check = await User.findOneAndUpdate({ _id: req.params._id }, updateUserData)
        if (!check) {
            return res.status(400).json({ data: err })
        }
        return res.status(200).json({ message: `User Updated Successfully!!` })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const getUserById = await User.findOne({ _id: req.params._id })
            .select('-__v -createdAt -updatedAt -password')
        if (!getUserById) {
            return res.status(400).json({ data: err })
        }
        return res.status(200).json({ data: getUserById })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const oldData = await User.findOne({ _id: req.params._id })
        if (!oldData) {
            return res.status(400).json({ message: "This User is not exist!!" })
        }
        if (oldData.isDeleted === true) {
            return res.status(400).json({ message: "This User is already deleted!!!" })
        }
        else {
            const deleteUser = await User.findOneAndUpdate({ _id: req.params._id },
                {
                    isActive: false,
                    isDeleted: true
                })
            if (!deleteUser) {
                return res.status(400).json({ data: err })
            }
            return res.status(200).json({ message: `User Deleted Successfully!!` })
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.userStatusChange = async (req, res) => {
    try {
        let toggle = true
        const status = await User.findOne({ $and: [{ _id: req.params._id }, { isDeleted: false }] })
        if (status.isActive === true) {
            toggle = false
        }
        const check = await User.findOneAndUpdate({ _id: req.params._id },
            {
                isActive: toggle
            })
        if (!check) {
            return res.status(400).json({ data: err })
        }
        return res.status(200).json({ message: `User's status changed!!` })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const option = { ...req.body };
        if (!option.hasOwnProperty('query')) {
            option['query'] = {};
        }
        option.query['addedBy'] = { $ne: null }

        const users = await paginate(option, User);
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}