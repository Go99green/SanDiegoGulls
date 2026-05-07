'use client';
import { useState } from 'react';
import { AppShell } from '@/components/dashboard/AppShell';
import { OverviewView, PacingView, AdminView } from '@/components/dashboard/Views';
import { mockData } from '@/lib/mock-data';
import { NavSection } from '@/types/dashboard';

export default function Page() {
  const [section, setSection] = useState<NavSection>('overview');
  return (
    <AppShell section={section} onSectionChange={setSection}>
      {section === 'overview' && <OverviewView data={mockData} />}
      {section === 'pacing' && <PacingView data={mockData} />}
      {section === 'admin' && <AdminView data={mockData} />}
    </AppShell>
  );
}
