import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

/**
 * Elevated Brutalism Admin Dashboard
 * Functional workspace for questionnaire management
 * Direct access to all creation and management tools
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  const questionTypes = [
    { 
      id: "binary", 
      name: "Binary Choice", 
      description: "Two-option questions for decisive feedback",
      example: "Magic links vs Traditional forms"
    },
    { 
      id: "multi-choice", 
      name: "Multiple Choice", 
      description: "Select multiple options from a list",
      example: "Which features matter most? (select up to 3)"
    },
    { 
      id: "rating-scale", 
      name: "Rating Scale", 
      description: "Numerical rating from 1-10",
      example: "Rate documentation quality (1-10)"
    },
    { 
      id: "text-response", 
      name: "Text Response", 
      description: "Open-ended written feedback",
      example: "What feature would you like to see next?"
    },
    { 
      id: "ranking", 
      name: "Ranking", 
      description: "Drag to reorder items by priority",
      example: "Rank these development priorities"
    },
    { 
      id: "ab-test", 
      name: "A/B Comparison", 
      description: "Compare two detailed options",
      example: "Magic links vs OAuth authentication"
    }
  ];

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
          QUESTIONNAIRE FACTORY
        </h1>
        <p 
          className="font-medium"
          style={{ 
            fontSize: 'var(--text-lg)', 
            color: 'var(--warm-gray)',
            maxWidth: '65ch',
            marginBottom: 'var(--space-lg)'
          }}
        >
          Research management workspace. Create, schedule, and analyze community feedback across all question formats.
        </p>
        
        {/* Primary CTA */}
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
          Create New Question
        </Link>
      </section>

      {/* Question Types Grid */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 
          className="font-bold uppercase"
          style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--off-black)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          SUPPORTED QUESTION TYPES
        </h2>
        
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            border: '2px solid var(--off-black)'
          }}
        >
          {questionTypes.map((type) => (
            <Link
              key={type.id}
              href={`/admin/questions/new?type=${type.id}`}
              className="block border-r-2 border-b-2 p-6 transition-all duration-200 ease-out"
              style={{ 
                borderColor: 'var(--off-black)',
                backgroundColor: 'var(--off-white)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                const title = e.currentTarget.querySelector('[data-title]') as HTMLElement;
                const desc = e.currentTarget.querySelector('[data-desc]') as HTMLElement;
                const example = e.currentTarget.querySelector('[data-example]') as HTMLElement;
                if (title) title.style.color = 'var(--off-white)';
                if (desc) desc.style.color = 'var(--off-white)';
                if (example) example.style.color = 'var(--off-white)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--off-white)';
                const title = e.currentTarget.querySelector('[data-title]') as HTMLElement;
                const desc = e.currentTarget.querySelector('[data-desc]') as HTMLElement;
                const example = e.currentTarget.querySelector('[data-example]') as HTMLElement;
                if (title) title.style.color = 'var(--off-black)';
                if (desc) desc.style.color = 'var(--warm-gray)';
                if (example) example.style.color = 'var(--warm-gray)';
              }}
            >
              <div 
                data-title
                className="font-bold uppercase"
                style={{ 
                  fontSize: 'var(--text-lg)', 
                  color: 'var(--off-black)',
                  marginBottom: 'var(--space-xs)'
                }}
              >
                {type.name}
              </div>
              <div 
                data-desc
                className="font-medium"
                style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--warm-gray)',
                  marginBottom: 'var(--space-sm)'
                }}
              >
                {type.description}
              </div>
              <div 
                data-example
                className="font-mono"
                style={{ 
                  fontSize: 'var(--text-xs)', 
                  color: 'var(--warm-gray)',
                  fontStyle: 'italic'
                }}
              >
&ldquo;{type.example}&rdquo;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Management Tools */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 
          className="font-bold uppercase"
          style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--off-black)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          MANAGEMENT TOOLS
        </h2>
        
        <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Link
            href="/admin/questions"
            className="block border-2 border-r-0 border-b-0 p-6 font-medium uppercase transition-all duration-200 ease-out"
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--off-black)',
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)',
              textDecoration: 'none'
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
            Question Database
            <div 
              className="mt-2 font-normal normal-case"
              style={{ 
                fontSize: 'var(--text-sm)', 
                opacity: 0.8
              }}
            >
              View, filter, activate/deactivate existing questions
            </div>
          </Link>
          
          <Link
            href="/admin/analytics"
            className="block border-2 border-r-0 border-b-0 p-6 font-medium uppercase transition-all duration-200 ease-out"
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--off-black)',
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)',
              textDecoration: 'none'
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
            Analytics Dashboard
            <div 
              className="mt-2 font-normal normal-case"
              style={{ 
                fontSize: 'var(--text-sm)', 
                opacity: 0.8
              }}
            >
              Voting patterns, response analytics, export tools
            </div>
          </Link>
          
          <Link
            href="/admin/content"
            className="block border-2 border-r-0 border-b-0 p-6 font-medium uppercase transition-all duration-200 ease-out"
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--off-black)',
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)',
              textDecoration: 'none'
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
            Content Management
            <div 
              className="mt-2 font-normal normal-case"
              style={{ 
                fontSize: 'var(--text-sm)', 
                opacity: 0.8
              }}
            >
              Edit blog posts, dynamic content blocks
            </div>
          </Link>
        </div>
      </section>

      {/* Current Stats */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 
          className="font-bold uppercase"
          style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--off-black)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          CURRENT METRICS
        </h2>
        
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            border: '2px solid var(--off-black)'
          }}
        >
          <div 
            className="border-r-2 p-6 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-xl)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              16
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Total Questions
            </div>
          </div>
          
          <div 
            className="border-r-2 p-6 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-xl)', 
                color: 'var(--primary)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              16
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Active
            </div>
          </div>
          
          <div 
            className="border-r-2 p-6 text-center"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-xl)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              0
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Total Votes
            </div>
          </div>
          
          <div 
            className="p-6 text-center"
            style={{ 
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono font-bold"
              style={{ 
                fontSize: 'var(--text-xl)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              0
            </div>
            <div 
              className="font-medium uppercase"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--warm-gray)',
                letterSpacing: '0.05em'
              }}
            >
              Today
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 
          className="font-bold uppercase"
          style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--off-black)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          SYSTEM STATUS
        </h2>
        
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            border: '2px solid var(--off-black)'
          }}
        >
          <div 
            className="border-r-2 p-6"
            style={{ 
              borderColor: 'var(--off-black)',
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-bold"
              style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--primary)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              ONLINE
            </div>
            <div 
              className="font-medium"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--off-black)'
              }}
            >
              Database • tRPC API • Email Service • Real-time Updates
            </div>
          </div>
          
          <div 
            className="p-6"
            style={{ 
              backgroundColor: 'var(--off-white)'
            }}
          >
            <div 
              className="font-mono"
              style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--off-black)',
                marginBottom: 'var(--space-xs)'
              }}
            >
              {session?.user?.email}
            </div>
            <div 
              className="font-mono"
              style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--warm-gray)'
              }}
            >
              {new Date().toLocaleDateString()} • Admin Session
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}