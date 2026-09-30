import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('// Paste your code here...\n');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState({
    summary: '',
    issues: [],
    refactoredCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewComplete, setReviewComplete] = useState(false);

  const languageMap = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
  };

  const handleReview = async () => {
    if (!code.trim() || code.trim() === '// Paste your code here...\n') {
      setError('Please paste some code');
      return;
    }

    setLoading(true);
    setError('');
    setReview({ summary: '', issues: [], refactoredCode: '' });
    setReviewComplete(false);

    try {
      const response = await axios.post('http://localhost:8000/api/review', {
        code,
        language,
      });
      setReview({
        summary: response.data.summary || '',
        issues: response.data.issues || [],
        refactoredCode: response.data.refactoredCode || '',
      });
      setReviewComplete(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get review. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(review.refactoredCode);
    alert('Code copied to clipboard!');
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ff9800';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <h1>AI Code Reviewer</h1>
      </nav>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Analyzing your code...</p>
          </div>
        </div>
      )}

      {/* Split Window Container */}
      <div className="split-container">
        {/* Coding Panel - Left */}
        <div className="coding-panel">
          <div className="panel-top">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
            </select>
          </div>

          {/* Monaco Editor */}
          <div className="monaco-editor-container">
            <Editor
              height="100%"
              language={languageMap[language]}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Courier New, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="panel-bottom">
            <button
              onClick={handleReview}
              disabled={loading}
              className="btn-review"
            >
              {loading ? 'Reviewing...' : 'Review Code'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        {/* Review Panel - Right */}
        <div className="review-panel">
          {!loading && !review.summary && (
            <p className="placeholder">Your code review will appear here...</p>
          )}

          {!loading && review.summary && (
            <div className="review-results">
              {/* Review Complete Badge */}
              {reviewComplete && (
                <div className="review-complete-badge">✅ Review Complete</div>
              )}

              {/* Summary Section */}
              <div className="summary-section">
                <h3>📋 Summary</h3>
                <p>{review.summary}</p>
              </div>

              {/* Issues Section */}
              {review.issues && review.issues.length > 0 ? (
                <div className="issues-section">
                  <h3>⚠️ Issues Found ({review.issues.length})</h3>
                  <div className="issues-list">
                    {review.issues.map((issue, idx) => (
                      <div key={idx} className={`issue-card issue-${issue.type}`}>
                        <div className="issue-header">
                          <span className={`issue-type ${issue.type}`}>
                            {issue.type.toUpperCase()}
                          </span>
                          <span 
                            className="issue-severity"
                            style={{
                              backgroundColor: getSeverityColor(issue.severity),
                              color: 'white'
                            }}
                          >
                            {issue.severity ? issue.severity.toUpperCase() : 'LOW'}
                          </span>
                          {issue.line && <span className="issue-line">Line {issue.line}</span>}
                        </div>
                        <div className="issue-description">
                          <p><strong>Issue:</strong> {issue.description}</p>
                          <p><strong>Suggestion:</strong> {issue.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                review.summary && <div className="no-issues">✅ No issues found!</div>
              )}

              {/* Refactored Code Section */}
              {review.refactoredCode && (
                <div className="refactored-section">
                  <div className="refactored-header">
                    <h3>✨ Refactored Code</h3>
                    <button 
                      className="btn-copy"
                      onClick={handleCopyCode}
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <pre className="code-block"><code>{review.refactoredCode}</code></pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
