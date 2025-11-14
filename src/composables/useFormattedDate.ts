export function useFormattedDate() {
    function formatDate(dateString: string, timezone: string, showTime = false) {
        if (!dateString || !timezone) return '';

        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: timezone,
        }).format(new Date(dateString));
    }

    return { formatDate };
}
