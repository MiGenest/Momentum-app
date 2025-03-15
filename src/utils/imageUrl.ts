export const fixImageUrl = (url: string): string => {
    return url;
};

export const generateAvatarUrl = (firstName: string, lastName: string) => {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${firstName}.${lastName}`;
}; 