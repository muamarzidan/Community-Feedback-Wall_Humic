export const formatReactionCount = (count) => {
    if (count >= 1000000) {
        const millions = count / 1000000;
        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
    };
    if (count >= 1000) {
        const thousands = count / 1000;
        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
    };
    return count.toString();
};