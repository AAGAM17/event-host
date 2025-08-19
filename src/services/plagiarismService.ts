// src/services/plagiarismService.ts

export interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  codeFiles: FileData[];
  documentation: string;
  teamId: string;
  submissionDate: Date;
}

export interface FileData {
  name: string;
  content: string;
  type: string;
  size: number;
}

export interface SimilarityResult {
  projectId: string;
  projectName: string;
  similarity: number;
  matchedSections: string[];
  submissionDate: string;
  author: string;
}

export interface PlagiarismAnalysis {
  overallSimilarity: number;
  similarities: SimilarityResult[];
  aiAnalysis: {
    codeStructure: number;
    designPatterns: number;
    functionality: number;
    documentation: number;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

class PlagiarismDetectionService {
  private existingSubmissions: Map<string, ProjectSubmission> = new Map();
  
  // Common coding patterns and structures
  private commonPatterns = [
    'function',
    'class',
    'interface',
    'export',
    'import',
    'const',
    'let',
    'var',
    'return',
    'if',
    'else',
    'for',
    'while',
    'try',
    'catch'
  ];

  // Initialize with existing submissions
  constructor(submissions: ProjectSubmission[] = []) {
    submissions.forEach(submission => {
      this.existingSubmissions.set(submission.id, submission);
    });
  }

  /**
   * Main method to analyze a project for plagiarism
   */
  async analyzeProject(project: ProjectSubmission): Promise<PlagiarismAnalysis> {
    const similarities = await this.compareWithExistingSubmissions(project);
    const aiAnalysis = this.performAIAnalysis(project, similarities);
    const overallSimilarity = Math.max(...similarities.map(s => s.similarity), 0);
    
    return {
      overallSimilarity,
      similarities: similarities.sort((a, b) => b.similarity - a.similarity),
      aiAnalysis,
      riskLevel: this.calculateRiskLevel(overallSimilarity)
    };
  }

  /**
   * Compare project with all existing submissions
   */
  private async compareWithExistingSubmissions(project: ProjectSubmission): Promise<SimilarityResult[]> {
    const results: SimilarityResult[] = [];
    
    for (const [id, existingProject] of this.existingSubmissions) {
      if (id === project.id) continue; // Don't compare with itself
      
      const similarity = await this.calculateSimilarity(project, existingProject);
      
      if (similarity.overall > 15) { // Only include meaningful similarities
        results.push({
          projectId: id,
          projectName: existingProject.title,
          similarity: similarity.overall,
          matchedSections: similarity.matchedSections,
          submissionDate: existingProject.submissionDate.toISOString().split('T')[0],
          author: existingProject.teamId
        });
      }
    }
    
    return results;
  }

  /**
   * Calculate similarity between two projects
   */
  private async calculateSimilarity(project1: ProjectSubmission, project2: ProjectSubmission): Promise<{
    overall: number;
    matchedSections: string[];
  }> {
    const scores = {
      title: this.textSimilarity(project1.title, project2.title),
      description: this.textSimilarity(project1.description, project2.description),
      documentation: this.textSimilarity(project1.documentation, project2.documentation),
      code: this.codeSimilarity(project1.codeFiles, project2.codeFiles),
      structure: this.structuralSimilarity(project1.codeFiles, project2.codeFiles)
    };

    const matchedSections = [];
    if (scores.title > 70) matchedSections.push('Project Title');
    if (scores.description > 60) matchedSections.push('Description');
    if (scores.documentation > 50) matchedSections.push('Documentation');
    if (scores.code > 40) matchedSections.push('Code Implementation');
    if (scores.structure > 50) matchedSections.push('Project Structure');

    // Weighted overall score
    const overall = Math.round(
      (scores.title * 0.1 +
       scores.description * 0.2 +
       scores.documentation * 0.2 +
       scores.code * 0.3 +
       scores.structure * 0.2)
    );

    return { overall, matchedSections };
  }

  /**
   * Calculate text similarity using Jaccard index
   */
  private textSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size === 0 ? 0 : Math.round((intersection.size / union.size) * 100);
  }

  /**
   * Calculate code similarity
   */
  private codeSimilarity(files1: FileData[], files2: FileData[]): number {
    if (files1.length === 0 || files2.length === 0) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (const file1 of files1) {
      for (const file2 of files2) {
        if (this.isSameFileType(file1.name, file2.name)) {
          const sim = this.compareCodeContent(file1.content, file2.content);
          totalSimilarity += sim;
          comparisons++;
        }
      }
    }
    
    return comparisons === 0 ? 0 : Math.round(totalSimilarity / comparisons);
  }

  /**
   * Compare code content after normalizing
   */
  private compareCodeContent(code1: string, code2: string): number {
    const normalized1 = this.normalizeCode(code1);
    const normalized2 = this.normalizeCode(code2);
    
    return this.textSimilarity(normalized1, normalized2);
  }

  /**
   * Normalize code by removing comments, whitespace, and variable names
   */
  private normalizeCode(code: string): string {
    return code
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove variable names (basic approach)
    // List of common JS/TS keywords to exclude from replacement
    const keywords = new Set([
      'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
      'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
      'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void',
      'while', 'with', 'yield', 'let', 'static', 'await', 'implements', 'package', 'protected', 'interface',
      'private', 'public'
    ]);
    return code
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove variable names (exclude keywords)
      .replace(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g, (match) => keywords.has(match) ? match : 'VAR')
      // Remove strings
      .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, 'STRING')
      .trim();
  }

