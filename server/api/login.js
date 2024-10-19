import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const filePath = path.join(process.cwd(), 'data', 'users.json');

    let existingData = [];
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(data);
    } catch (error) {
        console.log('Error reading file:', error);
        return { success: false, message: 'Failed to read user data' };
    }

    const user = existingData.find(user => user.username === body.username);

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    if (user.password !== body.password) {
        return { success: false, message: 'Invalid password' };
    }

    return {
        success: true,
        message: 'Login successful',
        userId: user.id,
        activated: user.activated,
    };
});
