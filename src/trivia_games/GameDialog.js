import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import axios from "axios";

const GameDialog = ({ isOpen, onClose }) => {
  const initialState = {
    gameName: "",
    categories: [],
    difficultyLevels: [],
    numQuestions: 0,
  };
  const [currentGame, setCurrentGame] = useState(initialState);
  const [categoriesString, setCategoriesString] = useState("");
  const [difficultyLevelsString, setDifficultyLevelsString] = useState("");

  const resetState = () => {
    setCurrentGame(initialState);
    setCategoriesString("");
    setDifficultyLevelsString("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoriesArray = categoriesString.split(",").map((category) => category.trim());
    const difficultyLevelsArray = difficultyLevelsString.split(",").map((level) => level.trim());

    const gameData = {
      ...currentGame,
      categories: categoriesArray,
      difficultyLevels: difficultyLevelsArray,
    };

    axios.post('https://tunjietnw4.execute-api.us-east-1.amazonaws.com/games', gameData)
      .then((response) => {
        console.log(response.data);
        window.location.reload(); // Reload the page after a successful request
      })
      .catch((error) => {
        console.error(error);
        alert(`An error occurred: ${error.message}`);
      });

    resetState();
    onClose();
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new Game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Game Name</FormLabel>
              <Input
                name="gameName"
                value={currentGame.gameName}
                onChange={(e) => setCurrentGame({ ...currentGame, gameName: e.target.value })}
                placeholder="Game Name"
                mb={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Categories</FormLabel>
              <Input
                name="categories"
                value={categoriesString}
                onChange={(e) => setCategoriesString(e.target.value)}
                placeholder="Categories (separate by commas)"
                mb={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Difficulty Levels</FormLabel>
              <Input
                name="difficultyLevels"
                value={difficultyLevelsString}
                onChange={(e) => setDifficultyLevelsString(e.target.value)}
                placeholder="Difficulty Levels (separate by commas)"
                mb={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Number of Questions</FormLabel>
              <NumberInput
                name="numQuestions"
                value={currentGame.numQuestions}
                onChange={(valueString) => setCurrentGame({ ...currentGame, numQuestions: parseInt(valueString) })}
                placeholder="Number of Questions"
                mb={3}
              >
                <NumberInputField />
              </NumberInput>
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

export default GameDialog;
