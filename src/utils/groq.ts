import Groq from "groq-sdk"

const GROQ_API_URL = import.meta.env.VITE_GROQ

const groq = new Groq({
  apiKey: GROQ_API_URL,
  dangerouslyAllowBrowser: true,
})

export const requestToGroqAI = async (prompt: string) => {
    const res = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama3-8b-8192",
    })
    return res.choices[0].message.content
}