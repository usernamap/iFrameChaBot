// src/tests/controllers/authController.test.ts
import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import { SecurityUtils } from '../../utils/security';

describe('Auth Controller', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123!',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            const password = 'Password123!';
            const hashedPassword = await SecurityUtils.hashPassword(password);
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: password,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
    });
});