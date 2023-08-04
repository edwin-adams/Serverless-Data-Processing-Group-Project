import {postData} from "../../auth/service/RestCall";

interface data {
    email: string;
    message: string;
}

export const callCloudFunction = async (my_data: data) => {
    try {
        const response = await postData('https://northamerica-northeast1-serverless-5410-388502.cloudfunctions.net/createTopicAndPublishData', my_data);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error calling Cloud Function:', error);
    }
};