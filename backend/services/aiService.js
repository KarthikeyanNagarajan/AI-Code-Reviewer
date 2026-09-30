const OLLAMA_API = 'http://localhost:11434/api/generate';

async function generateReview(code, language) {
  const prompt = `You are a senior software engineer performing a code review.

Analyze the following ${language} code and provide a detailed review.

Return ONLY valid JSON in this exact format (no extra text):
{
  "summary": "Brief summary of code quality and overall assessment",
  "issues": [
    {
      "type": "bug | performance | security | readability",
      "severity": "low | medium | high",
      "line": 1,
      "description": "Description of the issue",
      "suggestion": "How to fix or improve"
    }
  ],
  "refactoredCode": "Improved version of the code with fixes applied"
}

Important:
- severity must be one of: "low", "medium", or "high"
- type must be one of: "bug", "performance", "security", "readability"
- Only return the JSON object, nothing else

CODE TO REVIEW:
${code}`;

  try {
    const response = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawResponse = data.response || '';

    // Try to parse JSON from response
    return parseReviewJSON(rawResponse);
  } catch (error) {
    throw new Error(`Failed to call Ollama API: ${error.message}`);
  }
}

function parseReviewJSON(response) {
  try {and normalize issues with severity
      if (parsed.summary) {
        const issues = Array.isArray(parsed.issues) ? parsed.issues.map(issue => ({
          type: issue.type || 'readability',
          severity: validateSeverity(issue.severity) || 'low',
          line: issue.line || 0,
          description: issue.description || '',
          suggestion: issue.suggestion || ''
        })) : [];

        return {
          summary: parsed.summary || '',
          issues: issues,
          refactoredCode: parsed.refactoredCode || '',
        };
      }
    }

    // Fallback: return plain text as summary
    return {
      summary: response.substring(0, 500),
      issues: [],
      refactoredCode: '',
    };
  } catch (error) {
    // If JSON parsing fails completely, return fallback
    return {
      summary: response.substring(0, 500),
      issues: [],
      refactoredCode: '',
    };
  }
}

function validateSeverity(severity) {
  const valid = ['low', 'medium', 'high'];
  return valid.includes(severity) ? severity : 'low'; // If JSON parsing fails completely, return fallback
    return {
      summary: response,
      issues: [],
      refactoredCode: '',
    };
  }
}

module.exports = {
  generateReview,
};
