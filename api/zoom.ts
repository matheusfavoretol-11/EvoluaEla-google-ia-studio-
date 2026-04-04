import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

export async function getZoomAccessToken() {
  if (!ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET || !ZOOM_ACCOUNT_ID) {
    throw new Error('Zoom credentials missing in environment variables');
  }

  const auth = Buffer.from(`${ZOOM_CLIENT_ID.trim()}:${ZOOM_CLIENT_SECRET.trim()}`).toString('base64');
  
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'account_credentials');
    params.append('account_id', ZOOM_ACCOUNT_ID.trim());

    const response = await axios.post(
      'https://zoom.us/oauth/token',
      params,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error('Error getting Zoom access token:', JSON.stringify(errorData || error.message, null, 2));
    
    if (errorData?.error === 'invalid_client') {
      throw new Error('Zoom: Client ID ou Secret incorretos. Verifique suas credenciais no Zoom Marketplace.');
    }
    if (errorData?.error === 'invalid_grant') {
      throw new Error('Zoom: Account ID incorreto ou o App não está ativado no Zoom Marketplace.');
    }
    
    throw error;
  }
}

export async function createZoomMeeting(topic: string, startTime: string, duration: number = 60) {
  const token = await getZoomAccessToken();

  try {
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration,
        timezone: 'America/Sao_Paulo',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          auto_recording: 'cloud',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    throw error;
  }
}
