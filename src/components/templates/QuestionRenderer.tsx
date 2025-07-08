"use client";

import React from "react";
import { ProcessedQuestion } from "@/hooks/useResearchPageOptimization";
import { ABTestQuestion } from "@/components/molecules/ABTestQuestion";
import { RankingQuestion } from "@/components/molecules/RankingQuestion";
import { MultiChoiceQuestion } from "@/components/molecules/MultiChoiceQuestion";
import { RatingQuestion } from "@/components/molecules/RatingQuestion";
import { TextQuestion } from "@/components/molecules/TextQuestion";

interface BinaryQuestionProps {
  question: ProcessedQuestion;
  onVote: (responseData: { selectedOption: string }) => void;
  disabled?: boolean;
  className?: string;
}


const BinaryQuestion: React.FC<BinaryQuestionProps> = ({
  question,
  onVote,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-off-black">{question.title}</h2>
        {question.description && (
          <p className="text-warm-gray text-sm leading-relaxed">
            {question.description}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {question.options?.map((option) => (
          <button
            key={option.id}
            onClick={() => onVote({ selectedOption: option.id })}
            disabled={disabled}
            className="w-full bg-off-white border-2 border-light-gray hover:border-primary p-4 text-left rounded-lg transition-colors disabled:opacity-50"
          >
            <div className="font-semibold text-off-black">{option.text}</div>
            {option.description && (
              <div className="text-warm-gray text-sm mt-1">{option.description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const UnsupportedQuestionType: React.FC<{ type: string; className?: string }> = ({
  type,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Unsupported Question Type
        </h2>
        <p className="text-red-600">
          Question type &quot;{type}&quot; is not supported yet.
        </p>
        <p className="text-red-600 text-sm mt-2">
          Please contact support if you see this message.
        </p>
      </div>
    </div>
  );
};

export interface QuestionRendererProps {
  question: ProcessedQuestion;
  onVote: (responseData: any) => void;
  currentIndex: number;
  totalQuestions: number;
  disabled?: boolean;
  className?: string;
}

export function QuestionRenderer({
  question,
  onVote,
  currentIndex,
  totalQuestions,
  disabled = false,
  className = "",
}: QuestionRendererProps) {
  // Determine question type from question structure
  const questionType = question.content?.type || 'binary';

  console.log('QuestionRenderer:', {
    questionType,
    questionId: question.id,
    currentIndex,
    totalQuestions,
    hasOptions: !!question.options,
    optionsCount: question.options?.length,
  });

  const commonProps = {
    question,
    disabled,
    className,
  };

  switch (questionType) {
    case 'binary':
      return (
        <BinaryQuestion
          {...commonProps}
          onVote={(data) => onVote(data)}
        />
      );

    case 'multi-choice':
      return (
        <MultiChoiceQuestion
          question={question.title}
          description={question.description}
          options={question.options || []}
          maxSelections={question.content?.maxSelections || 3}
          onChange={(selectedOptions) => onVote({ selectedOptions })}
          disabled={disabled}
          className={className}
        />
      );

    case 'rating-scale':
      return (
        <RatingQuestion
          question={question.title}
          description={question.description}
          scale={question.content?.scale || 10}
          variant={question.content?.variant || 'numbers'}
          onChange={(rating) => onVote({ rating, maxRating: question.content?.scale || 10 })}
          disabled={disabled}
          className={className}
        />
      );

    case 'text-response':
      return (
        <TextQuestion
          question={question.title}
          description={question.description}
          maxLength={question.content?.maxLength || 500}
          placeholder={question.content?.placeholder || 'Enter your response...'}
          onChange={(textResponse) => onVote({ textResponse })}
          disabled={disabled}
          className={className}
        />
      );

    case 'ranking':
      return (
        <RankingQuestion
          question={question.title}
          description={question.description}
          items={question.content?.items || []}
          onChange={(ranking) => onVote({ ranking })}
          disabled={disabled}
          className={className}
        />
      );

    case 'ab-test':
      return (
        <ABTestQuestion
          question={question.title}
          description={question.description}
          optionA={question.content?.optionA}
          optionB={question.content?.optionB}
          onChange={(selectedOption) => onVote({ selectedOption })}
          disabled={disabled}
          className={className}
        />
      );

    default:
      return (
        <UnsupportedQuestionType
          type={questionType}
          className={className}
        />
      );
  }
}

export default QuestionRenderer;