import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import { ColumnLayout } from './column-layout';

describe('Layout', () => {
  it('should show default content', () => {
    render(<ColumnLayout></ColumnLayout>);

    expect(screen.getByText('No content')).toBeInTheDocument();
  });

  it('should render user content', () => {
    const jsx = <div>Test</div>;
    render(<ColumnLayout>{jsx}</ColumnLayout>);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
