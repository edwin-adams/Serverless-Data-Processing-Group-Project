import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import GameStats, {GameData} from "./GameStates";
import {deleteData, fetchData} from "./service/RestCall";

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

interface leader {
    user_id: string;
    value: number;
}

const initialLeaderState: leader = {
    user_id: 'user_1',
    value: 0,
};


const Dashboard = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [teamAffiliations, setTeamAffiliations] = useState<Set<string>>(new Set<string>());
    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem('user')));

    const [topScorer, setTopScore] = useState<leader>(initialLeaderState);
    const [topWinLoss, setTopWinLoss] = useState<leader>(initialLeaderState);
    const [topWin, setTopWin] = useState<leader>(initialLeaderState);
    const [topLoss, setTopLoss] = useState<leader>(initialLeaderState);

    const DELETE_khushideletefromteam: string = '';
    const GET_khushiTeamsByUserID: string = '';

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('user')));
        console.log(loggedUser);
        setImageUrl(loggedUser.image_url);
        // const GET_userStates = 'https://ca9bktl3k6.execute-api.us-east-1.amazonaws.com/prod?user_id=' + loggedUser.user_id;
        const GET_mohituserdata = 'https://rv7nzfzjhc.execute-api.ca-central-1.amazonaws.com/Prod/getScore?userId=' + 'user_5'; // loggedUser.user_id


        fetchData(GET_mohituserdata).then((res) => {
            console.log(res);
            calculateWinLossAndTotalScore(res);
        })


        for (let i = 1; i < 10; i++) {
            let GET_mohituserdata2 = 'https://rv7nzfzjhc.execute-api.ca-central-1.amazonaws.com/Prod/getScore?userId=user_' + i;
            fetchData(GET_mohituserdata2).then((res) => {
                console.log(res);
                getAchievements(res);
            })
        }

    }, []);


    const getTeamsByUserId = async () => {
        fetchData(GET_khushiTeamsByUserID + '?user_email=' + loggedUser.email).then((res) => {
            console.log(res);
            setTeamAffiliations(res);
        });
    }

    const getAchievements = (scores: ScoreData[]) => {
        let winCount = 0;
        let lossCount = 0;
        let totalScore = 0;
        let cu_user_id: string = '';
        scores.forEach((score) => {
            if (score.status === 'win') {
                winCount++;
            } else {
                lossCount++;
            }

            totalScore += score.score;
            cu_user_id = score.user_id;
        });
        if (topWin.value < winCount) {
            setTopWin({user_id: cu_user_id, value: winCount})
        }
        if (topLoss.value > lossCount) {
            setTopLoss({user_id: cu_user_id, value: lossCount})
        }
        if (topWinLoss.value < winCount / lossCount) {
            setTopWinLoss({user_id: cu_user_id, value: winCount / lossCount})
        }
        if (topScorer.value < totalScore) {
            setTopScore({user_id: cu_user_id, value: totalScore})
        }
        return {winCount, lossCount, totalScore};
    }

    const handleButtonClick = (team_id: string) => {
        const payload = {
            "user_email": loggedUser.email,
            "team_id": team_id
        }
        deleteData(DELETE_khushideletefromteam, payload).then((res) => {
            console.log(res);
        })
    }


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
                <Flex key={number} align="left">
                    <p>{number}</p> &nbsp;&nbsp;&nbsp;
                    <Button onClick={() => handleButtonClick(number)} mb={2}>Leave Team</Button>
                </Flex>)
            )}

            <Text fontSize="lg" fontWeight="bold" mt={3}>
                Top Achievers
            </Text>

            <Table variant="striped" colorScheme="teal" mb={4}>
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>User ID</Th>
                        <Th>Achievement</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Th>Lowest Loss</Th>
                        <Td>{topLoss.user_id}</Td>
                        <Td>{topLoss.value}</Td>
                    </Tr>
                    <Tr>
                        <Th>Highest Win</Th>
                        <Td>{topWin.user_id}</Td>
                        <Td>{topWin.value}</Td>
                    </Tr>
                    <Tr>
                        <Th> Highest Win/Loss</Th>
                        <Td>{topWinLoss.user_id}</Td>
                        <Td>{topWinLoss.value}</Td>
                    </Tr>
                    <Tr>
                        <Th>Top Scorer</Th>
                        <Td>{topScorer.user_id}</Td>
                        <Td>{topScorer.value}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </>
    )
        ;
}

export default Dashboard;
