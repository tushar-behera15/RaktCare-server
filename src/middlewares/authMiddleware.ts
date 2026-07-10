import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const validate =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const errors = error.issues.reduce((acc, issue) => {
                        const field = issue.path.join(".");
                        acc[field] = issue.message;
                        return acc;
                    }, {} as Record<string, string>);

                    return res.status(400).json({
                        success: false,
                        message: "Validation failed.",
                        errors,
                    });
                }

                next(error);
            }
        };

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is missing.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};