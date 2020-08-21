const Answer = require("../../models/answer.model");
const dbHandler = require("../db-handler");

// Required database setup and teardown
beforeAll(async () => await dbHandler.connect());
afterAll(async () => await dbHandler.closeDatabase());

describe("Answer Model saves the correct field types", () => {
  const submittedAnswer = {
    question: {
      questionID: "question_questionID",
      htmlName: "question_htmlName",
    },
    user: {
      userId: "userId123",
    },
    selectedAnswer: "my_selected_answer",
    createdDate: 1594023390039,
  };
  test("Create answer and verify retrieved fields", async (done) => {
    await Answer.create(submittedAnswer);
    const savedAnswerArray = await Answer.find();
    const savedAnswer = savedAnswerArray[0];
    expect(
      savedAnswer.question.questionID === submittedAnswer.question.questionID
    );
    expect(savedAnswer.user.userId === submittedAnswer.user.userId);
    expect(savedAnswer.createdDate === submittedAnswer.createdDate);

    done();
  });
});
