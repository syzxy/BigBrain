/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  return {
      ...question,
      options: question.options.map(q => ({ content: q.content })),
  }
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const answers = [];
  question.options.forEach((opt, i) => {
    if (opt.isAnswer) {
        answers.push(i);
    }
  });
  return answers;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
 Use indices as answer ids as there's no obvious bonus to assign a globally
 unique Id for each option for a question
*/
export const quizQuestionGetAnswers = question => {
  return [...Array(question.options.length).keys()]
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time;
};
