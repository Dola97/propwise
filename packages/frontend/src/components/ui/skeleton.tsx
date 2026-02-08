export function TableSkeleton({
    rows = 5,
    cols = 5,
}: {
    rows?: number;
    cols?: number;
}) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {Array.from({ length: cols }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded bg-gray-200" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
