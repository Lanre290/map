import * as AWS from 'aws-sdk'; // Import AWS SDK

declare global {
  interface Window {
    AWS: typeof AWS; // Define AWS on the window object
  }
}

export {};
