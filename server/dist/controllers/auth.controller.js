"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const zod_1 = require("zod");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const userExists = await user_model_1.User.findOne({ email: validatedData.email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, salt);
        const user = await user_model_1.User.create({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
        });
        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id.toString()),
                },
            });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: error.issues[0].message });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const user = await user_model_1.User.findOne({ email: validatedData.email });
        if (user && (await bcryptjs_1.default.compare(validatedData.password, user.password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id.toString()),
                },
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: error.issues[0].message });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.login = login;
