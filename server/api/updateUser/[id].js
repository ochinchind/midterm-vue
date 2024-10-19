import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const userId = body.id;

    const filePath = path.join(process.cwd(), 'data', 'users.json');

    let existingData = [];
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(data);
    } catch (error) {
        console.log('Error reading file:', error);
        return { success: false, message: 'Failed to read user data' };
    }

    const userIndex = existingData.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    const updatedUser = {
        ...existingData[userIndex],
        ...body, 
    };

    existingData[userIndex] = updatedUser; 

    try {
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
    } catch (error) {
        console.log('Error writing file:', error);
        return { success: false, message: 'Failed to update user data' };
    }

    return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
    };
});
