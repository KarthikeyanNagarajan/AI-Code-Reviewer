# AI Code Reviewer

AI Code Reviewer is a full-stack web application that lets users paste code, select a programming language, and receive AI-powered feedback. The app uses a local LLM through Ollama to analyze the code, identify potential issues, and suggest improvements.

This project demonstrates end-to-end full-stack development with AI integration, including a React frontend, a Node.js backend, prompt engineering, API integration, and structured response handling.

## Features

- React frontend with a code editor
- Node.js + Express backend
- AI review generation using Ollama
- Language selection for JavaScript, Python, Java, C++, and Go
- Structured output containing:
  - summary
  - issues with type and severity
  - improvement suggestions
  - refactored code
- Clean split-panel layout for code input and review output

## Tech Stack

- Frontend: React, Monaco Editor, Axios
- Backend: Node.js, Express.js
- AI: Ollama
- Styling: CSS

## Project Structure

```bash
AICodeReviewer/
├── backend/
│   ├── app.js
│   ├── routes/
│   │   └── reviewRoutes.js
│   ├── services/
│   │   └── aiService.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js (v14+)
- npm
- Ollama installed and running locally

## Setup

### 1. Start Ollama

```bash
ollama serve
```

If needed, pull a model:

```bash
ollama pull llama3
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The backend will run on:

```bash
http://localhost:8000
```

### 3. Start the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm start
```

The frontend will run on:

```bash
http://localhost:3000
```

## How It Works

1. The user pastes code into the editor.
2. The frontend sends the code and selected language to the backend API.
3. The backend sends a review prompt to Ollama.
4. The response is parsed into a structured JSON object.
5. The UI displays the summary, issues, suggestions, and refactored code.

## API Endpoint

### POST /api/review

Request body:

```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}
```

Example response:

```json
{
  "summary": "The function is correct and simple, but it lacks input validation and documentation.",
  "issues": [
    {
      "type": "readability",
      "severity": "low",
      "line": 1,
      "description": "The function does not explain its purpose or expected input types.",
      "suggestion": "Add a brief JSDoc comment and validate inputs if necessary."
    }
  ],
  "refactoredCode": "function add(a, b) {\n  return a + b;\n}"
}
```

## Notes

This is a self-initiated project intended to explore AI-assisted developer tooling. It is designed as a prototype/demo rather than a production-scale system.

## Future Improvements

- Add authentication and user accounts
- Save review history
- Support more models and languages
- Improve prompt reliability and validation
- Add deployment support for cloud hosting

## Project Summary for GitHub / Resume

Built an AI-powered code review application using React, Node.js, Express, and Ollama to analyze code snippets, detect issues, and generate structured review feedback with suggested improvements.
