import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button} from "@chakra-ui/react";
import GameStats, {GameData} from "./GameStates";
import {fetchData} from "./service/RestCall";
import {UserModel} from "./user.model";

const Dashboard = () => {
    const [loggedUser, setLoggedUser] = useState<UserModel>();
    const [gameData, setGameData] = useState<GameData | null>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const GET_userStates = 'https://ca9bktl3k6.execute-api.us-east-1.amazonaws.com/prod?user_id=' + user.user_id;
        console.log(GET_userStates);
        setLoggedUser(user);
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
            Logged in {loggedUser.email}
            <br/>
            Hi {loggedUser.first_name} {loggedUser.last_name}
            <div>
                <Link to="/edituser">
                    <Button colorScheme="blue">Update Profile</Button>
                </Link>
            </div>
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
