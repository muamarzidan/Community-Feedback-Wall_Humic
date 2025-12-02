import { format } from 'date-fns';

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatDateRange = (dateRange) => {
    const start = format(dateRange[0].startDate, 'dd MMM yyyy');
    const end = format(dateRange[0].endDate, 'dd MMM yyyy');
    return start === end ? start : `${start} - ${end}`;
};