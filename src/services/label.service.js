const httpStatus = require('http-status');
const { Label } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a label
 * @param {Object} labelBody
 * @returns {Promise<Label>}
 */
const createLabel = async (labelBody) => {
  return Label.create(labelBody);
};

/**
 * Query for labels
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLabels = async (filter, options) => {
  const labels = await Label.paginate(filter, options);
  return labels;
};

/**
 * Get label by id
 * @param {ObjectId} id
 * @returns {Promise<Label>}
 */
const getLabelById = async (id) => {
  return Label.findById(id);
};

/**
 * Get Label by name
 * @param {string} name
 * @returns {Promise<Label>}
 */
const getLabelByName = async (name) => {
  return Label.findOne({ name });
};

/**
 * Update label by id
 * @param {ObjectId} labelId
 * @param {Object} updateBody
 * @returns {Promise<Label>}
 */
const updateLabelById = async (labelId, updateBody) => {
  const label = await getLabelById(labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  Object.assign(label, updateBody);
  await label.save();
  return label;
};

/**
 * Delete label by id
 * @param {ObjectId} labelId
 * @returns {Promise<Label>}
 */
const deleteLabelById = async (labelId) => {
  const label = await getLabelById(labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  await label.remove();
  return label;
};

module.exports = {
  createLabel,
  queryLabels,
  getLabelById,
  getLabelByName,
  updateLabelById,
  deleteLabelById,
};
