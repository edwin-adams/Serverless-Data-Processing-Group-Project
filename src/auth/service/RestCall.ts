async function fetchData(apiUrl: string) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function postData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        console.log(response);

        if (!response.ok) {
            console.log(response);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function patchData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = (await response.json())['user'];
        return data;
    } catch (error) {
        throw error;
    }
}

async function deleteData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'DELETE',
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function putData(apiUrl: string, payload: any) {
    try {
        const response = await fetch(`${apiUrl}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("Response from ", `${apiUrl}`, response);
        return response;
    } catch (error) {
        throw error;
    }
}

export {fetchData, postData, patchData, deleteData, putData};
