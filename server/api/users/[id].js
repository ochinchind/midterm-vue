import { promises as fs } from 'fs';
import path from 'path';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;

    const filePath = path.join(process.cwd(), 'data', 'users.json');
    let existingData = [];
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(data);
    } catch (error) {
        console.log('Error reading file:', error);
        return { success: false, message: 'Failed to read user data' };
    }

    const user = existingData.find(user => user.id === parseInt(id));

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    return { success: true, user };
});
