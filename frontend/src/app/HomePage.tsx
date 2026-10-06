// The start page of the prototype: what a visitor can do here.
import { Button, PageTitle } from '@/ui';

export function HomePage() {
  return (
    <section>
      <PageTitle>Autowaschanlage</PageTitle>
      <Button to="/bookings/new">Waschtermin buchen</Button>
    </section>
  );
}
