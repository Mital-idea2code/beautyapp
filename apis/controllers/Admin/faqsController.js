const Faqs = require("../../models/Faqs");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");

//Add FAQs
const addfaqs = async (req, res, next) => {
  try {
    const { question, answer, role } = req.body;
    const newFaqs = await Faqs.create({
      question,
      answer,
      role,
    });
    const result = await newFaqs.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get All FAQs
const getAllFaqs = async (req, res, next) => {
  try {
    const faq = await Faqs.find();
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");
    successResponse(res, faq);
  } catch (err) {
    next(err);
  }
};

//Update FAQs
const updateFaq = async (req, res, next) => {
  try {
    const { question, answer, role } = req.body;
    const faqs = await Faqs.findById(req.params.id);
    if (!faqs) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    faqs.question = question;
    faqs.answer = answer;
    faqs.role = role;
    const result = await faqs.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update FAQs Status
const updateFaqStatus = async (req, res, next) => {
  try {
    // Convert string is into Object id
    const id = req.params.id;
    const faq = await Faqs.findById(id);
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    faq.status = !faq.status;
    const result = await faq.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single FAQ
const deletefaq = async (req, res, next) => {
  try {
    const id = req.params.id;
    const faq = await Faqs.findById(id);
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    await Faqs.deleteOne({ _id: id });
    deleteResponse(res, "FAQ deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple FAQs
const deleteMultFaq = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const id = new mongoose.Types.ObjectId(item);
      await Faqs.deleteOne({ _id: id });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

module.exports = { addfaqs, getAllFaqs, updateFaq, updateFaqStatus, deleteMultFaq, deletefaq };
