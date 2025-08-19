class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack="",
        isOperational = true
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null; //it is null because we are not sending any data and throwing error unlike response where we send data
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.isOperational = isOperational;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {ApiError};