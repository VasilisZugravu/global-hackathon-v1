import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  let questions: string[] = [];
  let answers: string[] = [];

  try {
    const body = await request.json();
    questions = body.questions;
    answers = body.answers;

    // Check if API key is provided
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Return a mock response if no API key is set
      return NextResponse.json({
        blogPost: generateMockBlogPost(questions, answers)
      });
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    // Create a prompt from the interview
    const prompt = createPrompt(questions, answers);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a skilled writer who transforms interview conversations into beautiful, heartfelt blog posts that preserve family memories. Write in a warm, nostalgic tone that captures the essence of the storyteller's voice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const blogPost = completion.choices[0].message.content;

    return NextResponse.json({ blogPost });
  } catch (error) {
    console.error('Error generating blog post:', error);

    // Fallback to mock response on error
    return NextResponse.json({
      blogPost: generateMockBlogPost(questions, answers),
      warning: 'Used fallback generation (API error)'
    });
  }
}

function createPrompt(questions: string[], answers: string[]): string {
  const interview = questions.map((q, i) =>
    `Q: ${q}\nA: ${answers[i]}`
  ).join('\n\n');

  return `Based on this interview, write a beautiful blog post that tells this person's story.
Use their own words and voice where possible, but craft it into a cohesive narrative.
Add a compelling title and organize it with appropriate headings.
Make it heartfelt and engaging for family members to read.

Interview:
${interview}

Write the blog post in markdown format with a title, headings, and well-structured paragraphs.`;
}

function generateMockBlogPost(questions: string[], answers: string[]): string {
  return `# A Life Well Lived: Memories and Reflections

## Childhood Beginnings

${answers[0] || 'The memories of childhood remain vivid, filled with the sights and sounds of a simpler time.'}

## Family Roots

${answers[1] || 'Family has always been the cornerstone of life, shaping values and character through the years.'}

## Early Career

${answers[2] || 'The journey into the working world brought its own lessons and memorable experiences.'}

## Turning Points

${answers[3] || 'Life is full of moments that change our direction, each one teaching us something valuable.'}

## Passing It Forward

${answers[4] || 'The traditions and values we hold dear are meant to be shared with future generations.'}

## Life's Greatest Lessons

${answers[5] || 'Through all the experiences, both joyful and challenging, wisdom emerges.'}

---

*This story was preserved using Memory Keeper - keeping family memories alive for generations to come.*`;
}
