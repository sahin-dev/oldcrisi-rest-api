import { registerAs } from "@nestjs/config"

const stripeConfig = ()=> ({
    stripe_key:process.env.STRIPE_KEY
})

export default registerAs("stripe", stripeConfig)