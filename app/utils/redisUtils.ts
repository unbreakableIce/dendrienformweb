import redis from "./connection";

export const clearPurposeStatement = async (userId: string) => {
	await redis.del(`m3p1#${userId}`);
};

export const clearLifePurpose = async (userId: string) => {
	await redis.del(`m4p1#${userId}`);
	await redis.del(`m4p2#${userId}`);
	await redis.del(`m4p3#${userId}`);
	await redis.del(`m4p4#${userId}`);
	await redis.del(`m4p5#${userId}`);
	await redis.del(`m4p6#${userId}`);
};
