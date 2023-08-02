import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Box, Button, VStack, Text} from "@chakra-ui/react";
import GameStats, {GameData} from "./GameStates";
import {fetchData} from "./service/RestCall";

interface ScoreData {
    startTime: number;
    user_id: string;
    category: string;
    score: number;
    team_id: string;
    status: string;
    id: string;
    game_id: string;
}

const Dashboard = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [teamAffiliations, setTeamAffiliations] = useState<Set<string>>(new Set<string>());
    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        console.log(loggedUser);
        setImageUrl(loggedUser.image_url);
        // const GET_userStates = 'https://ca9bktl3k6.execute-api.us-east-1.amazonaws.com/prod?user_id=' + loggedUser.user_id;
        const GET_mohituserdata = 'https://rv7nzfzjhc.execute-api.ca-central-1.amazonaws.com/Prod/getScore?userId=' + 'user_5'; // loggedUser.user_id


        fetchData(GET_mohituserdata).then((res) => {
            console.log(res);
            console.log(calculateWinLossAndTotalScore(res));
            // setGameData(data);
        })
    }, []);
    const calculateWinLossAndTotalScore = (scores: ScoreData[]) => {
        let winCount = 0;
        let lossCount = 0;
        let totalScore = 0;
        let totalGames = 0;

        const uniqueNumbersSet: Set<string> = new Set<string>();


        scores.forEach((score) => {
            if (score.status === 'win') {
                winCount++;
            } else {
                lossCount++;
            }

            totalScore += score.score;
            totalGames += 1;
            uniqueNumbersSet.add(score.team_id);
        });

        setGameData({
            win: winCount,
            loss: lossCount,
            "total points earned": totalScore,
            "games played": totalGames
        });


        setTeamAffiliations(uniqueNumbersSet);

        return {winCount, lossCount, totalScore};
    };

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
            <Text fontSize="lg" fontWeight="bold">
                Team Affiliations
            </Text>

            {Array.from(teamAffiliations).map((number: string) => (
                <Text key={number}>{number}</Text>
            ))}
        </>
    );
}

export default Dashboard;
