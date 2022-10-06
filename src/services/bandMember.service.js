const httpStatus = require('http-status');
const { BandMember } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Band Member
 * @param {Object} bandMemberBody
 * @returns {Promise<BandMember>}
 */
const createBandMember = async (bandMemberBody) => {
  return BandMember.create(bandMemberBody);
};

/**
 * Query for Band Members
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBandMembers = async (filter, options) => {
  const bandMembers = await BandMember.paginate(filter, options);
  return bandMembers;
};

/**
 * Get Band Member by id
 * @param {ObjectId} id
 * @returns {Promise<BandMember>}
 */
const getBandMemberById = async (id) => {
  return BandMember.findById(id);
};

/**
 * Update BandMember by id
 * @param {ObjectId} bandMemberId
 * @param {Object} updateBody
 * @returns {Promise<BandMember>}
 */
const updateBandMemberById = async (bandMemberId, updateBody) => {
  const bandMember = await getBandMemberById(bandMemberId);
  if (!bandMember) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Band Member not found');
  }
  Object.assign(bandMember, updateBody);
  await bandMember.save();
  return bandMember;
};

/**
 * Delete Band Member by id
 * @param {ObjectId} bandMemberId
 * @returns {Promise<bandMember>}
 */
const deleteBandMemberById = async (bandMemberId) => {
  const bandMember = await getBandMemberById(bandMemberId);
  if (!bandMember) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Band Member not found');
  }
  await bandMember.remove();
  return bandMember;
};

module.exports = {
  createBandMember,
  queryBandMembers,
  getBandMemberById,
  updateBandMemberById,
  deleteBandMemberById,
};
