import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import axios from 'axios';
import logger from '@/lib/logger';

// Add a utility function to sanitize sensitive data for logging
function sanitizeErrorForLogging(error, sensitiveKeys = ['X-Auth-Token', 'authToken']) {
  if (!error) return 'Unknown error';

  // Handle axios errors
  if (error.response) {
    const sanitizedResponse = { ...error.response };
    if (sanitizedResponse.config) {
      // Remove sensitive headers
      sanitizedResponse.config = {
        ...sanitizedResponse.config,
        headers: Object.fromEntries(
          Object.entries(sanitizedResponse.config.headers || {}).map(([key, value]) => [
            key,
            sensitiveKeys.includes(key) ? '[REDACTED]' : value
          ])
        )
      };
    }
    return sanitizedResponse;
  }

  // Handle regular errors
  return error.message || 'Unknown error';
}

export async function POST(request) {
  try {
    logger.info('Starting CSV processing');
    const { storeHash, authToken, fileContent } = await request.json();

    if (!storeHash || !authToken || !fileContent) {
      logger.warn('Missing required fields in request');
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
        logger.info(`Successfully added subscriber`, {
          email: subscriber.email,
          status: response.status
        });
      } catch (error) {
        logger.error(`Failed to add subscriber`, {
          email: subscriber.email,
          error: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            details: error.response?.data
          }
        });
        
        // Sanitize error before adding to results
        const sanitizedError = error.response ? 
          sanitizeErrorForLogging(error.response) : 
          error.message;
          
        results.push({ 
          email: subscriber.email, 
          error: sanitizedError
        });
      }
    }

    logger.info('CSV processing completed', { totalProcessed: results.length });
    return NextResponse.json({ message: 'All requests processed.', results });
  } catch (error) {
    logger.error('Critical error during CSV processing', {
      error: sanitizeErrorForLogging(error)
    });
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
