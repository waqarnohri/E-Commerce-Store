const jwt = require("jsonwebtoken");


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware = (
    req,
    res,
    next
) => {

    try {

        // =============================
        // GET AUTHORIZATION HEADER
        // =============================

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message:
                    "Authorization token is required"

            });

        }


        // =============================
        // CHECK BEARER
        // =============================

        if (
            !authHeader.startsWith(
                "Bearer "
            )
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authorization format"

            });

        }


        // =============================
        // GET TOKEN
        // =============================

        const token =
            authHeader.split(" ")[1];


        // =============================
        // VERIFY TOKEN
        // =============================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =============================
        // SAVE USER DATA
        // =============================

        req.user = decoded;


        // =============================
        // NEXT
        // =============================

        next();


    } catch (error) {

        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"

        });

    }

};


module.exports =
    authMiddleware;