import { useEffect, useState, useCallback, useRef } from 'react';
import { Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import { WorkspaceHomePage } from './pages/WorkspaceHomePage';
import { WorkspaceRecordsPage } from './pages/WorkspaceRecordsPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { AgentsPage } from './pages/AgentsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { LogsPage } from './pages/LogsPage';
import { CommandPalette } from './components/CommandPalette';
import { SetupScreen } from './components/SetupScreen';
import { Toaster } from './components/ui/sonner';
import { useAppStore } from './lib/store';
import { fetchModels, fetchServerInfo, fetchSavings, submitSavings, isTauri } from './lib/api';
import { OptInModal } from './components/OptInModal';
import { UpdateChecker } from './components/Desktop/UpdateChecker';
import { track, hashId } from './lib/analytics';
import { offerAnalyticsChoice } from './lib/analytics-invitation';

export default function App() {
  const [setupDone, setSetupDone] = useState(!isTauri());
  const handleSetupReady = useCallback(() => {
    setSetupDone(true);
    if (!localStorage.getItem('oj-setup-completed')) {
      localStorage.setItem('oj-setup-completed', '1');
      track('setup_completed', { preset: 'default' });
    }
  }, []);
  const prevModelRef = useRef<string>('');
  const setModels = useAppStore((s) => s.setModels);
  const setModelsLoading = useAppStore((s) => s.setModelsLoading);
  const selectedModel = useAppStore((s) => s.selectedModel);
  const setServerInfo = useAppStore((s) => s.setServerInfo);
  const setSavings = useAppStore((s) => s.setSavings);
  const settings = useAppStore((s) => s.settings);
  const commandPaletteOpen = useAppStore((s) => s.commandPaletteOpen);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const optInEnabled = useAppStore((s) => s.optInEnabled);
  const optInDisplayName = useAppStore((s) => s.optInDisplayName);
  const optInEmail = useAppStore((s) => s.optInEmail);
  const optInAnonId = useAppStore((s) => s.optInAnonId);
  const optInModalSeen = useAppStore((s) => s.optInModalSeen);
  const optInModalOpen = useAppStore((s) => s.optInModalOpen);
  const setOptInModalOpen = useAppStore((s) => s.setOptInModalOpen);
  const markOptInModalSeen = useAppStore((s) => s.markOptInModalSeen);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    if (settings.theme === 'dark') root.classList.add('dark');
    else if (settings.theme === 'light') root.classList.add('light');
  }, [settings.theme]);

  const importOverlay = useAppStore((s) => s.importOverlayConversation);
  useEffect(() => {
    if (!isTauri()) return;
    importOverlay();
    const interval = setInterval(importOverlay, 5000);
    return () => clearInterval(interval);
  }, [importOverlay]);

  useEffect(() => {
    fetchModels().then(setModels).catch(() => setModels([])).finally(() => setModelsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchServerInfo().then(setServerInfo).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const refresh = () => fetchSavings().then((data) => {
      setSavings(data);
      if (optInEnabled && optInDisplayName && data) {
        const claudeEntry = data.per_provider.find((p) => p.provider === 'claude-fable-5');
        submitSavings({
          anon_id: optInAnonId,
          display_name: optInDisplayName,
          email: optInEmail,
          total_calls: data.total_calls,
          total_tokens: data.total_tokens,
          dollar_savings: claudeEntry ? claudeEntry.total_cost : 0,
          energy_wh_saved: data.per_provider.reduce((sum, p) => sum + (p.energy_wh || 0), 0),
          flops_saved: data.per_provider.reduce((sum, p) => sum + (p.flops || 0), 0),
          token_counting_version: data.token_counting_version ?? 1,
        });
      }
    }).catch(() => {});
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [optInEnabled, optInDisplayName, optInEmail, optInAnonId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => offerAnalyticsChoice({
    ready: setupDone,
    sharingModalSeen: optInModalSeen,
    open: () => setOptInModalOpen(true),
    markSharingModalSeen: markOptInModalSeen,
  }), [setupDone, optInModalSeen, setOptInModalOpen, markOptInModalSeen]);

  useEffect(() => {
    const prev = prevModelRef.current;
    const curr = selectedModel || '';
    prevModelRef.current = curr;
    if (!prev || !curr || prev === curr) return;
    void (async () => {
      const [fromHash, toHash] = await Promise.all([hashId(prev), hashId(curr)]);
      track('model_changed', { from_model_hash: fromHash, to_model_hash: toHash });
    })();
  }, [selectedModel]);

  useEffect(() => {
    const t = setTimeout(() => track('app_opened', {}), 500);
    return () => clearTimeout(t);
  }, []);

  const toggleSystemPanel = useAppStore((s) => s.toggleSystemPanel);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        toggleSystemPanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, toggleSystemPanel]);

  if (!setupDone) return <SetupScreen onReady={handleSetupReady} />;

  return (
    <>
      <UpdateChecker />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<WorkspaceHomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="workspace" element={<WorkspaceHomePage />} />
          <Route path="records" element={<WorkspaceRecordsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="get-started" element={<GetStartedPage />} />
          <Route path="data-sources" element={<DataSourcesPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
      {commandPaletteOpen && <CommandPalette />}
      {optInModalOpen && <OptInModal onClose={() => setOptInModalOpen(false)} />}
    </>
  );
}
