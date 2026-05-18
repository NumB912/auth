import rateLimit from "express-rate-limit";

const ratelimiter = rateLimit({
    windowMs:60*1000,
    max:100,
    message:"Quá nhiều request vui lòng thử lại"
})

export default ratelimiter