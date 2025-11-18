export function useFormattedDate() {
    function formatDate(dateString: string) {
        if (!dateString) return '';

        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(dateString));
    }

    return { formatDate };
}
