import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pageDetails = {
  '/business/dashboard': 'A business dashboard that shows business analytics, transactions, and the details of the business',
  '/invoice/:id': 'will need to provide an invoice number then it will show the details of the invoice. The invoice ID format is INV followed by numbers (e.g., INV20250013)',
  '/payment/start': 'a payment page, redirect to /payment/start for the payment flow',
};

const systemPrompt = `You are a helpful assistant for a website. Your goal is to help users navigate to the correct page based on their request.
Here are the available pages and their descriptions:
- /business/dashboard: ${pageDetails['/business/dashboard']}
- /invoice/{id}: ${pageDetails['/invoice/:id']}
- /payment/start: ${pageDetails['/payment/start']}

Your task is to identify the user's intent and respond with a helpful message and a button to redirect them.

You MUST respond in a JSON format with the following structure:
{
  "reply": "Your textual response to the user.",
  "buttons": [
    {
      "text": "Text for the button",
      "url": "/path/to/page"
    }
  ]
}

- If you identify a clear intent for a page that doesn't require an ID (like dashboard or payment), provide a direct link in the button's 'url'.
- If the user wants to see an invoice and provides an ID in their message, construct the URL (e.g., /invoice/INV20250013) and put it in the button's 'url'.
- If the user wants to see an invoice but does NOT provide an ID, your 'reply' should ask for the invoice ID, and the 'buttons' array should be empty.
- If you cannot understand the user's intent, provide a generic helpful response and an empty 'buttons' array. The reply should suggest what you can help with.
- The 'text' in the button should be descriptive, e.g., 'Go to Dashboard'.
- Be friendly and conversational.
`;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        response_format: { type: 'json_object' },
      });

      const assistantResponse = completion.choices[0].message.content;
      const responseJson = JSON.parse(assistantResponse);

      res.status(200).json(responseJson);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      res.status(500).json({
        reply: "Sorry, I'm having some trouble thinking right now. Please try again later.",
        buttons: [],
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}