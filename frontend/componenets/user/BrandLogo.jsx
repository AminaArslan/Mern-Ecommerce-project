export default function BrandLogo({ size = 48, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="24" cy="24" r="23" fill="#111827" stroke="#fbbf24" strokeWidth="1.5" />
            <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="font-serif italic text-2xl font-bold fill-amber-400"
            >
                A
            </text>
        </svg>
    );
}
