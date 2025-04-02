import { connect } from 'mongoose';
export default async () => {
    try {
        const conn = await connect(process.env.MONGO_URI, {
            autoIndex: process.env.NODE_ENV === 'development',
            maxPoolSize: 100,
            minPoolSize: 10,
            readPreference: 'secondaryPreferred',
            writeConcern: {
                w: 'majority',
                j: true,
                wtimeout: 5000
            },
            retryWrites: true,
            compressors: ['snappy', 'zstd']
        });
        console.log(`MongoDB Connected: ${conn.connection.host} 💚💚💚💚💚💚💚💚💚💚💚💚`);
    } catch (error) {
        console.error(`Error: ${error.message} 😡😡😡😡😡😡😡😡😡😡😡`);
        process.exit(1); // Exit process with failure
    }
};
