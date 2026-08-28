export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST requests are allowed."
        });
    }

    const { question, difficulty, length } = req.body;

    if (!question) {
        return res.status(400).json({
            error: "Question is empty."
        });
    }

    const systemPrompt = `
You are an AI Python Tutor.

Difficulty: ${difficulty}
Response Length: ${length}

Explain Python clearly for students.
If the question is unrelated to Python,
politely say you specialize in Python.
`;

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: question
                        }
                    ],
                    temperature: 0.5
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: data.error?.message || "Groq API Error"
            });
        }

        return res.status(200).json({
            answer: data.choices[0].message.content
        });

    } catch (error) {

        return res.status(500).json({
            error: "Failed to contact AI."
        });

    }

}
