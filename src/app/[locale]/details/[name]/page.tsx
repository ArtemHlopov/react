'use client';
import MainPage from '../../../../pages/main-page/main-page';
import { DetailsPanel } from '../../../../features/main-page/details-panel/details-panel';

export default function DetailsPage() {
  return (
    <MainPage filter={''}>
      <DetailsPanel />
    </MainPage>
  );
}
