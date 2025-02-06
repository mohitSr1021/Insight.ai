const Spinner: React.FC<{ size?: "small" | "medium" | "large" }> = ({ size = "medium" }) => {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12",
    };

    return (
        <div
            className={`${sizeClasses[size]} relative rounded-full animate-spin`}
            style={{
                borderWidth: "4px",
                borderStyle: "solid",
                borderImageSource: "linear-gradient(to right, #eef2ff, #e0e7ff)",
                borderImageSlice: 1,
            }}
        ></div>
    );
};

export default Spinner;
