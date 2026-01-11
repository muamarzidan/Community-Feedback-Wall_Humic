import { truncateText } from '@/utils/truncateText.js';

export const replaceUserTypeNames = (note) => {
    if (note.userType === 'guest') {
        return "Guest";
    };

    return truncateText(note.author, 16);
};