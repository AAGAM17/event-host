import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Upload, 
  Link, 
  Github, 
  Play, 
  Video, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface SubmissionFormData {
  title: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  presentationUrl?: string;
  technologies: string[];
  trackId?: string;
}

// Mock data
const currentSubmission = {
  id: '1',
  title: 'EcoTrack - Sustainable Habit Tracker',
  description: 'An AI-powered mobile app that helps users track and improve their environmental impact through daily habit monitoring and personalized recommendations.',
  teamId: '1',
  teamName: 'Innovation Squad',
  eventId: '1',
  eventName: 'SynapHack 3.0',
  trackId: '1',
  trackName: 'AI/ML',
  submissionDate: new Date('2024-08-16'),
  githubUrl: 'https://github.com/innovation-squad/ecotrack',
  demoUrl: 'https://ecotrack-demo.netlify.app',
  videoUrl: 'https://youtube.com/watch?v=demo123',
  presentationUrl: 'https://docs.google.com/presentation/d/demo',
  technologies: ['React Native', 'Python', 'TensorFlow', 'Firebase', 'Node.js'],
  status: 'submitted' as const,
  documents: [
    {
      id: '1',
      name: 'Project Presentation.pdf',
      url: '/documents/presentation.pdf',
      type: 'pdf' as const,
      size: 2.5 * 1024 * 1024 // 2.5MB
    },
    {
      id: '2',
      name: 'Technical Documentation.docx',
      url: '/documents/tech-docs.docx',
      type: 'doc' as const,
      size: 1.2 * 1024 * 1024 // 1.2MB
    }
  ],
  evaluation: {
    averageScore: 87.5,
    feedback: 'Excellent project with strong technical implementation and clear environmental impact.',
    isCompleted: true
  }
};

const eventInfo = {
  submissionDeadline: new Date('2024-09-17T23:59:59'),
  allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  requiredSubmissions: ['Project Demo', 'Source Code', 'Presentation'],
  tracks: [
    { id: '1', name: 'AI/ML', color: '#3B82F6' },
    { id: '2', name: 'Web3', color: '#8B5CF6' },
    { id: '3', name: 'FinTech', color: '#10B981' },
    { id: '4', name: 'Healthcare', color: '#F59E0B' }
  ]
};

const technologySuggestions = [
  'React', 'React Native', 'Vue.js', 'Angular', 'Python', 'JavaScript', 
  'TypeScript', 'Node.js', 'Express', 'Django', 'Flask', 'TensorFlow',
  'PyTorch', 'MongoDB', 'PostgreSQL', 'Firebase', 'AWS', 'Docker',
  'Kubernetes', 'Blockchain', 'Solidity', 'Web3', 'Machine Learning',
  'AI', 'Computer Vision', 'NLP', 'IoT', 'Arduino', 'Raspberry Pi'
];