  /**
   * Calculate structural similarity (file organization, naming patterns)
   */
  private structuralSimilarity(files1: FileData[], files2: FileData[]): number {
    const structure1 = files1.map(f => this.getFileStructure(f.name));
    const structure2 = files2.map(f => this.getFileStructure(f.name));
    
    const common = structure1.filter(s1 => structure2.some(s2 => s1 === s2)).length;
    const total = Math.max(structure1.length, structure2.length);
    
    return total === 0 ? 0 : Math.round((common / total) * 100);
  }

  /**
   * Extract file structure information
   */
  private getFileStructure(filename: string): string {
    const parts = filename.split('.');
    const extension = parts.pop() || '';
    const nameWithoutExt = parts.join('.');
    
    // Extract patterns like: components/Button, services/api, etc.
    const pathParts = nameWithoutExt.split('/');
    const structurePattern = pathParts.length > 1 
      ? `${pathParts[pathParts.length - 2]}/${extension}`
      : extension;
    
    return structurePattern;
  }

  /**
   * Check if two files are of the same type
   */
  private isSameFileType(filename1: string, filename2: string): boolean {
    const ext1 = filename1.split('.').pop()?.toLowerCase();
    const ext2 = filename2.split('.').pop()?.toLowerCase();
    
    // Group similar file types
    const jsTypes = ['js', 'jsx', 'ts', 'tsx'];
    const cssTypes = ['css', 'scss', 'sass', 'less'];
    const htmlTypes = ['html', 'htm'];
    const configTypes = ['json', 'yml', 'yaml', 'toml'];
    
    if (jsTypes.includes(ext1!) && jsTypes.includes(ext2!)) return true;
    if (cssTypes.includes(ext1!) && cssTypes.includes(ext2!)) return true;
    if (htmlTypes.includes(ext1!) && htmlTypes.includes(ext2!)) return true;
    if (configTypes.includes(ext1!) && configTypes.includes(ext2!)) return true;
    
    return ext1 === ext2;
  }

  /**
   * Perform AI-based analysis
   */
  private performAIAnalysis(project: ProjectSubmission, similarities: SimilarityResult[]): {
    codeStructure: number;
    designPatterns: number;
    functionality: number;
    documentation: number;
  } {
    // Analyze code structure complexity
    const codeStructure = this.analyzeCodeStructure(project.codeFiles);
    
    // Analyze design patterns usage
    const designPatterns = this.analyzeDesignPatterns(project.codeFiles);
    
    // Analyze functionality complexity
    const functionality = this.analyzeFunctionality(project.codeFiles, project.description);
    
    // Analyze documentation quality
    const documentation = this.analyzeDocumentation(project.documentation, project.description);
    
    return {
      codeStructure,
      designPatterns,
      functionality,
      documentation
    };
  }

  /**
   * Analyze code structure complexity
   */
  private analyzeCodeStructure(files: FileData[]): number {
    let complexityScore = 0;
    let totalFiles = files.length;
    
    if (totalFiles === 0) return 0;
    
    for (const file of files) {
      const content = file.content.toLowerCase();
      
      // Count functions, classes, interfaces
      const functions = (content.match(/function\s+\w+/g) || []).length;
      const classes = (content.match(/class\s+\w+/g) || []).length;
      const interfaces = (content.match(/interface\s+\w+/g) || []).length;
      
      // Calculate complexity based on structures found
      const fileComplexity = Math.min(100, (functions * 2 + classes * 3 + interfaces * 2));
      complexityScore += fileComplexity;
    }
    
    return Math.round(complexityScore / totalFiles);
  }

