import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import axios from 'axios';

export async function POST(request) {
  try {
    const { storeHash, authToken, fileContent } = await request.json();

    if (!storeHash || !authToken || !fileContent) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const apiEndpoint = `https://api.bigcommerce.com/stores/${storeHash}/v3/customers/subscribers`;
    const apiHeaders = {
      'X-Auth-Token': authToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Parse CSV from string
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const subscribers = [];

    for (const row of records) {
      // Check for required fields
      const email = row['Email'];
      const first_name = row['First Name'];

      if (!email || !first_name) {
        // Skip this record since required fields are missing
        continue;
      }

      const subscriber = {
        email,
        first_name,
      };

      // Add optional fields only if they exist and are not empty
      if (row['Last Name'] && row['Last Name'].trim() !== '') {
        subscriber.last_name = row['Last Name'];
      }

      if (row['Source'] && row['Source'].trim() !== '') {
        subscriber.source = row['Source'];
      }

      if (row['Channel ID'] && row['Channel ID'].trim() !== '') {
        const channelId = parseInt(row['Channel ID'], 10);
        if (!isNaN(channelId)) {
          subscriber.channel_id = channelId;
        }
      }

      subscribers.push(subscriber);
    }

    const results = [];
    for (const subscriber of subscribers) {
      try {
        const response = await axios.post(apiEndpoint, subscriber, { headers: apiHeaders });
        results.push({ email: subscriber.email, status: response.status });
      } catch (error) {
        results.push({ 
          email: subscriber.email, 
          error: error.response ? error.response.data : error.message 
        });
      }
    }

    return NextResponse.json({ message: 'All requests processed.', results });
  } catch (error) {
    console.error('Critical error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
