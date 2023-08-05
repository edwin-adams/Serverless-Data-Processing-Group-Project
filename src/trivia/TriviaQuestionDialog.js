import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Select, Textarea, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";


const TriviaQuestionDialog = ({ isOpen, onClose, isEditing, editingQuestion }) => {
  const initialState = {
    id: "",
    Category: "",
    Content: "",
    DifficultyLevel: "",
    AnswerIndex: ""
  };
  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [optionsString, setOptionsString] = useState("");
  
  const resetState = () => {
    setCurrentQuestion(initialState);
    setOptionsString("");
  };

  
  useEffect(() => {
    if (editingQuestion) {
      setCurrentQuestion(editingQuestion);
      setOptionsString(editingQuestion.Options.join(', '));
    }
  }, [editingQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const optionsArray = optionsString.split(',').map(option => option.trim());
  
    const questionData = {
      ...currentQuestion,
      Options: optionsArray,
    };
  
    const url = isEditing
      ? `https://tunjietnw4.execute-api.us-east-1.amazonaws.com/questions/${currentQuestion.id}`
      : 'https://tunjietnw4.execute-api.us-east-1.amazonaws.com/questions';
  
    const method = isEditing ? 'PUT' : 'POST';
  
    axios({
      method: method,
      url: url,
      data: questionData,
    })
      .then(response => {
        console.log(response.data);
        // Reload the page after successful request
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        alert(`An error occurred: ${error.message}`);
      });
  
    //reset the form fields
    setCurrentQuestion({
      id: "",
      Category: "",
      Content: "",
      DifficultyLevel: "",
      AnswerIndex: ""
    });
    setOptionsString("");
    onClose();
  };;

  const handleCancel = () => {
    resetState(); //empty form fields
    onClose();
  };

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>{isEditing ? "Edit Question" : "Create a new Question"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                name="Category"
                value={currentQuestion.Category}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, Category: e.target.value })}
                placeholder="Category"
                mb={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea
                name="Content"
                value={currentQuestion.Content}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, Content: e.target.value })}
                placeholder="Content"
                mb={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Difficulty Level</FormLabel>
              <Select
                name="DifficultyLevel"
                value={currentQuestion.DifficultyLevel}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, DifficultyLevel: e.target.value })}
                placeholder="Difficulty Level"
                mb={3}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Answer Index</FormLabel>
              <NumberInput
                name="AnswerIndex"
                value={currentQuestion.AnswerIndex}
                onChange={(valueString) => setCurrentQuestion({ ...currentQuestion, AnswerIndex: parseInt(valueString) })}
                placeholder="Answer Index"
                mb={3}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Options</FormLabel>
              <Input
                name="Options"
                value={optionsString}
                onChange={(e) => setOptionsString(e.target.value)}
                placeholder="Options (separate by commas)"
                mb={3}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TriviaQuestionDialog;
