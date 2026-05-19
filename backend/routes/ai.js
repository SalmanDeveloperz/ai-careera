const router = require('express').Router();

router.post('/chat', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Missing GOOGLE_API_KEY in backend .env' });
        }
        if (apiKey.includes('YOUR_GOOGLE_API_KEY')) {
            return res.status(500).json({ error: 'Please replace GOOGLE_API_KEY in backend/.env with your actual Google API key.' });
        }

        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request body. Expected { messages: [] }' });
        }

        const promptMessages = messages.map((message) => {
            const role = message.role === 'assistant'
                ? 'ASSISTANT'
                : message.role === 'system'
                    ? 'SYSTEM'
                    : 'HUMAN';
            return {
                role,
                content: message.content,
            };
        });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: { messages: promptMessages },
                    temperature: 0.35,
                    maxOutputTokens: 700,
                    topP: 0.95,
                    candidateCount: 1,
                }),
            }
        );

        const responseText = await response.text();
        let data = null;
        try {
            data = JSON.parse(responseText || '{}');
        } catch (parseError) {
            data = null;
        }
        if (!response.ok) {
            return res.status(response.status).json({ error: data?.error?.message || data?.error || responseText || 'Google Generative Language API error' });
        }

        const output = data?.candidates?.[0]?.output || data?.output || data?.response;
        if (!output) {
            return res.status(500).json({ error: 'No response from Google generative model' });
        }

        return res.json({ choices: [{ message: { content: output } }] });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'AI request failed' });
    }
});

module.exports = router;
