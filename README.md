# Padel Booking System

## Beskrivelse
Padel Booking System er en webapplikasjon bygget med React og Vite som lar brukere booke padelbaner, administrere bookinger, og håndtere brukerroller (bruker og admin). Applikasjonen lar brukere logge inn, booke tilgjengelige tidspunkter på baner, legge til medspillere, og vise sine egne bookinger på "Min side". Adminkontroller gir mulighet for å administrere brukere og bookinger, inkludert oppdatering, sletting, og visning av alle bookinger.

Data lagres i en ekstern API (CRUDcrud), og applikasjonen inkluderer autentisering, validering for dobbelbookinger, og responsiv design for en god brukeropplevelse. Prosjektet er utviklet som en del av en eksamen eller et læringseksperiment i React, TypeScript, og testing med Jest.

## Krav for å kjøre prosjektet
- Node.js (versjon 20 eller nyere)
- npm (versjon 9 eller nyere)
- En nettleser (f.eks. Chrome, Firefox, eller Edge)

## Installasjon og oppsett

### 1. Klone prosjektet
Klone dette repositoryet til din lokale maskin ved å bruke følgende kommando:

    git clone https://github.com/BendikBror/react_eksamen.git

### 2. Naviger til prosjektmappen
Gå til prosjektmappen:

    cd react_eksamen

### 3. Installer avhengigheter
Installer alle nødvendige avhengigheter ved å kjøre:

    npm install

### 4. Konfigurer miljøvariabler
Opprett en `.env`-fil i rotmappen av prosjektet og legg til følgende variabel for å koble til CRUDcrud-API-en:

    VITE_BASE_URL=https://crudcrud.com/api/fa0cace775a745b088dfb76559890859

Sørg for at `.env` er inkludert i `.gitignore` for å unngå å pushe sensitiv informasjon til versjonskontroll.

### 5. Kjør prosjektet
Start utviklingsserveren ved å kjøre:

    npm run dev

Dette vil starte Vite i utviklingsmodus, og applikasjonen vil være tilgjengelig på `http://localhost:5174` (eller en annen port, avhengig av konfigurasjon).

### 6. Kjør testene (valgfritt)
For å kjøre enhetstester med Jest, bruk:

    npm test

Eller i watch-modus:

    npm run test:watch

## Bruk av applikasjonen
- **Registrering og innlogging**: Besøk `/login` for å logge inn, eller `/register` for å opprette en ny bruker. Standard brukernavn/passord for en admin-bruker er `admin`/`admin`.
- **Booking**: Gå til `/booking` for å booke en bane, velg dato, tid, bane, antall spillere, og eventuelle medspillere.
- **Min side**: På `/minside` kan brukere se, endre, og slette sine egne bookinger.
- **Admin-panel**: Logg inn som admin og besøk `/admin` for å administrere brukere og bookinger.

## Teknologier
- **Frontend**: React, Vite, TypeScript
- **Styling**: CSS (vanlig eller modulbasert)
- **Testing**: Jest, React Testing Library
- **API**: CRUDcrud (for datalagring)
- **Autentisering**: Enkel kontekstbasert autentisering med Cookies