import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Plus, 
  Trash2, 
  Save,
  Eye,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
interface EventFormData {
  title: string;
  description: string;
  theme: string;
  type: 'online' | 'offline' | 'hybrid';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  registrationDeadline: string;
  registrationTime: string;
  maxParticipants: number;
  location?: string;
  venue?: string;
  requirements: string[];
  tracks: Array<{
    name: string;
    description: string;
    color: string;
    maxTeams?: number;
  }>;
  prizes: Array<{
    title: string;
    description: string;
    value: string;
    position: number;
    trackId?: string;
  }>;
  evaluationCriteria: Array<{
    name: string;
    description: string;
    maxScore: number;
    weight: number;
  }>;
  sponsors: Array<{
    name: string;
    logo: string;
    website: string;
    tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
    description?: string;
  }>;
}

const trackColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
];

const sponsorTiers = [
  { name: 'Title', value: 'title' },
  { name: 'Platinum', value: 'platinum' },
  { name: 'Gold', value: 'gold' },
  { name: 'Silver', value: 'silver' },
  { name: 'Bronze', value: 'bronze' },
];

export const CreateEventPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EventFormData>({
    defaultValues: {
      type: 'hybrid',
      requirements: [''],
      tracks: [{ name: '', description: '', color: '#3B82F6', maxTeams: undefined }],
      prizes: [{ title: '', description: '', value: '', position: 1 }],
      evaluationCriteria: [{ name: '', description: '', maxScore: 100, weight: 1 }],
      sponsors: []
    }
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement
  } = useFieldArray({ control, name: 'requirements' });

  const {
    fields: trackFields,
    append: appendTrack,
    remove: removeTrack
  } = useFieldArray({ control, name: 'tracks' });

  const {
    fields: prizeFields,
    append: appendPrize,
    remove: removePrize
  } = useFieldArray({ control, name: 'prizes' });

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria
  } = useFieldArray({ control, name: 'evaluationCriteria' });

  const {
    fields: sponsorFields,
    append: appendSponsor,
    remove: removeSponsor
  } = useFieldArray({ control, name: 'sponsors' });

  const watchedType = watch('type');

  const onSubmit = async (data: EventFormData) => {
    console.log('Event Data:', data);
    // Here you would send the data to your API
    alert('Event created successfully! (This is a demo)');
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Event details and description' },
    { number: 2, title: 'Schedule & Location', description: 'Dates, times, and venue' },
    { number: 3, title: 'Tracks & Prizes', description: 'Competition categories and rewards' },
    { number: 4, title: 'Evaluation', description: 'Judging criteria and scoring' },
    { number: 5, title: 'Sponsors', description: 'Partners and sponsors' },
    { number: 6, title: 'Review', description: 'Preview and submit' }
  ];

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm ${
                currentStep >= step.number
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {step.number}
            </div>
            <div className="ml-3 hidden md:block">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
                <CardDescription>
                  Provide basic information about your hackathon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Event Title*"
                  placeholder="e.g., SynapHack 3.0"
                  {...register('title', { required: 'Event title is required' })}
                  error={errors.title?.message}
                />

                <Textarea
                  label="Description*"
                  placeholder="Describe your hackathon, its goals, and what participants can expect..."
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  error={errors.description?.message}
                />

                <Input
                  label="Theme*"
                  placeholder="e.g., Innovation & Technology, Sustainability, Healthcare"
                  {...register('theme', { required: 'Theme is required' })}
                  error={errors.theme?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type*
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'online', label: 'Online', description: 'Virtual event' },
                      { value: 'offline', label: 'Offline', description: 'In-person event' },
                      { value: 'hybrid', label: 'Hybrid', description: 'Online + Offline' }
                    ].map((type) => (
                      <label
                        key={type.value}
                        className="relative flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          value={type.value}
                          {...register('type')}
                          className="sr-only"
                        />
                        <span className="font-medium">{type.label}</span>
                        <span className="text-sm text-gray-500">{type.description}</span>
                        <div className={`absolute inset-0 border-2 rounded-lg ${
                          watchedType === type.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-transparent'
                        }`} />
                      </label>
                    ))}
                  </div>
                </div>

                <Input
                  label="Maximum Participants"
                  type="number"
                  placeholder="e.g., 1000"
                  {...register('maxParticipants', { valueAsNumber: true })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  List any requirements or eligibility criteria for participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requirementFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input
                        placeholder="e.g., Must be 18+ years old"
                        {...register(`requirements.${index}` as const)}
                        className="flex-1"
                      />
                      {requirementFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendRequirement('')}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>
                  Set the dates and times for your hackathon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date*"
                    type="date"
                    {...register('startDate', { required: 'Start date is required' })}
                    error={errors.startDate?.message}
                  />
                  <Input
                    label="Start Time*"
                    type="time"
                    {...register('startTime', { required: 'Start time is required' })}
                    error={errors.startTime?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="End Date*"
                    type="date"
                    {...register('endDate', { required: 'End date is required' })}
                    error={errors.endDate?.message}
                  />
                  <Input
                    label="End Time*"
                    type="time"
                    {...register('endTime', { required: 'End time is required' })}
                    error={errors.endTime?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Registration Deadline*"
                    type="date"
                    {...register('registrationDeadline', { required: 'Registration deadline is required' })}
                    error={errors.registrationDeadline?.message}
                  />
                  <Input
                    label="Registration Time*"
                    type="time"
                    {...register('registrationTime', { required: 'Registration time is required' })}
                    error={errors.registrationTime?.message}
                  />
                </div>
              </CardContent>
            </Card>

            {(watchedType === 'offline' || watchedType === 'hybrid') && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>
                    Provide venue information for in-person attendees
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="City/Location*"
                    placeholder="e.g., San Francisco, CA"
                    {...register('location', { 
                      required: watchedType !== 'online' ? 'Location is required' : false 
                    })}
                    error={errors.location?.message}
                  />
                  <Textarea
                    label="Venue Details"
                    placeholder="e.g., TechHub Building, 123 Innovation Street, Conference Hall A"
                    {...register('venue')}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracks</CardTitle>
                <CardDescription>
                  Define competition categories for your hackathon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          label="Track Name*"
                          placeholder="e.g., AI/ML, Web3, FinTech"
                          {...register(`tracks.${index}.name` as const, { required: 'Track name is required' })}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <select
                              {...register(`tracks.${index}.color` as const)}
                              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            >
                              {trackColors.map(color => (
                                <option key={color.value} value={color.value}>
                                  {color.name}
                                </option>
                              ))}
                            </select>
                            <div 
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: watch(`tracks.${index}.color`) }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Textarea
                        label="Description"
                        placeholder="Describe this track and what types of projects it's looking for..."
                        {...register(`tracks.${index}.description` as const)}
                      />
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Max Teams (Optional)"
                          type="number"
                          placeholder="Leave empty for unlimited"
                          {...register(`tracks.${index}.maxTeams` as const, { valueAsNumber: true })}
                        />
                        
                        {trackFields.length > 1 && (
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeTrack(index)}
                              className="flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Track
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendTrack({ name: '', description: '', color: '#3B82F6' })}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Track
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prizes</CardTitle>
                <CardDescription>
                  Define prizes and rewards for winners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prizeFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Prize Title*"
                          placeholder="e.g., First Place, Best AI Solution"
                          {...register(`prizes.${index}.title` as const, { required: 'Prize title is required' })}
                        />
                        <Input
                          label="Value*"
                          placeholder="e.g., $10,000, MacBook Pro"
                          {...register(`prizes.${index}.value` as const, { required: 'Prize value is required' })}
                        />
                        <Input
                          label="Position*"
                          type="number"
                          placeholder="1"
                          {...register(`prizes.${index}.position` as const, { 
                            required: 'Position is required',
                            valueAsNumber: true
                          })}
                        />
                      </div>
                      
                      <div className="mt-4">
                        <Textarea
                          label="Description"
                          placeholder="Additional details about this prize..."
                          {...register(`prizes.${index}.description` as const)}
                        />
                      </div>
                      
                      {prizeFields.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removePrize(index)}
                            className="flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Prize
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendPrize({ title: '', description: '', value: '', position: prizeFields.length + 1 })}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prize
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                Define how projects will be judged and scored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteriaFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Criteria Name*"
                        placeholder="e.g., Innovation, Technical Implementation"
                        {...register(`evaluationCriteria.${index}.name` as const, { required: 'Criteria name is required' })}
                      />
                      <Input
                        label="Max Score*"
                        type="number"
                        placeholder="100"
                        {...register(`evaluationCriteria.${index}.maxScore` as const, { 
                          required: 'Max score is required',
                          valueAsNumber: true
                        })}
                      />
                      <Input
                        label="Weight*"
                        type="number"
                        step="0.1"
                        placeholder="1.0"
                        {...register(`evaluationCriteria.${index}.weight` as const, { 
                          required: 'Weight is required',
                          valueAsNumber: true
                        })}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Textarea
                        label="Description"
                        placeholder="Describe what judges should look for in this criteria..."
                        {...register(`evaluationCriteria.${index}.description` as const)}
                      />
                    </div>
                    
                    {criteriaFields.length > 1 && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCriteria(index)}
                          className="flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Criteria
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendCriteria({ name: '', description: '', maxScore: 100, weight: 1 })}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Criteria
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sponsors & Partners</CardTitle>
              <CardDescription>
                Add sponsors and partners to showcase their support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sponsorFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Sponsor Name*"
                        placeholder="e.g., TechCorp, Innovation Hub"
                        {...register(`sponsors.${index}.name` as const, { required: 'Sponsor name is required' })}
                      />
                      <Input
                        label="Website*"
                        placeholder="https://sponsor.com"
                        {...register(`sponsors.${index}.website` as const, { required: 'Website is required' })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tier*
                        </label>
                        <select
                          {...register(`sponsors.${index}.tier` as const, { required: 'Tier is required' })}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        >
                          {sponsorTiers.map(tier => (
                            <option key={tier.value} value={tier.value}>
                              {tier.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Logo URL"
                        placeholder="https://sponsor.com/logo.png"
                        {...register(`sponsors.${index}.logo` as const)}
                      />
                      <Textarea
                        label="Description"
                        placeholder="Brief description of the sponsor..."
                        {...register(`sponsors.${index}.description` as const)}
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSponsor(index)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Sponsor
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendSponsor({ 
                    name: '', 
                    logo: '', 
                    website: '', 
                    tier: 'bronze',
                    description: ''
                  })}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sponsor
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>
                Review your event details before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Launch</h3>
                <p className="text-gray-600 mb-6">
                  Your event is ready to be published. Participants will be able to discover and register for your hackathon.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPreview(true)}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Publish Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Create New Hackathon
        </h1>
        <p className="text-xl text-gray-600">
          Set up your hackathon with our step-by-step guide. Create an amazing experience for participants, judges, and sponsors.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <StepIndicator />
        
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
