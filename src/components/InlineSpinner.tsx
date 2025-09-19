const InlineSpinner = () => (
    <span
        className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin align-middle ml-2"
        role="status"
        aria-label="loading"
    />
);

export default InlineSpinner;