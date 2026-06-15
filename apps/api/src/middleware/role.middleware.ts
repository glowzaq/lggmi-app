import { Request, Response, NextFunction } from "express";

export const restrictTo = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({
                message: 'You are not logged in',
                status: 'error',
            })
            
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                message: 'You do not have permission to perform this action',
                status: 'error',
            })

            return;
        }

        next();
    }
}