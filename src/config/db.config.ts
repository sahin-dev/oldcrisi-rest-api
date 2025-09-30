

export const dbConfig=()=>{ 
    return {
        url: process.env.MONGO_URI || 'mongodb://localhost:27017/oldcrisis',
    }
}
