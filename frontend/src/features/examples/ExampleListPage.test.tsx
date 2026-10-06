// Component test: Testing Library queries by role and text, never by CSS class, so a restyle of
// @/ui doesn't break it. The API is mocked with the generated MSW handlers.
import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { getListExamplesMockHandler } from '@/api/generated/examples/examples.msw';
import { renderWithProviders, server } from '@/test/setup';
import { ExampleListPage } from './ExampleListPage';

describe('ExampleListPage', () => {
  it('shows one row per example', async () => {
    server.use(
      getListExamplesMockHandler({
        items: [
          { id: '1', title: 'First example', status: 'OPEN', createdAt: '2026-01-01T00:00:00Z' },
          { id: '2', title: 'Second example', status: 'CLOSED', createdAt: '2026-01-02T00:00:00Z' },
        ],
        page: 0,
        size: 20,
        totalItems: 2,
      }),
    );

    renderWithProviders(<ExampleListPage />);

    expect(await screen.findByRole('table', { name: 'Examples' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'First example' })).toHaveAttribute('href', '/examples/1');
    expect(screen.getByRole('cell', { name: 'Closed' })).toBeInTheDocument();
  });

  it('asks the API for the page in the URL', async () => {
    let asked: string | null = null;
    server.use(
      getListExamplesMockHandler(({ request }) => {
        asked = new URL(request.url).searchParams.get('page');
        return { items: [], page: 2, size: 20, totalItems: 41 };
      }),
    );

    renderWithProviders(<ExampleListPage />, { route: '/examples?page=2' });

    expect(await screen.findByText('No examples yet.')).toBeInTheDocument();
    expect(asked).toBe('2');
  });

  it('says so when there are no examples', async () => {
    server.use(getListExamplesMockHandler({ items: [], page: 0, size: 20, totalItems: 0 }));

    renderWithProviders(<ExampleListPage />);

    expect(await screen.findByText('No examples yet.')).toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    server.use(
      http.get('*/api/examples', () =>
        HttpResponse.json({ status: 500, title: 'Internal Server Error' }, { status: 500 }),
      ),
    );

    renderWithProviders(<ExampleListPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('The examples could not be loaded.');
  });
});
