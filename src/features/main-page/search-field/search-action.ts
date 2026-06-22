'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '../../../i18n/navigation';

export async function searchAction(
  _prevState: unknown,
  formData: FormData
): Promise<void> {
  const query = (formData.get('query') as string)?.trim().toLowerCase() ?? '';
  const limit = formData.get('limit') as string;
  const locale = await getLocale();

  const params = new URLSearchParams();
  if (query) params.set('query', query);
  params.set('page', '1');
  if (limit) params.set('limit', limit);

  redirect({ href: `/?${params.toString()}`, locale });
}
