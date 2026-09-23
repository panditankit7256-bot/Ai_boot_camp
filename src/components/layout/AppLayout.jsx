import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Database,
  FileText,
  AlertTriangle,
  MessageSquareText,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: Database },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
  { to: '/chat', label: 'Ask Invoices', icon: MessageSquareText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 text-slate-100 flex flex-col transition-transform md:translate-x-0">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-navy-700">
          <ShieldCheck className="w-7 h-7 text-brand-400" />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-wide">AgentForge</p>
            <p className="text-xs text-slate-400">AI Document Ops</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-navy-700 text-xs text-slate-400">
          Operations Console v1.0
        </div>
      </aside>
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-30">
          <h1 className="text-base font-semibold text-navy-800">AI Document Operations</h1>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            FastAPI Backend
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