export const SubmissionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submission' | 'documents' | 'evaluation'>('submission');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    currentSubmission?.technologies || []
  );
  const [customTech, setCustomTech] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SubmissionFormData>({
    defaultValues: {
      title: currentSubmission?.title || '',
      description: currentSubmission?.description || '',
      githubUrl: currentSubmission?.githubUrl || '',
      demoUrl: currentSubmission?.demoUrl || '',
      videoUrl: currentSubmission?.videoUrl || '',
      presentationUrl: currentSubmission?.presentationUrl || '',
      trackId: currentSubmission?.trackId || ''
    }
  });

  const timeRemaining = () => {
    const now = new Date();
    const deadline = eventInfo.submissionDeadline;
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Deadline passed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours remaining`;
    return `${hours} hours remaining`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addTechnology = (tech: string) => {
    if (tech && !selectedTechnologies.includes(tech)) {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };

  const removeTechnology = (tech: string) => {
    setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
  };

  const addCustomTechnology = () => {
    if (customTech.trim()) {
      addTechnology(customTech.trim());
      setCustomTech('');
    }
  };

  const onSubmit = (data: SubmissionFormData) => {
    const submissionData = {
      ...data,
      technologies: selectedTechnologies
    };
    console.log('Submission data:', submissionData);
    // Handle form submission
  };

  const TabButton: React.FC<{ tab: typeof activeTab; children: React.ReactNode }> = ({ tab, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  const renderSubmissionForm = () => (
    <div className="space-y-6">
      {/* Deadline Warning */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <h4 className="font-medium text-orange-800">Submission Deadline</h4>
              <p className="text-orange-700">
                {eventInfo.submissionDeadline.toLocaleDateString()} at{' '}
                {eventInfo.submissionDeadline.toLocaleTimeString()} - {timeRemaining()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Provide details about your project and what you've built
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Project Title*"
              placeholder="Enter your project title"
              {...register('title', { required: 'Project title is required' })}
              error={errors.title?.message}
            />

            <Textarea
              label="Project Description*"
              placeholder="Describe your project, its purpose, key features, and impact..."
              rows={6}
              {...register('description', { required: 'Project description is required' })}
              error={errors.description?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Track*
              </label>
              <select
                {...register('trackId', { required: 'Please select a track' })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select a track</option>
                {eventInfo.tracks.map(track => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
              {errors.trackId && (
                <p className="text-sm text-red-600 mt-1">{errors.trackId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used*
              </label>
              <div className="space-y-4">
                {/* Selected Technologies */}
                {selectedTechnologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTechnologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="primary"
                        className="flex items-center space-x-1 px-3 py-1"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 hover:text-primary-200"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Technology Suggestions */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {technologySuggestions
                      .filter(tech => !selectedTechnologies.includes(tech))
                      .slice(0, 12)
                      .map((tech, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => addTechnology(tech)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          + {tech}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Custom Technology Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add custom technology"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTechnology())}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomTechnology}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </label>
                  <Input
                    placeholder="https://github.com/username/project"
                    {...register('githubUrl')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Play className="h-4 w-4 mr-2" />
                    Live Demo URL
                  </label>
                  <Input
                    placeholder="https://your-project.netlify.app"
                    {...register('demoUrl')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Video className="h-4 w-4 mr-2" />
                    Demo Video
                  </label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    {...register('videoUrl')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Presentation
                  </label>
                  <Input
                    placeholder="https://docs.google.com/presentation/..."
                    {...register('presentationUrl')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Upload Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-800 mb-2">Upload Guidelines</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Maximum file size: {formatFileSize(eventInfo.maxFileSize)}</li>
            <li>• Allowed formats: {eventInfo.allowedFileTypes.join(', ').toUpperCase()}</li>
            <li>• Required: {eventInfo.requiredSubmissions.join(', ')}</li>
          </ul>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload your project documentation, presentations, and other supporting files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Drop files here or click to upload</h4>
              <p className="text-gray-600 mb-4">
                Upload presentations, documentation, or other project files
              </p>
              <Button variant="outline">
                Choose Files
              </Button>
            </div>

            {/* Uploaded Files */}
            {currentSubmission?.documents && currentSubmission.documents.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Uploaded Files</h4>
                <div className="space-y-2">
                  {currentSubmission.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(doc.size)} • {doc.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEvaluation = () => (
    <div className="space-y-6">
      {currentSubmission?.evaluation?.isCompleted ? (
        <>
          {/* Evaluation Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle>Evaluation Complete</CardTitle>
                  <CardDescription>
                    Your project has been reviewed by the judges
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {currentSubmission.evaluation.averageScore}/100
                  </div>
                  <p className="text-gray-600">Overall Score</p>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Innovation', score: 92 },
                    { name: 'Technical Implementation', score: 88 },
                    { name: 'User Experience', score: 85 },
                    { name: 'Market Potential', score: 85 }
                  ].map((criteria) => (
                    <div key={criteria.name} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{criteria.name}</span>
                        <span className="text-lg font-semibold">{criteria.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${criteria.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="font-medium mb-2">Judge Feedback</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{currentSubmission.evaluation.feedback}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Evaluation Pending</h3>
            <p className="text-gray-600 mb-4">
              Your submission is being reviewed by our judges. Results will be available soon.
            </p>
            <Badge variant="warning">Under Review</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Project Submission
        </h1>
        <p className="text-xl text-gray-600">
          Submit your hackathon project and showcase your innovation to the judges.
        </p>
      </div>

      {/* Submission Status */}
      {currentSubmission && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  currentSubmission.status === 'submitted' ? 'bg-green-500' :
                  currentSubmission.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div>
                  <h3 className="font-semibold">{currentSubmission.title}</h3>
                  <p className="text-sm text-gray-600">
                    Team: {currentSubmission.teamName} • Track: {currentSubmission.trackName}
                  </p>
                </div>
              </div>
              <Badge
                variant={currentSubmission.status === 'submitted' ? 'success' : 'warning'}
                className="capitalize"
              >
                {currentSubmission.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <TabButton tab="submission">Project Details</TabButton>
        <TabButton tab="documents">Documents</TabButton>
        <TabButton tab="evaluation">Evaluation</TabButton>
      </div>

      {/* Content */}
      {activeTab === 'submission' && renderSubmissionForm()}
      {activeTab === 'documents' && renderDocuments()}
      {activeTab === 'evaluation' && renderEvaluation()}
    </div>
  );
};
