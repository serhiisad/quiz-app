import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";

//Components
import QuestionCard from "./components/QuestionCard";
//Types
import { Difficulty, QuestionState } from "./API";
//Styles
import { GlobalStyle, Wrapper } from './App.styles'


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS: number = 10;

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(true);

  console.log(questions);
  //console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY))
  //const data = fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)
  //console.log("DATA", data)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      );
      //TODO page re-renders each time a setter is invoked
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);
      //
    } catch (e) {
      console.error("ERROR retrieving questions");
    }
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //users answer
      const answer = e.currentTarget.value; // get the value from a button
      //check answer against the correct value
      const correct = questions[number].correct_answer === answer;
      //add score if answer is correct 
      if (correct) setScore(prev => prev + 1)
      //save answer in the arrray fro user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject])

    }
  };

  const nextQuestion = () => {
    //move on to the next question if only not the last one.
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  };

  return (
    <>
      <GlobalStyle />
      {/* <div className="App"> */}
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}

        {!gameOver ? <p className="score">Score:{score}</p> : null}
        {loading && <p>Loading Questions ...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 ? (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          ) : null}
        {/* </div> */}
      </Wrapper>
    </>
  );
};

export default App;
