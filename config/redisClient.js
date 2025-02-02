import { createClient } from "redis";

// Validate environment variables
if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  console.error("❌ Missing Redis host or port in environment variables.");
  process.exit(1);
}

// Create Redis client
const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD || undefined, // Optional authentication
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Exponential backoff
  },
});

// Event listeners for Redis client
client.on("connect", () => console.log("✅ Connected to Redis"));
client.on("error", (err) => console.error("❌ Redis error:", err));
client.on("reconnecting", () => console.log("♻️ Reconnecting to Redis..."));
client.on("ready", async () => {
  console.log("🚀 Redis client is ready");

  // Set LRU cache eviction policy
  try {
    await client.configSet("maxmemory-policy", "allkeys-lru");
    console.log("🔧 LRU cache eviction policy applied");
  } catch (error) {
    console.error("⚠️ Failed to set LRU policy:", error);
  }
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    process.exit(1);
  }
})();

export default client;
