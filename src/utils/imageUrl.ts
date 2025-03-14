export const fixImageUrl = (url: string): string => {
    if (!url) return '';
    
    // If the URL contains a double URL pattern, extract the placeholder URL
    if (url.includes('/storage/https://')) {
        return url.split('/storage/')[1];
    }
    
    return url;
};

export const generateAvatarUrl = (firstName: string, lastName: string): string => {
    // Using the full name as a seed to generate consistent avatars for the same person
    const seed = `${firstName} ${lastName}`.trim();
    // Using DiceBear's "avataaars" style with a custom background color
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=8338EC`;
}; 