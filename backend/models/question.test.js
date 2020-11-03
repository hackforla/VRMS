const { Question } = require('./question.model');

const { setupDB } = require("../setup-test");
setupDB("question-model");

// Please add and expand on this simple test.
describe("Question Model saves the correct values", () => {
  test("Save a model instance and then read from the db", async (done) => {
    const submittedData = {
      questionText: "Is this a test?",
      htmlName: "html_name_test",
      // inputType: { type: String, default: "text" },
      answers: {
        answerOneText: "test answer one",
        answerTwoText: "test answer two",
        answerThreeText: "test answer three",
        answerFourText: "test answer four",
      },
    };

    await Question.create(submittedData);
    const savedDataArray = await Question.find();
    const savedData = savedDataArray[0];
    expect(savedData.questionText === submittedData.questionText);
    expect(
      savedData.answers.answerOneText === submittedData.answers.answerOneText
    );
    expect(
      savedData.answers.answerThreeText ===
        submittedData.answers.answerThreeText
    );
    done();
  });
});
