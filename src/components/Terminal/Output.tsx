export default function Output({ history }: { history: string[] }) {
    return (
        <div className="whitespace-pre-wrap mb-2">
            {history.map((line, i) => (
                <p key={i}>{line}</p>))}
        </div>
    );
}