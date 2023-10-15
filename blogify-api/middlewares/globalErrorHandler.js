const globalErrorHandler=(err,req,res,next)=>{
    const status=err?.status?err?.status:'failed'
    const message=err?.message
    const stack=err?.stack

    res.status(500).json({
        status,
        message,
        stack
    })
}

const not_found_url=(req,res,next)=>{
    const err=new Error(`cannot find ${req.originalUrl} on the server`);
    next(err);//this will pass this error to the next middleware which is error handling middleware
}

module.exports={globalErrorHandler,not_found_url}