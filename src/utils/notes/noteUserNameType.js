export const getUserTypeDisplay = (note) => {
    switch (note.userType) {
    case 'you':
        return '(You)';
    case 'guest':
        return '';
    case 'people':
        return '';
    default:
        return '';
    };
};