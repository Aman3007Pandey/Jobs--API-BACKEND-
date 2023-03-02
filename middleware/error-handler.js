const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode:err.statusCode||StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.msg||'Something went wrong.Please try again later.'
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if(err.code && err.code===11000)
  {
     customError.msg=`Duplicate value entered for the ${err.keyValue}.please enter a diffrent value .`
     customeError.StatusCodes=400;

  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customeError.statuscodes).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
