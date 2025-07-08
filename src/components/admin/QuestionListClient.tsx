"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc/client";
import { QuestionScheduleModal } from "./QuestionScheduleModal";

interface Question {
  id: string;
  title: string;
  description: string | null;
  questionType: string;
  category: string;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  responseCount: number;
}

interface QuestionListClientProps {
  initialQuestions: Question[];
  userEmail?: string;
}

export function QuestionListClient({ initialQuestions, userEmail: _userEmail }: QuestionListClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    questionId: string;
    questionTitle: string;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    isOpen: false,
    questionId: "",
    questionTitle: "",
    startDate: null,
    endDate: null,
  });

  const toggleMutation = api.admin.toggleQuestionStatus.useMutation({
    onMutate: ({ id, isActive }) => {
      setIsToggling(id);
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isActive } : q)));
    },
    onSuccess: () => {
      setIsToggling(null);
    },
    onError: (error, { id }) => {
      setIsToggling(null);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, isActive: !q.isActive } : q
        )
      );
      console.error("Failed to toggle question status:", error);
    },
  });

  const handleToggleStatus = (questionId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    toggleMutation.mutate({ id: questionId, isActive: newStatus });
  };

  const handleOpenScheduleModal = (question: Question) => {
    setScheduleModal({
      isOpen: true,
      questionId: question.id,
      questionTitle: question.title,
      startDate: question.startDate,
      endDate: question.endDate,
    });
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleScheduleSuccess = (
    questionId: string,
    updatedSchedule: { startDate: Date | null; endDate: Date | null }
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, startDate: updatedSchedule.startDate, endDate: updatedSchedule.endDate }
          : q
      )
    );
  };

  // Filter questions
  const filteredQuestions = questions.filter((question) => {
    const categoryMatch = filterCategory === "all" || question.category === filterCategory;
    const typeMatch = filterType === "all" || question.questionType === filterType;
    return categoryMatch && typeMatch;
  });

  // Get unique categories and types for filters
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const questionTypes = Array.from(new Set(questions.map(q => q.questionType)));

  return (
    <div style={{ backgroundColor: 'var(--off-white)' }}>
      {/* Hero Section - Dramatic Typography */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 
          className="font-bold uppercase tracking-tight"
          style={{ 
            fontSize: 'var(--text-hero)', 
            color: 'var(--off-black)',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            marginBottom: 'var(--space-md)'
          }}
        >
          QUESTION DATABASE
        </h1>
        <div className="flex items-center justify-between">
          <p 
            className="font-medium"
            style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--warm-gray)',
              maxWidth: '65ch'
            }}
          >
            Manage research questions across all categories and question types. Activate, schedule, and analyze community feedback.
          </p>
          
          <Link 
            href="/admin/questions/new"
            className="inline-block font-bold uppercase transition-all duration-200 ease-out"
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--off-white)',
              backgroundColor: 'var(--primary)',
              padding: 'var(--space-md) var(--space-lg)',
              border: '2px solid var(--primary)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--off-black)';
              e.currentTarget.style.borderColor = 'var(--off-black)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
          >
            Create Question
          </Link>
        </div>
      </section>

      {/* Filters - Brutalist Button Groups */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 
          className="font-bold uppercase"
          style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--off-black)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          FILTER CONTROLS
        </h2>
        
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--warm-gray)',
                marginBottom: 'var(--space-sm)',
                letterSpacing: '0.05em'
              }}
            >
              BY CATEGORY
            </div>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setFilterCategory("all")}
                className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: filterCategory === "all" ? 'var(--off-white)' : 'var(--off-black)',
                  backgroundColor: filterCategory === "all" ? 'var(--primary)' : 'var(--off-white)',
                  border: '2px solid var(--off-black)',
                  borderRight: '1px solid var(--off-black)'
                }}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: filterCategory === category ? 'var(--off-white)' : 'var(--off-black)',
                    backgroundColor: filterCategory === category ? 'var(--primary)' : 'var(--off-white)',
                    border: '2px solid var(--off-black)',
                    borderLeft: '1px solid var(--off-black)',
                    borderRight: '1px solid var(--off-black)'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--warm-gray)',
                marginBottom: 'var(--space-sm)',
                letterSpacing: '0.05em'
              }}
            >
              BY TYPE
            </div>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setFilterType("all")}
                className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: filterType === "all" ? 'var(--off-white)' : 'var(--off-black)',
                  backgroundColor: filterType === "all" ? 'var(--primary)' : 'var(--off-white)',
                  border: '2px solid var(--off-black)',
                  borderRight: '1px solid var(--off-black)'
                }}
              >
                All
              </button>
              {questionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: filterType === type ? 'var(--off-white)' : 'var(--off-black)',
                    backgroundColor: filterType === type ? 'var(--primary)' : 'var(--off-white)',
                    border: '2px solid var(--off-black)',
                    borderLeft: '1px solid var(--off-black)',
                    borderRight: '1px solid var(--off-black)'
                  }}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Display */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            border: '2px solid var(--off-black)'
          }}
        >
          <div 
            className="border-r-2 p-4 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              {filteredQuestions.length}
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Showing
            </div>
          </div>
          
          <div 
            className="border-r-2 p-4 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--primary)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              {filteredQuestions.filter(q => q.isActive).length}
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Active
            </div>
          </div>
          
          <div 
            className="border-r-2 p-4 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              {filteredQuestions.reduce((total, q) => total + q.responseCount, 0)}
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Responses
            </div>
          </div>
          
          <div 
            className="p-4 text-center"
            style={{ 
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              {questions.length}
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Total
            </div>
          </div>
        </div>
      </section>

      {/* Questions List */}
      <section>
        <h2 
          className="font-bold uppercase"
          style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--off-black)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          QUESTIONS
        </h2>
        
        {filteredQuestions.length === 0 ? (
          <div 
            className="border-2 p-8 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--light-gray)'
            }}
          >
            <p 
              className="font-medium"
              style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--warm-gray)'
              }}
            >
              No questions match current filters
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id}
                className="border-2 border-b-0 p-6 last:border-b-2"
                style={{ 
                  borderColor: 'var(--off-black)',
                  backgroundColor: 'var(--off-white)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 
                        className="font-bold"
                        style={{ 
                          fontSize: 'var(--text-lg)', 
                          color: 'var(--off-black)'
                        }}
                      >
                        {question.title}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-mono px-2 py-1 text-xs uppercase"
                          style={{ 
                            backgroundColor: 'var(--light-gray)',
                            color: 'var(--warm-gray)',
                            border: '1px solid var(--warm-gray)'
                          }}
                        >
                          {question.questionType.replace('-', ' ')}
                        </span>
                        
                        <span 
                          className="font-mono px-2 py-1 text-xs uppercase"
                          style={{ 
                            backgroundColor: 'var(--light-gray)',
                            color: 'var(--warm-gray)',
                            border: '1px solid var(--warm-gray)'
                          }}
                        >
                          {question.category}
                        </span>
                        
                        <span 
                          className="font-mono px-2 py-1 text-xs uppercase"
                          style={{ 
                            backgroundColor: question.isActive ? 'var(--primary)' : 'var(--warm-gray)',
                            color: 'var(--off-white)',
                            border: `1px solid ${question.isActive ? 'var(--primary)' : 'var(--warm-gray)'}`
                          }}
                        >
                          {question.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    {question.description && (
                      <p 
                        className="font-medium"
                        style={{ 
                          fontSize: 'var(--text-sm)', 
                          color: 'var(--warm-gray)',
                          marginBottom: 'var(--space-sm)'
                        }}
                      >
                        {question.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div 
                        className="font-mono"
                        style={{ 
                          fontSize: 'var(--text-xs)', 
                          color: 'var(--warm-gray)'
                        }}
                      >
                        {question.responseCount} responses
                      </div>
                      
                      <div 
                        className="font-mono"
                        style={{ 
                          fontSize: 'var(--text-xs)', 
                          color: 'var(--warm-gray)'
                        }}
                      >
                        Created: {new Date(question.createdAt).toLocaleDateString()}
                      </div>
                      
                      {question.startDate && (
                        <div 
                          className="font-mono"
                          style={{ 
                            fontSize: 'var(--text-xs)', 
                            color: 'var(--warm-gray)'
                          }}
                        >
                          Start: {new Date(question.startDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {question.endDate && (
                        <div 
                          className="font-mono"
                          style={{ 
                            fontSize: 'var(--text-xs)', 
                            color: 'var(--warm-gray)'
                          }}
                        >
                          End: {new Date(question.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-0 ml-6">
                    <button
                      onClick={() => handleToggleStatus(question.id, question.isActive)}
                      disabled={isToggling === question.id}
                      className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--off-black)',
                        backgroundColor: 'var(--off-white)',
                        border: '2px solid var(--off-black)',
                        borderRight: '1px solid var(--off-black)',
                        opacity: isToggling === question.id ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (isToggling !== question.id) {
                          e.currentTarget.style.backgroundColor = 'var(--primary)';
                          e.currentTarget.style.color = 'var(--off-white)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isToggling !== question.id) {
                          e.currentTarget.style.backgroundColor = 'var(--off-white)';
                          e.currentTarget.style.color = 'var(--off-black)';
                        }
                      }}
                    >
                      {question.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => handleOpenScheduleModal(question)}
                      className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--off-black)',
                        backgroundColor: 'var(--off-white)',
                        border: '2px solid var(--off-black)',
                        borderLeft: '1px solid var(--off-black)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary)';
                        e.currentTarget.style.color = 'var(--off-white)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--off-white)';
                        e.currentTarget.style.color = 'var(--off-black)';
                      }}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Schedule Modal */}
      <QuestionScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={handleCloseScheduleModal}
        questionId={scheduleModal.questionId}
        questionTitle={scheduleModal.questionTitle}
        initialStartDate={scheduleModal.startDate}
        initialEndDate={scheduleModal.endDate}
        onSuccess={handleScheduleSuccess}
      />
    </div>
  );
}