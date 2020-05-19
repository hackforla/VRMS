const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const answerSchema = mongoose.Schema({
    question: {                                          
        questionId: { type: String },
        htmlName: { type: String }
    },
    user: { 
        userId: { type: String }
    },
    selectedAnswer: { type: String },
    createdDate: { type: Date, default: Date.now }
});

questionSchema.methods.serialize = function() {
    return {
        id: this._id,
        question: {                                          
            questionID: this.question.questionId,
            htmlName: this.question.htmlName 
        },
        user: {
            userId: this.user.userId
        },
        selectedAnswer: this.selectedAnswer,
        createdDate = this.createdDate
    };
};

const Answer = mongoose.model('Answer', answerSchema);

module.exports = { Answer };