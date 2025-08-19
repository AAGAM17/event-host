import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, FileText, Brain, Zap, Upload, X } from 'lucide-react';
import { plagiarismService, type ProjectSubmission, type FileData, type PlagiarismAnalysis } from '../services/plagiarismService';

const PlagiarismDetectionSystem = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<PlagiarismAnalysis | null>(null);
  const [projectData, setProjectData] = useState<{
    title: string;
    description: string;
    codeFiles: (File & { content?: string })[];
    documentation: string;
  }>({
    title: '',
    description: '',
    codeFiles: [],
    documentation: ''
  });
  const [fileReadingProgress, setFileReadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Get real submissions from the plagiarism service
  const [submissions, setSubmissions] = useState(
    plagiarismService.getSubmissions().map(sub => ({
      id: sub.id,
      title: sub.title,
      team: sub.teamId,
      submissionTime: sub.submissionDate.toLocaleString(),
      similarity: Math.floor(Math.random() * 100), // This would come from actual analysis
      status: Math.random() > 0.7 ? "FLAGGED" : Math.random() > 0.4 ? "REVIEW" : "SAFE",
      riskLevel: Math.random() > 0.7 ? "HIGH" : Math.random() > 0.4 ? "MEDIUM" : "LOW"
    }))
  );

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setFileReadingProgress(0);
    
    try {
      // Read file contents if not already read
      const filesWithContent: FileData[] = [];
      let processedFiles = 0;
      
      for (const file of projectData.codeFiles) {
        try {
          const content = file.content || await readFileContent(file);
          filesWithContent.push({
            name: file.name,
            content,
            type: file.type,
            size: file.size
          });
          processedFiles++;
          setFileReadingProgress((processedFiles / projectData.codeFiles.length) * 50);
        } catch (err) {
          console.error(`Failed to read file ${file.name}:`, err);
          setError(`Failed to read file: ${file.name}`);
          return;
        }
      }

      // Create project submission
      const submission: ProjectSubmission = {
        id: `submission-${Date.now()}`,
        title: projectData.title,
        description: projectData.description,
        codeFiles: filesWithContent,
        documentation: projectData.documentation,
        teamId: 'current-user',
        submissionDate: new Date()
      };

      setFileReadingProgress(60);

      // Analyze with plagiarism service
      const analysisResults = await plagiarismService.analyzeProject(submission);
      
      setFileReadingProgress(100);
      setResults(analysisResults);
      setActiveTab('results');
      
      // Add submission to service for future comparisons
      plagiarismService.addSubmission(submission);
      
      // Update submissions list for dashboard
      setSubmissions(prev => [...prev, {
        id: submission.id,
        title: submission.title,
        team: submission.teamId,
        submissionTime: submission.submissionDate.toLocaleString(),
        similarity: analysisResults.overallSimilarity,
        status: analysisResults.riskLevel === "HIGH" ? "FLAGGED" : 
                analysisResults.riskLevel === "MEDIUM" ? "REVIEW" : "SAFE",
        riskLevel: analysisResults.riskLevel
      }]);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
      setFileReadingProgress(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProjectData(prev => ({
      ...prev,
      codeFiles: [...prev.codeFiles, ...files]
    }));
    setError(null); // Clear any previous errors
  };

  const removeFile = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      codeFiles: prev.codeFiles.filter((_, i) => i !== index)
    }));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SAFE': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REVIEW': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'FLAGGED': return <Shield className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Plagiarism Detection</h1>
              <p className="text-gray-600">Ensure originality and maintain hackathon integrity</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            {[
              { id: 'submit', label: 'Submit Project', icon: Upload },
              { id: 'results', label: 'Analysis Results', icon: Search },
              { id: 'dashboard', label: 'Admin Dashboard', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Project Tab */}
        {activeTab === 'submit' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Submission</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectData.title}
                    onChange={(e) => setProjectData(prev => ({...prev, title: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documentation
                  </label>
                  <textarea
                    value={projectData.documentation}
                    onChange={(e) => setProjectData(prev => ({...prev, documentation: e.target.value}))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste your README, project documentation, or key code snippets..."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.md"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload code files</p>
                      <p className="text-sm text-gray-500 mt-2">Supports: JS, TS, Python, Java, C++, HTML, CSS</p>
                    </label>
                  </div>

                  {projectData.codeFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {projectData.codeFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            {file.type && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <p className="text-red-700 font-medium">Error</p>
                    </div>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                )}

                {/* Analysis Progress */}
                {analyzing && fileReadingProgress > 0 && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <p className="text-blue-700 font-medium">Processing Files...</p>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileReadingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">{fileReadingProgress}% complete</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !projectData.title || !projectData.description}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {fileReadingProgress > 0 && fileReadingProgress < 60 ? 'Reading Files...' : 
                       fileReadingProgress >= 60 ? 'Analyzing Similarity...' : 'Analyzing Project...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Start AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && results && (
          <div className="space-y-8">
            {/* Overall Results */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                <div className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(results.riskLevel)}`}>
                  {results.riskLevel} RISK
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{results.overallSimilarity}%</div>
                  <div className="text-sm text-blue-800 font-medium">Overall Similarity</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{results.aiAnalysis.codeStructure}%</div>
                  <div className="text-sm text-purple-800 font-medium">Code Structure</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{results.aiAnalysis.designPatterns}%</div>
                  <div className="text-sm text-green-800 font-medium">Design Patterns</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{results.aiAnalysis.functionality}%</div>
                  <div className="text-sm text-orange-800 font-medium">Functionality</div>
                </div>
              </div>

              {/* Similar Projects */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Projects Found</h3>
                <div className="space-y-4">
                                        {results.similarities.map((similarity, index) => (
                        <div key={similarity.projectId || index} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{similarity.projectName}</h4>
                              <p className="text-sm text-gray-600">by {similarity.author} • {similarity.submissionDate}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-red-600 mb-1">{similarity.similarity}%</div>
                              <div className="text-sm text-gray-600">Similarity</div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Matched Sections:</p>
                            <div className="flex flex-wrap gap-2">
                              {similarity.matchedSections.map((section: string, sectionIndex: number) => (
                                <span key={sectionIndex} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                                  {section}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
            
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">847</div>
                    <div className="text-sm text-green-800 font-medium">Total Submissions</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">23</div>
                    <div className="text-sm text-yellow-800 font-medium">Under Review</div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">12</div>
                    <div className="text-sm text-red-800 font-medium">Flagged</div>
                  </div>
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <div className="text-sm text-blue-800 font-medium">Accuracy Rate</div>
                  </div>
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Submissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Similarity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map(submission => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{submission.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {submission.team}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {submission.submissionTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{submission.similarity}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <span className="text-sm font-medium text-gray-900">{submission.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(submission.riskLevel)}`}>
                            {submission.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty Results State */}
        {activeTab === 'results' && !results && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Results</h3>
            <p className="text-gray-600">Submit a project to see plagiarism analysis results here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismDetectionSystem;