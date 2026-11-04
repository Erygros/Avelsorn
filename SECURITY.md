# Sicherheit und tatsächlicher Prüfstand

Next.js/TypeScript-Anwendung, keine PHP-Komponente und keine eigene Hostinginfrastruktur. Im Aufbau, keine Produktionsfreigabe.

Serverseitige Sitzungen mit zufälligem 256-Bit-Token; Datenbank speichert nur SHA-256-Tokenhash. HttpOnly, SameSite=Lax, Secure bei HTTPS; Rotation bei Anmeldung und Admin-Elevation, Widerruf aller Sitzungen nach Passwortreset. Passwörter über Scrypt mit individuellem Salt. Ein Admin, zusätzlich E-Mail-OTP (zehn Minuten, einmalig, maximal fünf Tokenversuche und Rate-Limit). Authentifizierte Mutationen prüfen den exakten Origin und geeigneten Content-Type. Autorisierung findet serverseitig statt; Adminmutationen verlangen bestätigtes OTP.

SQL-Abfragen über parametergebundenen Drizzle-Querybuilder. Eingaben über Zod; Texte escaped, CMS-/Mail-HTML über Allowlist bereinigt. CSP mit Nonce, Frame-Schutz, Referrer- und Berechtigungsheader. Private Dateien prüfen tatsächlichen MIME-Typ, Endung, Größe und Eigentum; keine direkte öffentliche Dateiablage. S3-Adapter verwendet privaten Speicher und authentifizierte Anwendungsdownloads.

Geheimnisse ausschließlich in ignorierter .env.local oder späteren Plattformvariablen. APP_SECRET verschlüsselt vertrauliche Mailinhalte und lokale Videosignale mit AES-256-GCM. BACKUP_KEY ist ein unabhängiger Schlüssel für verschlüsselte Backups und muss separat gesichert werden. Backups umfassen auch den verschlüsselten Anwendungsschlüssel, damit Nachrichten nach Wiederherstellung entschlüsselbar bleiben.

22 automatisierte Tests bestehen einschließlich Eigentumsprüfung, Origin-Abwehr, Passwort-/Tokenregeln, HTML-Bereinigung, Transaktionsverhalten und isolierter Wiederherstellung. Dies ist keine vollständige Sicherheitszertifizierung. Offene Fach- und Sicherheitsgrenzen stehen in PROGRESS.md. Reale SMTP-, Objektspeicher-, PostgreSQL-Netzwerk- und Videoanbindungen sind noch nicht abgenommen.

SMTP bietet keine beweisbare Zustellung im Posteingang und keine allgemeine Exactly-once-Garantie. An SMTP übergeben, fehlgeschlagen und unklarer Übergabestatus müssen getrennt bleiben. Unklare Vorgänge dürfen nicht blind erneut versendet werden.

Produktionsfreigabe verlangt vollständige Pflichtangaben, geeignete externe Dienstkonfiguration, bestandene Prüfungen und ausdrückliche Nutzerfreigabe. Es werden keine Testkonten oder Demo-Geschäftsdaten automatisch in der lokalen Hauptdatenbank angelegt. Testdaten liegen ausschließlich in isolierten Testdatenbanken.
