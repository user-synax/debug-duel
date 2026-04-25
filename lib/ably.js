// Ably real-time messaging integration
import Ably from 'ably';

export function getAblyServer() {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    throw new Error("ABLY_API_KEY environment variable is not set");
  }
  return new Ably.Rest(key);
}

export function getAblyClient() {
  // Client-side should use token authentication, not the API key directly
  // The token will be fetched from /api/ably-token
  return new Ably.Realtime({
    authUrl: "/api/ably-token",
  });
}
