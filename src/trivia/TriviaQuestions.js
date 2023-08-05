import React, { useState, useEffect } from 'react';
import TriviaList from './TriviaList';
import TriviaSearch from './TriviaSearch';
import TriviaQuestionDialog from './TriviaQuestionDialog';
import CreateQuestionButton from './CreateQuestionButton';


import axios from 'axios';

export default function TriviaQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  //open dialog
  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  // const handleEditClick = (question) => {
  //   setCurrentQuestion(question);
  //   setDialogOpen(true);
  //   setIsEditing(true);
  // };

  const handleClose = () => {
    setIsDialogOpen(false); // <-- Function to close dialog
  };

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleClickEdit = (question) => {
    setSelectedQuestion(question);
    setIsDialogOpen(true);
    setIsEditing(true);
  };

  const handleSaveQuestion = (updatedQuestion) => {
    const url = isEditing
      ? `https://your-api.com/editQuestion/${selectedQuestion.id}`
      : `https://your-api.com/createQuestion`;

    const httpMethod = isEditing ? "put" : "post";

    axios[httpMethod](url, updatedQuestion)
      .then((response) => {
        console.log(
          isEditing ? "Question updated successfully!" : "Question created successfully!",
          response
        );
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error sending form data:", error);
      });
  };


  if (isLoading) {
    return <div>Loading...</div> // Or replace with a loading spinner
  }

  return (
    <div>
      <CreateQuestionButton handleClickOpen={handleClickOpen} />
      <TriviaSearch onSearch={handleSearch} />
      <TriviaList questions={ searchTerm == "" ? questions : filteredQuestions } 
        onEdit={handleClickEdit}
      /> 
      <TriviaQuestionDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        editingQuestion={selectedQuestion}
        onSave={handleSaveQuestion}
        isEditing={isEditing}
      />
    </div>
  );
};
