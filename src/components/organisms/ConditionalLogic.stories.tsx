import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConditionalLogic, ConditionalField, ConditionalSection, conditions, type ConditionalRule } from './ConditionalLogic';
import { Input } from '../ui/Input';
import { ChoiceButton } from '../ui/ChoiceButton';
import { Checkbox, RadioGroup, RadioGroupItem } from '../ui/Input';
import { Label } from '../ui/Typography';

const meta: Meta<typeof ConditionalLogic> = {
  title: 'Organisms/ConditionalLogic',
  component: ConditionalLogic,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A powerful conditional logic system that shows/hides form elements based on user responses. Essential for creating dynamic questionnaires and adaptive user interfaces.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConditionalLogic>;

// Sample form component for demos
function SampleForm({ 
  initialData = {}, 
  rules = [], 
  debug = false 
}: { 
  initialData?: Record<string, any>; 
  rules?: ConditionalRule[]; 
  debug?: boolean; 
}) {
  const [formData, setFormData] = useState(initialData);
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-off-white dark:bg-gray-900 rounded-lg">
      <ConditionalLogic data={formData} rules={rules} debug={debug}>
        {(results) => (
          <div className="space-y-6">
            <div>
              <Label htmlFor="user-type">What type of user are you?</Label>
              <RadioGroup 
                value={formData.userType || ''}
                onValueChange={(value) => updateField('userType', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer">Developer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="designer" id="designer" />
                  <Label htmlFor="designer">Designer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manager" id="manager" />
                  <Label htmlFor="manager">Manager</Label>
                </div>
              </RadioGroup>
            </div>
            
            <ConditionalField fieldId="programming-languages" results={results}>
              <div>
                <Label htmlFor="languages">What programming languages do you use?</Label>
                <div className="mt-2 space-y-2">
                  {['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'].map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={lang}
                        checked={(formData.languages || []).includes(lang)}
                        onCheckedChange={(checked) => {
                          const current = formData.languages || [];
                          const updated = checked 
                            ? [...current, lang]
                            : current.filter(l => l !== lang);
                          updateField('languages', updated);
                        }}
                      />
                      <Label htmlFor={lang}>{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </ConditionalField>
            
            <ConditionalField fieldId="design-tools" results={results}>
              <div>
                <Label htmlFor="tools">What design tools do you use?</Label>
                <div className="mt-2 space-y-2">
                  {['Figma', 'Sketch', 'Adobe XD', 'Framer'].map(tool => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={tool}
                        checked={(formData.designTools || []).includes(tool)}
                        onCheckedChange={(checked) => {
                          const current = formData.designTools || [];
                          const updated = checked 
                            ? [...current, tool]
                            : current.filter(t => t !== tool);
                          updateField('designTools', updated);
                        }}
                      />
                      <Label htmlFor={tool}>{tool}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </ConditionalField>
            
            <ConditionalField fieldId="team-size" results={results}>
              <div>
                <Label htmlFor="team-size">How large is your team?</Label>
                <Input
                  id="team-size"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.teamSize || ''}
                  onChange={(e) => updateField('teamSize', parseInt(e.target.value) || 0)}
                  placeholder="Enter team size"
                  className="mt-2"
                />
              </div>
            </ConditionalField>
            
            <ConditionalSection sectionId="advanced-questions" results={results}>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
                <h3 className="font-semibold text-off-black dark:text-off-white">
                  Advanced Questions
                </h3>
                
                <div>
                  <Label htmlFor="experience">Years of experience?</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience || ''}
                    onChange={(e) => updateField('experience', parseInt(e.target.value) || 0)}
                    placeholder="Years"
                    className="mt-2"
                  />
                </div>
                
                <ConditionalField fieldId="senior-responsibilities" results={results}>
                  <div>
                    <Label>What are your senior-level responsibilities?</Label>
                    <div className="mt-2 space-y-2">
                      {['Architecture decisions', 'Team leadership', 'Code reviews', 'Mentoring'].map(resp => (
                        <div key={resp} className="flex items-center space-x-2">
                          <Checkbox
                            id={resp}
                            checked={(formData.responsibilities || []).includes(resp)}
                            onCheckedChange={(checked) => {
                              const current = formData.responsibilities || [];
                              const updated = checked 
                                ? [...current, resp]
                                : current.filter(r => r !== resp);
                              updateField('responsibilities', updated);
                            }}
                          />
                          <Label htmlFor={resp}>{resp}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </ConditionalField>
              </div>
            </ConditionalSection>
            
            {debug && (
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">Debug Info</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({ formData, activeRules: results.activeRules.map(r => r.name) }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </ConditionalLogic>
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const rules: ConditionalRule[] = [
      {
        id: 'show-programming-languages',
        name: 'Show programming languages for developers',
        condition: conditions.equals('userType', 'developer'),
        action: 'show',
      },
      {
        id: 'show-design-tools',
        name: 'Show design tools for designers',
        condition: conditions.equals('userType', 'designer'),
        action: 'show',
      },
      {
        id: 'show-team-size',
        name: 'Show team size for managers',
        condition: conditions.equals('userType', 'manager'),
        action: 'show',
      },
      {
        id: 'show-advanced-questions',
        name: 'Show advanced questions for large teams',
        condition: conditions.greaterThan('teamSize', 10),
        action: 'show',
      },
      {
        id: 'show-senior-responsibilities',
        name: 'Show senior responsibilities for experienced users',
        condition: conditions.greaterThan('experience', 5),
        action: 'show',
      },
    ];
    
    return <SampleForm rules={rules} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic conditional logic showing different form sections based on user type and responses.',
      },
    },
  },
};

export const ComplexConditions: Story = {
  render: () => {
    const rules: ConditionalRule[] = [
      {
        id: 'show-programming-languages',
        name: 'Show programming languages for developers',
        condition: conditions.equals('userType', 'developer'),
        action: 'show',
      },
      {
        id: 'show-design-tools',
        name: 'Show design tools for designers',
        condition: conditions.equals('userType', 'designer'),
        action: 'show',
      },
      {
        id: 'show-team-size',
        name: 'Show team size for managers or experienced developers',
        condition: conditions.or(
          conditions.equals('userType', 'manager'),
          conditions.and(
            conditions.equals('userType', 'developer'),
            conditions.contains('languages', 'TypeScript')
          )
        ),
        action: 'show',
      },
      {
        id: 'show-advanced-questions',
        name: 'Show advanced questions for large teams or senior developers',
        condition: conditions.or(
          conditions.greaterThan('teamSize', 5),
          conditions.and(
            conditions.equals('userType', 'developer'),
            conditions.greaterThan('experience', 3)
          )
        ),
        action: 'show',
      },
      {
        id: 'show-senior-responsibilities',
        name: 'Show senior responsibilities for very experienced users',
        condition: conditions.and(
          conditions.greaterThan('experience', 7),
          conditions.or(
            conditions.equals('userType', 'developer'),
            conditions.equals('userType', 'manager')
          )
        ),
        action: 'show',
      },
    ];
    
    return <SampleForm rules={rules} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex conditional logic with AND/OR operations and nested conditions.',
      },
    },
  },
};

export const WithDebugMode: Story = {
  render: () => {
    const rules: ConditionalRule[] = [
      {
        id: 'show-programming-languages',
        name: 'Show programming languages for developers',
        condition: conditions.equals('userType', 'developer'),
        action: 'show',
      },
      {
        id: 'show-design-tools',
        name: 'Show design tools for designers',
        condition: conditions.equals('userType', 'designer'),
        action: 'show',
      },
      {
        id: 'show-team-size',
        name: 'Show team size for managers',
        condition: conditions.equals('userType', 'manager'),
        action: 'show',
      },
    ];
    
    return <SampleForm rules={rules} debug={true} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Debug mode shows condition evaluation details in the browser console and on screen.',
      },
    },
  },
};

export const QuestionnaireExample: Story = {
  render: () => {
    const [currentData, setCurrentData] = useState<Record<string, any>>({});
    
    const rules: ConditionalRule[] = [
      {
        id: 'show-framework-experience',
        name: 'Show framework experience for developers',
        condition: conditions.equals('role', 'developer'),
        action: 'show',
      },
      {
        id: 'show-react-specific',
        name: 'Show React-specific questions',
        condition: conditions.contains('frameworks', 'React'),
        action: 'show',
      },
      {
        id: 'show-advanced-react',
        name: 'Show advanced React questions for experienced users',
        condition: conditions.and(
          conditions.contains('frameworks', 'React'),
          conditions.greaterThan('reactExperience', 2)
        ),
        action: 'show',
      },
      {
        id: 'require-portfolio',
        name: 'Require portfolio for senior developers',
        condition: conditions.and(
          conditions.equals('role', 'developer'),
          conditions.greaterThan('experience', 5)
        ),
        action: 'require',
        className: 'border-red-300 dark:border-red-700',
      },
    ];
    
    const updateField = (field: string, value: any) => {
      setCurrentData(prev => ({ ...prev, [field]: value }));
    };
    
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-6 bg-off-white dark:bg-gray-900 rounded-lg">
        <h2 className="text-xl font-semibold text-off-black dark:text-off-white mb-6">
          Developer Skills Assessment
        </h2>
        
        <ConditionalLogic data={currentData} rules={rules}>
          {(results) => (
            <div className="space-y-6">
              <div>
                <Label htmlFor="role">What is your primary role?</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['developer', 'designer', 'product-manager'].map(role => (
                    <ChoiceButton
                      key={role}
                      selected={currentData.role === role}
                      onClick={() => updateField('role', role)}
                      variant="outline"
                      className="capitalize"
                    >
                      {role.replace('-', ' ')}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
              
              <ConditionalField fieldId="framework-experience" results={results}>
                <div>
                  <Label>Which frameworks do you use?</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {['React', 'Vue', 'Angular', 'Svelte'].map(framework => (
                      <ChoiceButton
                        key={framework}
                        selected={(currentData.frameworks || []).includes(framework)}
                        onClick={() => {
                          const current = currentData.frameworks || [];
                          const updated = current.includes(framework)
                            ? current.filter(f => f !== framework)
                            : [...current, framework];
                          updateField('frameworks', updated);
                        }}
                        variant="outline"
                      >
                        {framework}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
              </ConditionalField>
              
              <ConditionalField fieldId="react-specific" results={results}>
                <div>
                  <Label htmlFor="react-experience">Years of React experience?</Label>
                  <Input
                    id="react-experience"
                    type="number"
                    min="0"
                    max="15"
                    value={currentData.reactExperience || ''}
                    onChange={(e) => updateField('reactExperience', parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
              </ConditionalField>
              
              <ConditionalField fieldId="advanced-react" results={results}>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Label>Advanced React Topics (select all you're familiar with)</Label>
                  <div className="mt-2 space-y-2">
                    {['Hooks', 'Context API', 'Server Components', 'Suspense', 'Concurrent Features'].map(topic => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={(currentData.advancedTopics || []).includes(topic)}
                          onCheckedChange={(checked) => {
                            const current = currentData.advancedTopics || [];
                            const updated = checked 
                              ? [...current, topic]
                              : current.filter(t => t !== topic);
                            updateField('advancedTopics', updated);
                          }}
                        />
                        <Label htmlFor={topic}>{topic}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </ConditionalField>
              
              <div>
                <Label htmlFor="experience">Total years of experience?</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="30"
                  value={currentData.experience || ''}
                  onChange={(e) => updateField('experience', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              
              <ConditionalField fieldId="portfolio" results={results}>
                <div>
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    Portfolio URL
                    {results.requirements['require-portfolio'] && (
                      <span className="text-red-600 text-sm">*Required</span>
                    )}
                  </Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={currentData.portfolio || ''}
                    onChange={(e) => updateField('portfolio', e.target.value)}
                    placeholder="https://your-portfolio.com"
                    className="mt-2"
                    required={results.requirements['require-portfolio']}
                  />
                </div>
              </ConditionalField>
            </div>
          )}
        </ConditionalLogic>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world questionnaire example showing how conditional logic creates adaptive forms for different user paths.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  render: () => {
    const rules: ConditionalRule[] = [
      {
        id: 'show-mobile-dev',
        name: 'Show mobile development options',
        condition: conditions.equals('platform', 'mobile'),
        action: 'show',
      },
      {
        id: 'show-native-tools',
        name: 'Show native development tools',
        condition: conditions.equals('approach', 'native'),
        action: 'show',
      },
      {
        id: 'show-cross-platform',
        name: 'Show cross-platform tools',
        condition: conditions.equals('approach', 'cross-platform'),
        action: 'show',
      },
    ];
    
    return (
      <div className="max-w-sm mx-auto">
        <SampleMobileForm rules={rules} />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized conditional logic with touch-friendly controls and responsive layout.',
      },
    },
  },
};

function SampleMobileForm({ rules }: { rules: ConditionalRule[] }) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="p-4 space-y-6">
      <ConditionalLogic data={formData} rules={rules}>
        {(results) => (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Platform</Label>
              <div className="mt-3 space-y-2">
                {['web', 'mobile', 'desktop'].map(platform => (
                  <ChoiceButton
                    key={platform}
                    selected={formData.platform === platform}
                    onClick={() => updateField('platform', platform)}
                    variant="outline"
                    className="w-full h-12 text-base capitalize"
                  >
                    {platform}
                  </ChoiceButton>
                ))}
              </div>
            </div>
            
            <ConditionalField fieldId="mobile-dev" results={results}>
              <div>
                <Label className="text-lg font-medium">Approach</Label>
                <div className="mt-3 space-y-2">
                  {['native', 'cross-platform', 'web-based'].map(approach => (
                    <ChoiceButton
                      key={approach}
                      selected={formData.approach === approach}
                      onClick={() => updateField('approach', approach)}
                      variant="outline"
                      className="w-full h-12 text-base"
                    >
                      {approach.replace('-', ' ')}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </ConditionalField>
            
            <ConditionalField fieldId="native-tools" results={results}>
              <div>
                <Label className="text-lg font-medium">Native Tools</Label>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {['Swift/iOS', 'Kotlin/Android', 'Objective-C', 'Java'].map(tool => (
                    <ChoiceButton
                      key={tool}
                      selected={(formData.nativeTools || []).includes(tool)}
                      onClick={() => {
                        const current = formData.nativeTools || [];
                        const updated = current.includes(tool)
                          ? current.filter(t => t !== tool)
                          : [...current, tool];
                        updateField('nativeTools', updated);
                      }}
                      variant="outline"
                      className="h-12 text-base"
                    >
                      {tool}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </ConditionalField>
            
            <ConditionalField fieldId="cross-platform" results={results}>
              <div>
                <Label className="text-lg font-medium">Cross-Platform</Label>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {['React Native', 'Flutter', 'Xamarin', 'Ionic'].map(tool => (
                    <ChoiceButton
                      key={tool}
                      selected={(formData.crossPlatformTools || []).includes(tool)}
                      onClick={() => {
                        const current = formData.crossPlatformTools || [];
                        const updated = current.includes(tool)
                          ? current.filter(t => t !== tool)
                          : [...current, tool];
                        updateField('crossPlatformTools', updated);
                      }}
                      variant="outline"
                      className="h-12 text-base"
                    >
                      {tool}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            </ConditionalField>
          </div>
        )}
      </ConditionalLogic>
    </div>
  );
}