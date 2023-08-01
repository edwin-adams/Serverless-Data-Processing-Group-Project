import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button} from "@chakra-ui/react";
import GameStats, {GameData} from "./GameStates";
import {fetchData} from "./service/RestCall";

const Dashboard = () => {

    const [gameData, setGameData] = useState<GameData | null>(null);

    useEffect(() => {
        const GET_userStates = 'https://ca9bktl3k6.execute-api.us-east-1.amazonaws.com/prod?user_id=' + JSON.parse(localStorage.getItem('user')).user_id;
        console.log(GET_userStates);
        fetchData(GET_userStates)
            .then((data) => {
                    console.log(data);
                    setGameData(data);
                }
            )
            .catch((error) => console.error(error));
    }, []);

    return (
        <>
            Logged in
            <Link to="/edituser">
                <Button colorScheme="blue">Edit User</Button>
            </Link>
            <div>
                {gameData ? (
                    <GameStats data={gameData}/>
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </>
    );
}

export default Dashboard;
