# AI-Based Plagiarism Detection System

## Overview

This system provides comprehensive AI-powered plagiarism detection for hackathon projects, ensuring originality and maintaining event integrity.

## Features Implemented

### 🧠 AI-Powered Analysis
- **Code Structure Analysis**: Analyzes functions, classes, and interfaces
- **Design Pattern Detection**: Identifies common design patterns and React hooks
- **Functionality Assessment**: Evaluates project complexity based on file types and descriptions
- **Documentation Quality**: Scores documentation completeness and technical depth

### 🔍 Multi-Level Similarity Detection
- **Text Similarity**: Uses Jaccard index for description and documentation comparison
- **Code Similarity**: Normalizes code by removing comments, whitespace, and variable names
- **Structural Similarity**: Compares file organization and naming patterns
- **Weighted Scoring**: Combines multiple factors for overall similarity assessment

### 📊 Comprehensive Reporting
- **Risk Assessment**: LOW/MEDIUM/HIGH risk classification
- **Detailed Breakdowns**: Shows similarity percentages for different aspects
- **Matched Sections**: Identifies specific areas of similarity
- **Visual Dashboard**: Admin interface for monitoring all submissions

### 🛡️ Real-Time Processing
- **File Reading**: Automatically processes uploaded code files
- **Progress Tracking**: Shows real-time analysis progress
- **Error Handling**: Graceful error management with user feedback
- **Dynamic Updates**: Live dashboard updates with new submissions

## How to Use

### For Participants

1. **Submit Project**:
   - Navigate to the "Submit Project" tab
   - Fill in project title and description
   - Upload code files (JS, TS, Python, Java, C++, HTML, CSS)
   - Add project documentation
   - Click "Start AI Analysis"

2. **View Results**:
   - System automatically switches to "Analysis Results" tab
   - Review overall similarity score and risk level
   - Check detailed breakdown of analysis metrics
   - Examine any similar projects found

### For Administrators

1. **Monitor Submissions**:
   - Access the "Admin Dashboard" tab
   - View statistics: total submissions, flagged projects, accuracy rate
   - Review recent submissions table with risk levels

2. **Review Flagged Projects**:
   - Projects with >70% similarity are marked as HIGH risk
   - Projects with 40-70% similarity are marked as MEDIUM risk
   - Projects with <40% similarity are marked as LOW risk

## Technical Implementation

### Core Components

1. **PlagiarismDetectionService** (`src/services/plagiarismService.ts`):
   - Main analysis engine
   - Similarity calculation algorithms
   - Project comparison logic
   - Risk assessment functions

2. **PlagiarismDetectionSystem** (`src/components/PlagiarismDetectionSystem.tsx`):
   - User interface component
   - File upload handling
   - Real-time progress tracking
   - Results visualization

### Analysis Algorithms

1. **Text Similarity (Jaccard Index)**:
   ```
   similarity = |intersection| / |union| * 100
   ```

2. **Code Normalization**:
   - Remove comments and whitespace
   - Replace variable names with placeholders
   - Replace strings with placeholders
   - Compare normalized structures

3. **Weighted Overall Score**:
   ```
   overall = (title * 0.1) + (description * 0.2) + 
            (documentation * 0.2) + (code * 0.3) + 
            (structure * 0.2)
   ```

## Security Features

- **File Type Validation**: Only accepts approved file types
- **Size Limits**: Prevents large file uploads
- **Error Isolation**: Failures in one analysis don't affect others
- **Data Privacy**: Files processed in memory, not permanently stored

## Performance Optimizations

- **Async Processing**: Non-blocking file reading and analysis
- **Progress Feedback**: Real-time updates during processing
- **Efficient Algorithms**: Optimized similarity calculations
- **Memory Management**: Proper cleanup after analysis

## Future Enhancements

- **Machine Learning Models**: Integration with advanced ML similarity detection
- **Code Clone Detection**: More sophisticated code duplication identification
- **Multi-Language Support**: Enhanced support for different programming languages
- **Historical Analysis**: Comparison with previous hackathon submissions
- **API Integration**: External plagiarism detection services

## Usage Examples

### Example Analysis Output
```
Overall Similarity: 23%
Risk Level: LOW

AI Analysis Breakdown:
- Code Structure: 15%
- Design Patterns: 45%
- Functionality: 30%
- Documentation: 25%

Similar Projects Found:
- "Event Planner Plus" (23% similarity)
  Matched Sections: Color scheme, Button styling
```

### File Types Supported
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Python (.py)
- Java (.java)
- C++ (.cpp, .c)
- HTML (.html, .htm)
- CSS (.css, .scss, .sass)
- JSON (.json)
- Markdown (.md)

## Troubleshooting

### Common Issues

1. **File Upload Fails**:
   - Check file type is supported
   - Ensure file size is reasonable
   - Try uploading files individually

2. **Analysis Stuck**:
   - Refresh the page and try again
   - Check browser console for errors
   - Ensure all required fields are filled

3. **High Similarity False Positive**:
   - Review matched sections for context
   - Consider if similarities are coincidental
   - Check if using common frameworks/templates

### Error Messages

- `"Failed to read file: [filename]"`: File reading error, try re-uploading
- `"Analysis failed. Please try again."`: General analysis error, retry submission
- File type errors: Ensure uploaded files are in supported formats

## Best Practices

1. **For Participants**:
   - Upload all relevant source code files
   - Provide detailed project documentation
   - Include unique implementation details
   - Avoid copying code from online sources

2. **For Organizers**:
   - Set clear plagiarism policies
   - Review flagged submissions manually
   - Consider context when evaluating similarities
   - Provide feedback to participants on results

---

The AI-based plagiarism detection system is now fully operational and ready to help maintain the integrity of your hackathon events!
