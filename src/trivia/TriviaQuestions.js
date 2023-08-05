import React, { useState, useEffect } from 'react';
import TriviaList from './TriviaList';
import TriviaSearch from './TriviaSearch';

import axios from 'axios';

export default function TriviaQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://tunjietnw4.execute-api.us-east-1.amazonaws.com/questions')
      .then((response) => {
        const transformedQuestions = response.data.map(question => {
          return {
            id: question.id.S,
            AnswerIndex: parseInt(question.AnswerIndex.N, 10),
            Category: question.Category.S,
            Content: question.Content.S,
            DifficultyLevel: question.DifficultyLevel.S,
            Hint: question.Hint.S,
            Options: question.Options.SS,
            Points: parseInt(question.Points.N, 10)
          };
        });

        setQuestions(transformedQuestions);
        setIsLoading(false);
        console.log("questions", transformedQuestions);
      })

      .catch((error) => {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm)
    const searchTermLowerCase = searchTerm.toLowerCase();

    let searchResult = questions.filter(question => 
      question.Category.toLowerCase().includes(searchTermLowerCase) || 
      question.Content.toLowerCase().includes(searchTermLowerCase)
    );
  
    console.log("search result", searchResult);
    setFilteredQuestions(searchResult);
  };

  if (isLoading) {
    return <div>Loading...</div> // Or replace with a loading spinner
  }

  return (
    <div>
      <TriviaSearch onSearch={handleSearch} />
      <TriviaList questions={ searchTerm == "" ? questions : filteredQuestions } /> 
    </div>
  );
};
