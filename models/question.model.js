const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const questionSchema = mongoose.Schema({
    questionText: { type: String },
    htmlName: { type: String },
    inputType: { type: String, default: "text" },
    answers: {
        answerOneText: { type: String },
        answerTwoText: { type: String },
        answerThreeText: { type: String },
        answerFourText: { type: String }
    }
});

questionSchema.methods.serialize = () => {
    return {
        id: this._id,
        questionText: this.questionText,
        htmlName: this.htmlName,
        inputType: this.inputType,
        answers: {
            answerOneText: this.answers.answerOneText,
            answerTwoText: this.answers.answerTwoText,
            answerThreeText: this.answers.answerThreeText,
            answerFourText: this.answers.answerFourText
        }
    };
};

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };



