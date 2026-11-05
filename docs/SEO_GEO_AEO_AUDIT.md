# SEO-, GEO- und AEO-Ausbau – Analyse und Abnahme

Nutzerziel: „führe eine vollständige SEO/GEO/AEO analytic durch, die seite muss perfekt abgestimmt sind in allen branchen und bereichen, füge alles notwendige hinzu bis wir viele unterseiten und co haben.“

Entwicklungsbasis: a860544 auf codex/website-optimierung. Der vorangehende Optimierungsstand ist als Preview geprüft, aber noch nicht zur Produktion freigegeben. Dieser Auftrag erweitert ihn. Keine Liveveröffentlichung, externe Indexierungsübermittlung oder produktive Datenänderung ohne bestehende passende Freigabe. Kein Ranking, keine AI-Zitation und kein messbarer Traffic werden aus Quellcode oder einer Preview abgeleitet.

## 1. Autoritative Ausgangsdaten

- Liveabruf von Startseite, Leistungen, Blog, Kontakt, robots.txt und sitemap.xml in tests/output/search-live-baseline.json. Live-Startseite: Titel „Avelsorn“, H1 „Beratung und Projektarbeit“, keine JSON-LD-Unternehmensdaten. Mehrere abgerufene Seiten nutzen dieselbe allgemeine Beschreibung. Das betrifft den bisherigen Live-Stand, nicht die bereits verbesserte Vorschau.
- Live-Sitemap enthält die bisherigen Leistungen, Zielgruppen und fünf veröffentlichten Blogartikel. Über Avelsorn fehlt dort; im vorigen Entwicklungsstand ist die Seite bereits ergänzt.
- Live-robots erlaubt allgemeines öffentliches Crawling und sperrt Admin, Konto, API und Einrichtung. Die pauschale API-Sperre betrifft auch öffentlich freigegebene CMS-Medien. Eine präzisere Ausnahme für den tatsächlich öffentlichen Medienpfad wird ergänzt; private Dateien bleiben serverseitig geschützt und für Crawler ausgeschlossen.
- Die öffentliche Suchabfrage nach der exakten Domain lieferte im eingesetzten Suchwerkzeug keine Ergebnisse. Das beweist weder eine fehlende Google-/Bing-Indexierung noch eine konkrete Position. Keine erfundenen Suchvolumen, Rankings, Backlinks oder AI-Zitationen.
- Vollständiger technischer Live-Crawl: 36 öffentliche Seiten, 28 Sitemap-Einträge, keine P0/P1-Befunde im Crawler, eine Gruppe mit acht identischen Meta-Beschreibungen: Leistungen, Preise, Ablauf, Erstgespräch, Kontakt, Blog, Über Avelsorn und Widerruf. Der lokale Ausbau umfasst 68 öffentliche Seiten; erneuter Crawl mit Duplikatprüfung auch für noindex-Seiten ergab keine P0/P1/P2-Befunde.
- Es ist kein verbundener Search-Console-/Bing-Leistungsdatenzugriff verfügbar. Der Inhaber wurde nach vorhandenen Daten gefragt. Echte Suchanfragen, Klicks, CTR, Indexabdeckung, externe Verlinkungen und Suchergebnisse bleiben ohne diese Daten nicht vollständig bewertbar.

## 2. Technische Befunde und Maßnahmen

| Priorität | Befund | Maßnahme und Nachweis |
| --- | --- | --- |
| P0 | Neue Inhalte dürfen nicht versehentlich Live- oder Preview-Daten vermischen. | Bestehende isolierte Preview, Freigabegrenze, keine neuen Datenmodelle oder Zugangsdaten. |
| P1 | Noch keine Branchen-/Lösungs-/Wissenshierarchie. | Drei verlinkte Hubs mit eigenständigen Detailinhalten, eindeutigen URLs und serverseitigem HTML. |
| P1 | Indexierungsregeln an mehreren Stellen separat. | Gemeinsame Freigabepolitik für robots, Sitemap und Root-Metadaten; Preview bleibt auch bei widersprüchlichem Freigabeflag noindex. |
| P1 | CMS-Seiten fehlen in Sitemap; Systemseiten dürfen dort nicht landen. | Validierte öffentliche CMS-Pfade und deduplizierte dynamische Sitemap mit echten Änderungsdaten. |
| P1 | Entitäten und redaktionelle Zusammenhänge wenig deutlich. | Sachliche ProfessionalService-/WebSite-Daten, BreadcrumbList, Service beziehungsweise Article; keine Bewertungen oder erfundenen Qualifikationen. |
| P1 | Alte Inhalte benötigen ergänzende fachliche Orientierung. | Konkrete Branchenanforderungen, direkt nutzbare Vorlagen, verständliche Grenzen und passende Leistungs-/Paketverweise. |
| P2 | IndexNow ist noch nicht als dieser Ausbau produktiv aktiviert. | Kontrollierte Übermittlung erst nach genehmigter Veröffentlichung vorbereiten und prüfen; kein Indexierungsversprechen. |
| P2 | Wirkung kann noch nicht aus Leistungsdaten gemessen werden. | Messplan und Import-/Vergleichsgrundlage für echte Search-Console-/Bing-Daten; keine neue Trackingintegration ohne Freigabe. |

## 3. Seiten- und Suchintentionen

Alle vorhandenen sieben Leistungen, fünf Zielgruppen, fünf Blogbeiträge und Paketpreise bleiben erhalten. Die neuen Inhalte beantworten unterschiedliche Aufgaben statt nur einen Branchen- oder Ortsnamen auszutauschen.

- Branchen: Kanzleien, Hausverwaltungen, Kioske, Imbisse, Gastronomie, Einzelhandel, Handwerksbetriebe, Streamer, Influencer, Investoren und Trader. Technische Eignung wird beschrieben, keine bisherige Zusammenarbeit mit jeder Branche behauptet. Für regulierte Bereiche keine Rechts-/Anlageberatung oder fremden berufsrechtlichen Freigaben beanspruchen.
- Lösungen: Anfrageprozesse, Unterlagenanforderung, Dokumentenfreigaben, Kundenportale, Website-Relaunch, lokaler Onlineauftritt, Kooperationsanfragen, KI-gestützte Vorsortierung. Jede Seite grenzt konkrete Aufgaben, Vorbereitung, Fehlerfälle und Umfang ein.
- Wissen: Prozessaufnahme, Website-Briefing, Website-Kosten, Schnittstellenprüfung, Redaktionsplan, Website oder Webanwendung, Automatisierung oder KI, Geschäftsidee testen. Tabellen und Checklisten sind direkt ohne Anmeldung verwendbar.
- Ergänzend: zentrale Fragen zur Zusammenarbeit und eine echte Standortseite Castrop-Rauxel. Keine fiktiven Büros, offene Sprechstunde oder serienweisen Nachbarstadtseiten. Überregionale telefonische Zusammenarbeit wird von einem physischen Besuch unterschieden.
- 29 neue Detailinhalte und drei Hubs sind angelegt. Anzahl und Vollständigkeit werden automatisiert aus dem Katalog geprüft. Die Seiten sind noch nicht als veröffentlicht oder indexiert anzusehen.

Suchbegriffe in der späteren Matrix sind aus Angebot und Kundenfragen abgeleitete Themenhypothesen. Sie sind keine gemessenen Keywordvolumen. Die vorhandenen Leistungsseiten bleiben zentrale Angebotsseiten; Branchen erläutern einen Betriebskontext, Lösungen einen Vorgang, Wissen liefert eine selbst nutzbare Arbeitshilfe.

## 4. GEO/AEO nach überprüften Primärquellen

- Google: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide – SEO-Grundlagen und eigenständiger Nutzen bleiben relevant. Keine besonderen AI-Dateien oder Schematypen sind erforderlich. llms.txt ist kein Google-Rankinghebel. Es gibt keine ideale Seitenlänge.
- Google: https://developers.google.com/search/docs/essentials/spam-policies – Doorway- und skalierte Inhalte ohne Nutzwert vermeiden. Keine Stadtvarianten oder gleichartigen Keywordseiten allein für Rankings.
- Google: https://developers.google.com/search/updates – FAQ-Rich-Results werden seit 07.05.2026 nicht mehr gezeigt. Deshalb keine vermeintlich garantierten FAQ-Snippets und kein veraltetes FAQ-Rich-Result-Versprechen. Sichtbare Fragen und Antworten helfen Menschen unabhängig davon.
- OpenAI: https://developers.openai.com/api/docs/bots – OAI-SearchBot ist Suchzugriff, GPTBot betrifft Training; Einstellungen sind unabhängig. Die bestehende Trainingspräferenz wird nicht aus einem SEO-Auftrag neu abgeleitet. Öffentliche Inhalte bleiben über die gemeinsame Crawlergruppe zugänglich, private Pfade bleiben ausgeschlossen. Robots ist keine Zugriffskontrolle.
- IndexNow: https://www.indexnow.org/documentation – Eine erfolgreiche Übermittlung bestätigt Empfang, keine Indexierung oder Platzierung.

Die Hauptdatei des installierten SEO/GEO-Skills wurde gelesen. Dessen verlinkte Referenzdateien sind lokal nicht enthalten. Für überprüfbare Aussagen werden deshalb die oben genannten aktuellen Primärquellen verwendet; pauschale Skill-Aussagen über sofortige AI-Indexierung oder FAQ-Sichtbarkeit werden nicht ungeprüft übernommen.

## 5. Nachweise für die vollständige Abnahme

- [x] Aktuellen Arbeitsbaum und Live-Konfiguration prüfen; vorherige Preview von Live trennen.
- [x] Quellen abgleichen, fachliche und technische Lücken dokumentieren.
- [ ] Gesamte Live- und Preview-URL-Struktur mit Headern, Metadaten, Weiterleitungen, strukturierter Auszeichnung und internen Links crawlen.
- [x] Alle genannten Branchen und Leistungsbereiche durch tatsächlich unterschiedliche Inhalte und passende Querverweise abdecken.
- [x] Alle neuen Pfade, zentrale Preise, Formular-/Kontoabgrenzung, 404 und CMS-Pfadschutz prüfen.
- [x] Service-, Artikel-, Breadcrumb- und Unternehmensdaten im HTML sachlich und syntaktisch prüfen.
- [ ] Sitemap und Crawlerregeln in Produktions- und Preview-Konfiguration prüfen; keine privaten URLs veröffentlichen.
- [x] Suchintentionen und Überschneidungen im Inhaltskatalog prüfen; Avelsorn pflegt den Bestand und prüft fachliche Änderungen.
- [ ] Technik, Responsive-Ansichten, Tastaturbedienung, automatische Barrierefreiheit und Performance prüfen.
- [x] Kontrollierten IndexNow-Prozess und sichere Veröffentlichungsschritte vorbereiten.
- [x] Fehlende Daten zur tatsächlichen Suchleistung dokumentieren und Auswertung vorbereiten. Kein Export und kein verbundener Lesezugriff lagen für diesen Audit vor.
- [ ] Dokumentation und prüfbare isolierte Preview aktualisieren; Veröffentlichungsfreigabe separat einholen.

## 6. Messung ohne vorgetäuschte Ergebnisse

Ein technischer Crawl zeigt Erreichbarkeit und Auszeichnung, kein Suchranking. Nach einer genehmigten Veröffentlichung werden tatsächliche Sitemapaufnahme und Indexierungsbefunde im jeweiligen Suchdienst kontrolliert. Für organische Wirkung werden Suchanfrage, Zielseite, Impressionen, Klicks, CTR und Position aus echten exportierten Leistungsdaten getrennt für Google und Bing verglichen. Vergleichszeitraum und Quelle müssen genannt werden. AI-Erwähnungen werden nur mit Datum, exakter Frage, Anbieter und tatsächlich sichtbarer Quelle als Beobachtung erfasst; eine Einzelabfrage ist kein vollständiger Sichtbarkeitsnachweis. Keine automatische Rankingbehauptung aus Keywordlisten, Schema oder IndexNow.

### Messplan ab einer genehmigten Veröffentlichung

1. **Vorher:** Für die kanonische Domain je einen Bericht der letzten 28 vollständigen Tage exportieren. Bei [Google Search Console](https://support.google.com/webmasters/answer/12919797?hl=de) Suchtyp Web, Suchanfragen und Seiten getrennt; bei [Bing Webmaster Tools](https://www.bing.com/webmasters/help/search-performance-c680da36) Suchleistung, Webseiten und Suchbegriffe. Datum, Property, Land und Gerät mitführen. Falls erst kürzlich verifiziert, den kürzeren verfügbaren Zeitraum kennzeichnen.
2. **Nachher:** Nach 7 und 28 Tagen je eine neue URL aus Branchen, Lösungen und Wissen sowie die Startseite in beiden Diensten prüfen. Gefundene und indexierte URLs, Canonical-Abweichungen und Serverfehler dokumentieren. Sitemap und HTTP-Erreichbarkeit getrennt vom Indexierungsstatus behandeln.
3. **Wirkung:** Sobald 28 vollständige Tage vorliegen, gleiche Filter und Zeiträume vergleichen. Klickrate je Gruppe als Klicks geteilt durch Impressionen berechnen; bei null Impressionen bleibt sie undefiniert. Suchanfragen und Seiten nicht addieren. Exportzeilen können fehlen und je Dimension anders aggregieren; für Gesamtwerte das jeweilige Diagramm verwenden. Fragen mit vielen Impressionen und wenig Klicks zuerst auf Zielseitenpassung prüfen.
4. **Antwortsuche:** Wenn verfügbar, [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) separat exportieren. Zitationen sind keine Rankings oder Besuche. Ergänzend die unten stehenden Fragen bei verfügbaren Antwortdiensten wiederholen und tatsächlich verlinkte Quellen festhalten. Keine Erwähnung bei einer Stichprobe bedeutet nur, dass in dieser Antwort keine gesehen wurde.

| Prüfungsfrage | Erwartete eigene Belegseite, falls zitiert |
| --- | --- |
| Wie kann eine Hausverwaltung Reparaturanfragen schon beim Eingang dem richtigen Objekt zuordnen? | /branchen/hausverwaltungen |
| Welche Angaben braucht ein Imbiss auf seiner Website, damit Gäste aktuelle Öffnungszeiten und Speisekarte finden? | /branchen/imbisse |
| Wie nehme ich einen Büroprozess auf, bevor ich ihn automatisiere? | /wissen/prozessaufnahme-vorlage |
| Wann reichen feste Regeln zum Sortieren von Kundenanfragen und wann lohnt sich KI? | /wissen/automatisierung-oder-ki |
| Welche Informationen sollte ein Streamer vor einer Kooperation abfragen? | /loesungen/kooperationsanfragen |
| Wie läuft das kostenlose Erstgespräch bei Avelsorn ab? | /fragen oder /erstgespraech |

### Veröffentlichungsschritte

1. Vorschau prüfen und ausdrückliche Produktionsfreigabe abwarten. Dieser Ausbau benötigt keine neue Migration; die bislang nur in Preview eingespielte Gastbuchungs-Migration des mitgeführten Optimierungsstands separat nach Sicherung und Freigabe behandeln.
2. Live-Stand mit `npm run seo:audit -- --base=https://www.avelsorn.de --catalog --expect-indexable` prüfen. Alte Weiterleitungen und Bing-Verifizierung bestätigen. Keine Vorschau- oder Verwaltungsadressen bei Suchdiensten einreichen.
3. Optional IndexNow nach Freigabe aktivieren: `INDEXNOW_KEY` im Vercel-Produktionsprofil setzen, passenden Build ausliefern und zuerst `npm run seo:indexnow` ohne Versand ausführen. Erst wenn Sitemap, Canonical, öffentlicher Zugriff und Schlüsseldatei geprüft sind, die Übermittlung mit `--submit` auslösen. Erfolgsstatus ist nur eine Empfangsbestätigung.