  /**
   * Analyze design patterns usage
   */
  private analyzeDesignPatterns(files: FileData[]): number {
    let patternScore = 0;
    const patterns = [
      'singleton', 'factory', 'observer', 'strategy', 'decorator',
      'adapter', 'facade', 'proxy', 'command', 'state'
    ];
    
    for (const file of files) {
      const content = file.content.toLowerCase();
      
      // Look for common design pattern indicators
      patterns.forEach(pattern => {
        if (content.includes(pattern)) {
          patternScore += 10;
        }
      });
      
      // Look for React patterns
      if (content.includes('usestate') || content.includes('useeffect')) patternScore += 5;
      if (content.includes('usecallback') || content.includes('usememo')) patternScore += 8;
      if (content.includes('context') && content.includes('provider')) patternScore += 10;
    }
    
    return Math.min(100, patternScore);
  }

  /**
   * Analyze functionality complexity
   */
  private analyzeFunctionality(files: FileData[], description: string): number {
    let functionalityScore = 0;
    
    // Analyze based on file count and types
    const jsFiles = files.filter(f => /\.(js|jsx|ts|tsx)$/i.test(f.name)).length;
    const cssFiles = files.filter(f => /\.(css|scss|sass)$/i.test(f.name)).length;
    const configFiles = files.filter(f => /\.(json|yml|yaml)$/i.test(f.name)).length;
    
    functionalityScore += jsFiles * 10;
    functionalityScore += cssFiles * 5;
    functionalityScore += configFiles * 3;
    
    // Analyze description complexity
    const descWords = description.split(/\s+/).length;
    functionalityScore += Math.min(30, descWords / 2);
    
    return Math.min(100, functionalityScore);
  }

  /**
   * Analyze documentation quality
   */
  private analyzeDocumentation(documentation: string, description: string): number {
    if (!documentation && !description) return 0;
    
    const totalText = documentation + ' ' + description;
    const words = totalText.split(/\s+/).filter(w => w.length > 0);
    const sentences = totalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Score based on length and structure
    let score = 0;
    
    // Word count scoring
    if (words.length > 50) score += 30;
    else if (words.length > 20) score += 20;
    else if (words.length > 10) score += 10;
    
    // Sentence structure scoring
    if (sentences.length > 5) score += 25;
    else if (sentences.length > 2) score += 15;
    
    // Look for technical terms
    const techTerms = ['api', 'database', 'authentication', 'frontend', 'backend', 'algorithm', 'framework'];
    const foundTerms = techTerms.filter(term => totalText.toLowerCase().includes(term));
    score += foundTerms.length * 5;
    
    // Look for code examples or technical details
    if (totalText.includes('```') || totalText.includes('`')) score += 20;
    
    return Math.min(100, score);
  }

  /**
   * Calculate risk level based on similarity score
   */
  private calculateRiskLevel(similarity: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (similarity >= 70) return 'HIGH';
    if (similarity >= 40) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Add a new submission to the database
   */
  addSubmission(submission: ProjectSubmission): void {
    this.existingSubmissions.set(submission.id, submission);
  }

  /**
   * Get all submissions
   */
  getSubmissions(): ProjectSubmission[] {
    return Array.from(this.existingSubmissions.values());
  }

  /**
   * Remove a submission
   */
  removeSubmission(id: string): boolean {
    return this.existingSubmissions.delete(id);
  }
}

// Export singleton instance
export const plagiarismService = new PlagiarismDetectionService([
  // Mock initial submissions for testing
  {
    id: 'mock-1',
    title: 'TaskMaster Pro',
    description: 'A comprehensive task management application with real-time collaboration features',
    codeFiles: [
      {
        name: 'src/components/TaskList.tsx',
        content: 'import React from "react"; export const TaskList = () => { return <div>Tasks</div>; };',
        type: 'text/typescript',
        size: 1024
      }
    ],
    documentation: 'This project implements a task management system using React and TypeScript.',
    teamId: 'team-alpha',
    submissionDate: new Date('2024-08-15')
  },
  {
    id: 'mock-2',
    title: 'Event Planner Plus',
    description: 'Modern event planning platform with advanced scheduling capabilities',
    codeFiles: [
      {
        name: 'src/pages/EventPage.tsx',
        content: 'import React from "react"; export const EventPage = () => { return <div>Events</div>; };',
        type: 'text/typescript',
        size: 856
      }
    ],
    documentation: 'Event planning application built with modern web technologies.',
    teamId: 'team-beta',
    submissionDate: new Date('2024-08-10')
  }
]);

export default plagiarismService;