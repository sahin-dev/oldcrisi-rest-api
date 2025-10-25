import { registerAs } from "@nestjs/config"

export const firebaseConfig = () => {
    return {
        
    }
}

export default registerAs("firebase", firebaseConfig)