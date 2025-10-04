import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Story {
  id: number;
  date: string;
  questions: string[];
  answers: string[];
  blogPost?: string;
  generatedAt?: string;
}

function buildStoryContext(stories: Story[]): string {
  if (!stories || stories.length === 0) {
    return "No previous stories have been captured yet.";
  }

  let context = "Here are the family stories that have been previously captured:\n\n";

  stories.forEach((story, index) => {
    context += `Story ${index + 1} (from ${new Date(story.date).toLocaleDateString()}):\n`;

    if (story.blogPost) {
      context += `${story.blogPost}\n\n`;
    } else {
      story.questions.forEach((question, qIndex) => {
        if (story.answers[qIndex]) {
          context += `Q: ${question}\nA: ${story.answers[qIndex]}\n\n`;
        }
      });
    }
    context += "---\n\n";
  });

  return context;
}

export async function POST(request: NextRequest) {
  let messages: Message[] = [];
  let stories: Story[] = [];

  try {
    const body = await request.json();
    messages = body.messages;
    stories = body.stories || [];

    // Build context from all stories
    const storyContext = buildStoryContext(stories);

    // Check if API key is provided
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Return a mock response if no API key is set
      return NextResponse.json({
        message: generateMockResponse(messages, stories)
      });
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const systemPrompt = `You are a kind story teller that tries to preserve family memories. You listen warmly and ask thoughtful follow-up questions to help people remember and share their family stories. You're empathetic, patient, and skilled at drawing out details that make memories vivid.

IMPORTANT: You have access to previously captured family stories below. When the user asks you questions about their past (like "how was your childhood?", "tell me about my family", etc.), you MUST actively recall and share the relevant stories from the captured memories. Act as if YOU are the family member recalling these memories - speak in first person and retell the stories naturally.

${storyContext}

INSTRUCTIONS:
- When asked about childhood, family, traditions, or past events, search through the stories above and retell the relevant memories as if you're sharing them personally
- Quote specific details from the captured stories to make your responses authentic
- If a story exists about what they're asking, share it! Don't just ask follow-up questions
- Connect related memories together to paint a fuller picture
- Only ask for new stories if there's nothing captured about that topic yet
- Speak warmly and nostalgically, as if reminiscing about cherished memories`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Error in chat:', error);

    // Fallback to mock response on error (body already parsed above)
    return NextResponse.json({
      message: generateMockResponse(messages, stories),
      warning: 'Used fallback response (API error)'
    });
  }
}

function generateMockResponse(messages: Message[], stories: Story[]): string {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  const hasStories = stories && stories.length > 0;

  // Check conversation context - if previous message was from assistant
  const previousMessage = messages.length > 2 ? messages[messages.length - 2].content.toLowerCase() : '';
  const isFollowUp = lastMessage.includes('yes') || lastMessage.includes('tell me more') ||
                     lastMessage.includes('continue') || lastMessage.includes('more about');

  // If user is asking for more details and we have context
  if (isFollowUp && previousMessage.includes('would you like to hear more')) {
    if (hasStories) {
      // Find any story to elaborate on
      for (const story of stories) {
        for (let i = 0; i < story.answers.length; i++) {
          if (story.answers[i] && story.answers[i].length > 50) {
            return `Let me tell you more... ${story.answers[i]}. Those memories really stayed with me. Is there a particular aspect you'd like to explore further?`;
          }
        }
      }
    }
    return "I'd love to share more, but I'm having trouble recalling the details right now. What specific aspect would you like me to tell you about?";
  }

  // Try to find relevant story content based on keywords
  if (hasStories && (lastMessage.includes('childhood') || lastMessage.includes('young') || lastMessage.includes('how was'))) {
    // Look for childhood-related answers
    for (const story of stories) {
      const childhoodIndex = story.questions.findIndex(q =>
        q.toLowerCase().includes('childhood') || q.toLowerCase().includes('home')
      );
      if (childhoodIndex >= 0 && story.answers[childhoodIndex]) {
        return `Ah, my childhood... ${story.answers[childhoodIndex]}. Those were such formative years. Would you like to hear more about that time?`;
      }
    }
  }

  if (hasStories && (lastMessage.includes('family') || lastMessage.includes('parent') || lastMessage.includes('mother') || lastMessage.includes('father'))) {
    // Look for family-related answers
    for (const story of stories) {
      const familyIndex = story.questions.findIndex(q =>
        q.toLowerCase().includes('parent') || q.toLowerCase().includes('family')
      );
      if (familyIndex >= 0 && story.answers[familyIndex]) {
        return `When I think about my family... ${story.answers[familyIndex]}. They shaped who I am in so many ways. What would you like to know more about?`;
      }
    }
  }

  if (hasStories && (lastMessage.includes('tradition') || lastMessage.includes('value'))) {
    // Look for tradition-related answers
    for (const story of stories) {
      const traditionIndex = story.questions.findIndex(q =>
        q.toLowerCase().includes('tradition') || q.toLowerCase().includes('value')
      );
      if (traditionIndex >= 0 && story.answers[traditionIndex]) {
        return `The traditions we hold dear... ${story.answers[traditionIndex]}. These are the things that truly matter.`;
      }
    }
  }

  // If we have stories but no specific match, share a random memory
  if (hasStories && (lastMessage.includes('tell me') || lastMessage.includes('story') || lastMessage.includes('remember'))) {
    for (const story of stories) {
      for (let i = 0; i < story.answers.length; i++) {
        if (story.answers[i] && story.answers[i].length > 30) {
          return `I remember when ${story.answers[i]}. That's a memory I cherish.`;
        }
      }
    }
  }

  // Default responses
  if (lastMessage.includes('childhood') || lastMessage.includes('young')) {
    return "What a wonderful question! Childhood moments are so precious. Can you tell me more about the people who were part of that time? What do you remember most vividly about them?";
  } else if (lastMessage.includes('family') || lastMessage.includes('parent') || lastMessage.includes('grandparent')) {
    if (hasStories) {
      return "Family connections are truly special. I can see you've already shared some beautiful memories. I'd love to hear more about that. What traditions or values did they pass down to you that you still carry with you today?";
    }
    return "Family connections are truly special. I'd love to hear more about that. What traditions or values did they pass down to you that you still carry with you today?";
  } else if (lastMessage.includes('tradition') || lastMessage.includes('holiday')) {
    return "Traditions have such a beautiful way of connecting generations. How did this tradition make you feel? Are there specific moments from these celebrations that stand out in your memory?";
  } else {
    return "Thank you for sharing that with me. These stories are so important to preserve. What aspect of your life would you like to explore together?";
  }
}
