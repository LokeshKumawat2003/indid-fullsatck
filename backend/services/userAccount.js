const UserAccount = require('../models/userAccount.js');

const userAccountService = {
    createAccount: async (accountData) => {
        const newAccount = new UserAccount(accountData);
        return await newAccount.save();
    },

    getAccountById: async (userId) => {
        return await UserAccount.findOne({ userId });
    },

    updateAccount: async (userId, accountData) => {
    
        const updatedDoc = await UserAccount.findOneAndUpdate({_id: userId }, accountData, { new: true });
        return updatedDoc;
    },

    deleteAccount: async (userId) => {
        return await UserAccount.findOneAndDelete({ userId });
    },
    getAllAccounts: async () => {
        return await UserAccount.find();
    },
};

module.exports = userAccountService;
