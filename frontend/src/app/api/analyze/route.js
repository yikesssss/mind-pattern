export async function POST(req) {
    try {
        const body = await req.json();

        const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
