import axios from 'axios';
import "dotenv/config";

const apiKey = process.env.CN_APIKEY;
const secret = process.env.CN_SECRET;
const trackingUrl = process.env.CN_TRACKING_URL;
const genTokenUrl = process.env.CN_GEN_TOKEN_URL;


async function getToken() {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-apikey': apiKey
    };

    try {
        const response = await axios.post(genTokenUrl, null, {
            headers: headers,
            auth: {
                username: apiKey,
                password: secret
            }
        });

        if (response.status === 200) {
            const token = response.data.access_token;
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        } else {
            console.error(`Failed to fetch data. Status code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching token:', error.message);
        return null;
    }
}

// Function for validate container(s)
function normalizeContainerNumber(ctnr) {
  if (!/^[A-Z]{4}\d{7}$/.test(ctnr)) return ctnr; // validate format
  const prefix = ctnr.slice(0, 4);
  const numeric = ctnr.slice(4); // get 7-digit part
  const stripped = numeric.replace(/^0+/, ""); // remove leading 0s
  const withoutCheckDigit = stripped.slice(0, -1); // remove last digit
  return prefix + withoutCheckDigit;
}

async function tracking(ctnrNums) {
    const headers = await getToken();
    // Check if token is fetched
    if (!headers) {
        return { error: "Failed to fetch the token. Please try again later." };
    }
    //convert container number to single string and comma-separated
    const modifiedCtnrNums = ctnrNums.map(normalizeContainerNumber).join(",");
    


    const trackingParam = {
        equipmentIds: modifiedCtnrNums
    }
    try {
    const response = await axios.get(trackingUrl, { headers, params: trackingParam } );
    // console.log(JSON.stringify(response.data, null, 2));
    return response.data;
    
    } catch(error) {
        console.error('Error fetching tracking data:', error.message);
        return { error: "Error fetching tracking data. Please try again later." };
    }
}

export default tracking;