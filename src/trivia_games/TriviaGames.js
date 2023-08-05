import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GamesList from './GamesList';
import GamesSearch from './GamesSearch'; 
import CreateGamesButton from './CreateGameButton';
import GameDialog from './GameDialog'; // Ensure you have a GameDialog component
import Button from '@chakra-ui/react'; // Make sure to import Button if you're using it

export default function TriviaGamesPage() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    axios
      .get('https://tunjietnw4.execute-api.us-east-1.amazonaws.com/games')
      .then((response) => {
        setGames(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching games:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    const searchTermLowerCase = searchTerm.toLowerCase();

    let searchResult = games.filter(game => 
    //   game.category.toLowerCase().includes(searchTermLowerCase) || 
      game.gameName.toLowerCase().includes(searchTermLowerCase)
    );

    setFilteredGames(searchResult);
  };

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleClickCreate = () => {
    setSelectedGame(null); // Set selectedGame to null for creation mode
    handleClickOpen();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CreateGamesButton handleClickOpen={handleClickOpen} />
      <GamesSearch onSearch={handleSearch} />
      <GamesList games={searchTerm === "" ? games : filteredGames} />
      <GameDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        selectedGame={selectedGame}
        // Add any other props needed for the dialog
      />
    </div>
  );
}
