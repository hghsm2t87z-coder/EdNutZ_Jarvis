import {
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Forklift,
  GraduationCap,
  Heart,
  Lightbulb,
  PackageCheck,
  Rocket,
  Search,
  Target,
  Truck,
  UserRound,
  Warehouse,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../lib/store';
import { WORKSPACES, type WorkspaceId } from '../lib/workspaces';

type SectionCard = {
  title: string;
  description: string;
  icon: typeof Brain;
};

const sectionCards: Record<WorkspaceId, SectionCard[]> = {
  personal: [
    { title: 'Brain Dump', description: 'Capture thoughts fast before they disappear.', icon: Brain },
    { title: 'Ideas', description: 'Collect and develop creative ideas.', icon: Lightbulb },
    { title: 'Goals', description: 'Turn long-term goals into next actions.', icon: Target },
    { title: 'Research', description: 'Explore topics and save useful findings.', icon: Search },
    { title: 'Learning', description: 'Track skills, courses, and things to study.', icon: GraduationCap },
    { title: 'Projects', description: 'Move personal projects from idea to completion.', icon: CheckCircle2 },
    { title: 'Journal', description: 'Reflect, document progress, and think clearly.', icon: BookOpen },
    { title: 'Knowledge', description: 'Build your personal second brain.', icon: Heart },
  ],
  business: [
    { title: 'Ideas', description: 'Capture opportunities and evaluate what is worth building.', icon: Lightbulb },
    { title: 'Freight & Logistics', description: 'Brokerage, forwarding, customers, quotes, and operations.', icon: Truck },
    { title: 'AI & Software', description: 'Warehouse SaaS, apps, websites, and AI agents.', icon: Rocket },
    { title: 'Content Agency', description: 'Gym content, editing, social growth, and SEO services.', icon: Building2 },
    { title: 'Real Estate Media', description: 'Listing video, property content, leads, and clients.', icon: BriefcaseBusiness },
    { title: 'Leads', description: 'Keep prospects, follow-ups, and opportunities organized.', icon: Target },
    { title: 'Launches', description: 'Move validated ideas toward an actual launch.', icon: Rocket },
    { title: 'Revenue', description: 'Track what is making money and what needs attention.', icon: DollarSign },
  ],
  work: [
    { title: 'Today', description: 'Pull requests, deliveries, load/unload, and daily priorities.', icon: ClipboardList },
    { title: 'Inventory', description: 'Reference number, description, category, location, last job, and photos.', icon: PackageCheck },
    { title: 'Receiving', description: 'Inspect incoming freight and keep receiving organized.', icon: Warehouse },
    { title: 'Outbound', description: 'Stage, inspect, photograph, and load completed pieces.', icon: Forklift },
    { title: 'Freight', description: 'Track truck activity, paperwork, BOLs, and shipment details.', icon: Truck },
    { title: 'SOPs', description: 'Keep warehouse procedures easy to find and follow.', icon: BookOpen },
    { title: 'Improvement Ideas', description: 'Capture problems that can become better systems or products.', icon: Lightbulb },
  ],
};

const workspaceIcons = {
  personal: UserRound,
  business: Building2,
  work: BriefcaseBusiness,
};

export function WorkspaceHomePage() {
  const navigate = useNavigate();
  const activeWorkspace = useAppStore((s) => s.activeWorkspace);
  const conversations = useAppStore((s) => s.conversations);
  const createConversation = useAppStore((s) => s.createConversation);
  const selectedModel = useAppStore((s) => s.selectedModel);

  const workspace = WORKSPACES.find((item) => item.id === activeWorkspace)!;
  const WorkspaceIcon = workspaceIcons[activeWorkspace];
  const cards = sectionCards[activeWorkspace];

  const startChat = (starter?: string) => {
    createConversation(selectedModel);
    if (starter) {
      sessionStorage.setItem('eddy-jarvis-chat-draft', starter);
    }
    navigate('/');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-5 rounded-2xl p-5 sm:p-7"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div
                className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: 'var(--color-accent-subtle)',
                  color: 'var(--color-accent)',
                }}
              >
                <WorkspaceIcon size={14} />
                {workspace.name} workspace
              </div>
              <h1 className="text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--color-text)' }}>
                {workspace.name} Command Center
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
                {workspace.shortDescription}
              </p>
            </div>

            <button
              onClick={() => startChat()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
              }}
            >
              Start a {workspace.name} chat
              <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {cards.length}
            </div>
            <div className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              workspace sections
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {conversations.length}
            </div>
            <div className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              isolated chats
            </div>
          </div>
          <div
            className="col-span-2 rounded-xl p-4 sm:col-span-1"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              Memory boundary
            </div>
            <div className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Kept separate from your other workspaces unless you explicitly transfer something.
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
              {workspace.name} sections
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Built around the way you actually use this workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() =>
                  startChat(
                    `Help me work on ${card.title} inside my ${workspace.name} workspace.`,
                  )
                }
                className="group min-h-32 rounded-xl p-4 text-left transition-transform active:scale-[0.99]"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
                title={`Start a ${workspace.name} chat about ${card.title}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}
                  >
                    <Icon size={19} />
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--color-text-tertiary)' }} />
                </div>
                <div className="mt-4 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  {card.title}
                </div>
                <div className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {card.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
