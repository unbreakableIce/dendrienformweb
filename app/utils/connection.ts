import Redis from "ioredis";

const redis = new Redis(
	"redis://default:4056d9bcb7f246b5ab89e3871a7ae260@us1-cunning-cougar-38621.upstash.io:38621"
);
// const redis = new Redis({
// 	port: 6380, // Redis port
// 	host: "127.0.0.1", // Redis host
// 	db: 0, // Defaults to 0
// });

redis.on("error", (err) =>
	console.log("We couldn't connect to your redis database")
);

export default redis;
