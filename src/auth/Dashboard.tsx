import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Box, Button} from "@chakra-ui/react";
import GameStats, {GameData} from "./GameStates";
import {fetchData} from "./service/RestCall";

const Dashboard = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        console.log(loggedUser);
        setImageUrl(loggedUser.image_url);
        // const GET_userStates = 'https://ca9bktl3k6.execute-api.us-east-1.amazonaws.com/prod?user_id=' + loggedUser.user_id;
        const GET_mohituserdata = 'https://rv7nzfzjhc.execute-api.ca-central-1.amazonaws.com/Prod/getScore?userId=' + 'user_5'; // loggedUser.user_id

        // console.log(GET_userStates);
        // fetchData(GET_userStates)
        //     .then((data) => {
        //             console.log(data);
        //             setGameData(data);
        //         }
        //     )
        //     .catch((error) => console.error(error));
        fetchData(GET_mohituserdata).then((res) => {
            console.log(res);
            // setGameData(data);
        })
    }, []);

    return (
        <>
            Logged in {loggedUser.email}
            <br/>
            Hi {loggedUser.first_name} {loggedUser.last_name}
            <Box textAlign="left" mt={2} mb={2}>
                <Avatar size="md" src={imageUrl}/>
            </Box>
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
