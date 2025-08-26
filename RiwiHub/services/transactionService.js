import Transaction from '../models/Transaction.js'; // Assuming you have a Transaction model defined

export const createTransaction = async (transactionData) => {
    try {
        const transaction = await Transaction.create(transactionData);
        return transaction;
    } catch (error) {
        throw new Error('Error creating transaction: ' + error.message);
    }
};

export const getTransactionById = async (transactionId) => {
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    } catch (error) {
        throw new Error('Error fetching transaction: ' + error.message);
    }
};

export const getAllTransactions = async () => {
    try {
        const transactions = await Transaction.findAll();
        return transactions;
    } catch (error) {
        throw new Error('Error fetching transactions: ' + error.message);
    }
};

export const updateTransaction = async (transactionId, updateData) => {
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        await transaction.update(updateData);
        return transaction;
    } catch (error) {
        throw new Error('Error updating transaction: ' + error.message);
    }
};

export const deleteTransaction = async (transactionId) => {
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        await transaction.destroy();
        return { message: 'Transaction deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting transaction: ' + error.message);
    }
};