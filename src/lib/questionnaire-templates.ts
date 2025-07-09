export interface QuestionTemplate {
  title: string;
  description?: string;
  questionType: string;
  questionData: Record<string, unknown>;
  category?: string;
  isRequired: boolean;
}

export interface QuestionnaireTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuestionTemplate[];
}

export const questionnaireTemplates: QuestionnaireTemplate[] = [
  {
    id: "product-research",
    title: "Product Feature Research",
    description: "Comprehensive survey to gather user feedback on new product features",
    category: "research",
    questions: [
      {
        title: "How often do you use our current product?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "daily", text: "Daily" },
            { id: "weekly", text: "Weekly" },
            { id: "monthly", text: "Monthly" },
            { id: "rarely", text: "Rarely" }
          ],
          maxSelections: 1
        },
        isRequired: true
      },
      {
        title: "Rate your overall satisfaction with our product",
        questionType: "rating-scale",
        questionData: {
          min: 1,
          max: 10,
          labels: {
            min: "Very Unsatisfied",
            max: "Very Satisfied"
          }
        },
        isRequired: true
      },
      {
        title: "Which features are most important to you?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "performance", text: "Performance improvements" },
            { id: "ui", text: "Better user interface" },
            { id: "mobile", text: "Mobile app" },
            { id: "integrations", text: "Third-party integrations" },
            { id: "analytics", text: "Advanced analytics" },
            { id: "collaboration", text: "Team collaboration features" }
          ],
          maxSelections: 3
        },
        isRequired: true
      },
      {
        title: "Would you recommend our product to others?",
        questionType: "binary",
        questionData: {
          optionA: { id: "yes", text: "Yes", description: "I would recommend it" },
          optionB: { id: "no", text: "No", description: "I would not recommend it" }
        },
        isRequired: true
      },
      {
        title: "Rank these potential new features by priority",
        questionType: "ranking",
        questionData: {
          items: [
            { id: "ai-assistant", text: "AI-powered assistant" },
            { id: "real-time-collab", text: "Real-time collaboration" },
            { id: "advanced-search", text: "Advanced search functionality" },
            { id: "custom-dashboards", text: "Custom dashboards" },
            { id: "api-access", text: "Developer API access" }
          ]
        },
        isRequired: true
      },
      {
        title: "What is your biggest challenge with our current product?",
        questionType: "text-response",
        questionData: {
          placeholder: "Please describe your main challenge...",
          maxLength: 500
        },
        isRequired: false
      },
      {
        title: "How likely are you to upgrade to a premium plan?",
        questionType: "rating-scale",
        questionData: {
          min: 1,
          max: 5,
          labels: {
            min: "Very Unlikely",
            max: "Very Likely"
          }
        },
        isRequired: true
      },
      {
        title: "Which pricing model would you prefer?",
        questionType: "ab-test",
        questionData: {
          optionA: {
            id: "monthly",
            title: "Monthly Subscription",
            description: "$29/month with all features included",
            features: ["All features", "Priority support", "Cancel anytime"]
          },
          optionB: {
            id: "annual",
            title: "Annual Subscription", 
            description: "$290/year (2 months free)",
            features: ["All features", "Priority support", "17% savings", "Bonus credits"]
          }
        },
        isRequired: true
      }
    ]
  },
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction Survey",
    description: "Quick survey to measure customer satisfaction and identify improvement areas",
    category: "feedback",
    questions: [
      {
        title: "How satisfied are you with our customer service?",
        questionType: "rating-scale",
        questionData: {
          min: 1,
          max: 10,
          labels: {
            min: "Very Unsatisfied",
            max: "Very Satisfied"
          }
        },
        isRequired: true
      },
      {
        title: "How easy was it to find what you were looking for?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "very-easy", text: "Very easy" },
            { id: "easy", text: "Easy" },
            { id: "neutral", text: "Neutral" },
            { id: "difficult", text: "Difficult" },
            { id: "very-difficult", text: "Very difficult" }
          ],
          maxSelections: 1
        },
        isRequired: true
      },
      {
        title: "Would you use our service again?",
        questionType: "binary",
        questionData: {
          optionA: { id: "yes", text: "Yes", description: "I would use it again" },
          optionB: { id: "no", text: "No", description: "I would not use it again" }
        },
        isRequired: true
      },
      {
        title: "What could we improve?",
        questionType: "text-response",
        questionData: {
          placeholder: "Please share your suggestions...",
          maxLength: 300
        },
        isRequired: false
      },
      {
        title: "How did you hear about us?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "search", text: "Search engine" },
            { id: "social", text: "Social media" },
            { id: "referral", text: "Friend/colleague referral" },
            { id: "advertising", text: "Online advertising" },
            { id: "other", text: "Other" }
          ],
          maxSelections: 1
        },
        isRequired: false
      }
    ]
  },
  {
    id: "employee-feedback",
    title: "Employee Feedback Survey",
    description: "Annual employee satisfaction and engagement survey",
    category: "feedback",
    questions: [
      {
        title: "How satisfied are you with your current role?",
        questionType: "rating-scale",
        questionData: {
          min: 1,
          max: 10,
          labels: {
            min: "Very Unsatisfied",
            max: "Very Satisfied"
          }
        },
        isRequired: true
      },
      {
        title: "How likely are you to recommend this company as a place to work?",
        questionType: "rating-scale",
        questionData: {
          min: 1,
          max: 10,
          labels: {
            min: "Not Likely",
            max: "Very Likely"
          }
        },
        isRequired: true
      },
      {
        title: "Which areas are most important for your job satisfaction?",
        questionType: "ranking",
        questionData: {
          items: [
            { id: "compensation", text: "Compensation & Benefits" },
            { id: "work-life", text: "Work-life balance" },
            { id: "career", text: "Career development opportunities" },
            { id: "management", text: "Relationship with manager" },
            { id: "culture", text: "Company culture" },
            { id: "recognition", text: "Recognition & feedback" }
          ]
        },
        isRequired: true
      },
      {
        title: "Do you feel valued by your immediate supervisor?",
        questionType: "binary",
        questionData: {
          optionA: { id: "yes", text: "Yes", description: "I feel valued and supported" },
          optionB: { id: "no", text: "No", description: "I don't feel valued" }
        },
        isRequired: true
      },
      {
        title: "What would you change about the company culture?",
        questionType: "text-response",
        questionData: {
          placeholder: "Share your thoughts on company culture...",
          maxLength: 500
        },
        isRequired: false
      }
    ]
  },
  {
    id: "market-research",
    title: "Market Research Study",
    description: "Understanding market preferences and competitive landscape",
    category: "research",
    questions: [
      {
        title: "Which competitor do you currently use?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "competitor-a", text: "Competitor A" },
            { id: "competitor-b", text: "Competitor B" },
            { id: "competitor-c", text: "Competitor C" },
            { id: "none", text: "None of the above" },
            { id: "multiple", text: "Multiple solutions" }
          ],
          maxSelections: 2
        },
        isRequired: true
      },
      {
        title: "What's your monthly budget for this type of solution?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "under-50", text: "Under $50" },
            { id: "50-100", text: "$50 - $100" },
            { id: "100-250", text: "$100 - $250" },
            { id: "250-500", text: "$250 - $500" },
            { id: "over-500", text: "Over $500" }
          ],
          maxSelections: 1
        },
        isRequired: true
      },
      {
        title: "Rate the importance of these factors when choosing a solution",
        questionType: "rating-scale",
        questionData: {
          min: 1,
          max: 5,
          labels: {
            min: "Not Important",
            max: "Very Important"
          }
        },
        isRequired: true
      },
      {
        title: "Which solution approach do you prefer?",
        questionType: "ab-test",
        questionData: {
          optionA: {
            id: "simple",
            title: "Simple & Easy",
            description: "Basic features that are easy to use",
            features: ["Quick setup", "Intuitive interface", "Basic reporting"]
          },
          optionB: {
            id: "advanced",
            title: "Advanced & Powerful",
            description: "Comprehensive features for power users",
            features: ["Advanced customization", "Detailed analytics", "API access", "Integrations"]
          }
        },
        isRequired: true
      }
    ]
  }
];

export function getTemplate(id: string): QuestionnaireTemplate | undefined {
  return questionnaireTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): QuestionnaireTemplate[] {
  return questionnaireTemplates.filter(template => template.category === category);
}