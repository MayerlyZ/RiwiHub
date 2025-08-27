import TokenTransaction from '../models/TokenTransaction.js';

export const createTransaction = async (data) => {
  return await TokenTransaction.create(data);
};

export const getAllTransactions = async () => {
  return await TokenTransaction.findAll();
};

export const getTransactionById = async (id) => {
  return await TokenTransaction.findByPk(id);
};

export const updateTransaction = async (id, data) => {
  const [updated] = await TokenTransaction.update(data, { where: { transaction_id: id } });
  if (!updated) return null;
  return await TokenTransaction.findByPk(id);
};

export const deleteTransaction = async (id) => {
  return await TokenTransaction.destroy({ where: { transaction_id: id } });
};


