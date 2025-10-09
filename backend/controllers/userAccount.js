const userAccountService = require("../services/userAccount.js");
const mongoose = require("mongoose");

const userAccountController = {
    createAccount: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const existingAccount = await userAccountService.getAccountById(userId);

            if (existingAccount) {
                const updatedAccount = await userAccountService.updateAccount(userId, req.body);
                return res.status(200).json(updatedAccount);
            }

            const newAccountData = { ...req.body, userId: userId }; // Inject userId
            const newAccount = await userAccountService.createAccount(newAccountData);
            res.status(201).json(newAccount);
        } catch (error) {
            next(error);
        }
    },

    getAccountById: async (req, res, next) => {
        try {
            const accountId = req.params.id === "me" ? req.user.id : req.params.id;

            // Validate accountId before querying the DB to avoid Mongoose CastError
            if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
                return res.status(400).json({ message: "Invalid or missing user id" });
            }

            const account = await userAccountService.getAccountById(accountId);
            if (!account) {
                return res.status(404).json({ message: "User account not found" });
            }
            res.status(200).json(account);
        } catch (error) {
            next(error);
        }
    },

    updateAccount: async (req, res, next) => {
        // console.log(req.params)
        const accountId= req.params.id
        // console.log(accountId)
        try {
            // const accountId = req.params.id === "me" ? req.user.id : req.params.id;

            if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
                return res.status(400).json({ message: "Invalid or missing user id" });
            }
console.log(accountId)
            const updatedAccount = await userAccountService.updateAccount(
                accountId,
                req.body
            );
            console.log(updatedAccount)
            if (!updatedAccount) {
                return res.status(404).json({ message: "User account not found" });
            }
            res.status(200).json(updatedAccount);
        } catch (error) {
            next(error);
        }
    },

    deleteAccount: async (req, res, next) => {
        try {
            const accountId = req.params.id === "me" ? req.user.id : req.params.id;

            if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
                return res.status(400).json({ message: "Invalid or missing user id" });
            }

            const deletedAccount = await userAccountService.deleteAccount(accountId);
            if (!deletedAccount) {
                return res.status(404).json({ message: "User account not found" });
            }
            res.status(200).json({ message: "User account deleted successfully" });
        } catch (error) {
            next(error);
        }
    },
    getAllAccounts: async (req, res, next) => {
        try {
            const accounts = await userAccountService.getAllAccounts();
            res.status(200).json(accounts);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = userAccountController;
