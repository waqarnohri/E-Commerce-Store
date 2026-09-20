// =====================================================
// ADMIN MIDDLEWARE
// =====================================================

const adminMiddleware = (
    req,
    res,
    next
) => {

    // =============================
    // CHECK USER
    // =============================

    if (!req.user) {

        return res.status(401).json({

            success: false,

            message:
                "Authentication required"

        });

    }


    // =============================
    // CHECK ADMIN ROLE
    // =============================

    if (
        req.user.role !== "admin"
    ) {

        return res.status(403).json({

            success: false,

            message:
                "Access denied. Admin only."

        });

    }


    // =============================
    // ALLOW ADMIN
    // =============================

    next();

};


module.exports =
    adminMiddleware;