export function allowRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Avtorizatsiyadan o'tmagansiz"
            })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Bu amal uchun ruxsatingiz yo'q"
            })
        }

        next()
    }
}