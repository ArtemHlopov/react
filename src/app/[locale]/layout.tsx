import type { Metadata } from 'next';
import { Providers } from '../../shared/providers';
import { ColumnLayout } from '../../shared/components/column-layout/column-layout';
import { routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import '../../index.css';

export const metadata: Metadata = {
  title: 'rs-react-app',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ru')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <ColumnLayout>{children}</ColumnLayout>
      </Providers>
    </NextIntlClientProvider>
  );
}
