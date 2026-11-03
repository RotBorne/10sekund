## Wybór framework

**Wersja:** 1.0
**Status:** zaakceptowany\
**Data:** 04.11.2026\
**Autorzy:** 10 Sekund

### Kontekst: 
Musimy stworzyć nową aplikację, musi ona oferować płynne działanie (UX zbliżony do aplikacji natywnych), mieć dostęp do funkcji urządzenia (np. powiadomienia, aparat).
### Decyzja: 
Wybieramy React Native, ponieważ ma łatwy dostęp do modułów urządzenia np. aparat
### Konsekwencje:
**Pozytywne:**
- Pozwala natychmiast zobaczyć wprowadzone w kodzie zmiany bez potrzeby całkowitego kompilowania aplikacji od nowa
- bogaty ekosystem: Dostęp do setek gotowych bibliotek oraz narzędzi takich jak Expo, które ułatwiają konfigurację i wdrażanie aplikacji.
**Negatywne:**
- W przypadku specyficznych, bardzo zaawansowanych funkcji systemowych i tak może pojawić się konieczność napisania małego fragmentu kodu natywnego (Swift/Kotlin)
- Aktualizacje wersji React Native bywają czasochłonne i mogą powodować konflikty w zależnościach projektowych.
### Rozważane alternatywy:
1. React: odrzucono, ponieważ stwierdzono szersze zastosowanie funkcji aplikacji na urządzeniach mobilnych np. wykonywanie zdjęć
