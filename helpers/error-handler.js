module.exports = errorHandler;

function errorHandler(err, req, res, next) {   
    var errorMsg	=	"";
    if (err) {
        switch (err.name) {
            case 'ValidationError':
            for (field in err.errors) {
                switch (err.errors[field].message) {
                case '':
                    errorMsg	+=	"Something went wrong.,";
                    break;
                default:
                    errorMsg	+=	err.errors[field].message.replace('_',' ')+".,"; 
                    break; 
                }
            }
            break;
            case 'MongoError':
            errorMsg	+=	"Duplicate key.";
            default:
            errorMsg	+=	"Something went wrong.,";
        }
    }
    errorMsg.replace(/,+$/,'');
    return res.status(400).json({success: false, msg: errorMsg });
    /* if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ success: false,msg: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({success: false, msg: err.message }); 
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({success: false, msg: 'Invalid Token' });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({success: false, msg: 'Duplicate key' });
      }  */
    // default to 500 server error
   // return res.status(500).json({success: false, msg: err.message });
}