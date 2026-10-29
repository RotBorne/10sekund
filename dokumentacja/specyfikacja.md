# Specyfikacja projektu *Co Kto?*

**Wersja specyfikacji:** 1.0.0
**Status:** w trakcje realizacji

## Opis projektu
**aplikacja *Co Kto?*** to aplikacja mobilna do zarządzania obowiązkami domowymi. Służąca m.in. do: rozdzielania ich pomiędzy domownikami, przeglądaniu statystyk zadań, dodawaniu prywatnych notatek przez użytkownika, kontroli zadań wykonywanych przez dziecko oraz naliczania kieszonkowego.

## Użyte technologie
1. **Backend:** JavaScript (Node.js) + express
2. **Baza danych:** PostgreSQL
3. **Frontend:** React Native

## Typy użytkowników
1. Współlokator chce dzielić obowiązki sprawiedliwie pomiędzy wszystkich lokatorów mieszkania, mieć wgląd do statystyk oraz planowania wspólnych zakupów. Współlokator będący administratorem może zmieniać częstotliwość wykonywanych zadań oraz listę zadań głównych, ustalać ewentualne kary dla danego domostwa zasilające wspólny budżet.
2. Rodzic chce rozdzielać zadania pomiędzy dzieci, dodawać własne zadania i notatki oraz mieć możliwość automatycznego przydzielania kieszonkowego dla dziecka.

## Wymagania funkcjonalne
1. **Zarządzanie domem i członkami:** Umożliwianie tworzenia gospodarstw, zapraszanie domowników i przydział ról.
2. **Tworzenie i edycja grafików:** Elastyczne planowanie obowiązków, ustalanie terminów i automatyczna rotacja.
3. **Monitorowanie zadań:** Śledzenie stanu w czasie rzeczywistym, odznaczanie z opcją dodania zdjęcia.
4. **Interaktywny widok:** Podgląd kalendarza i zadań (widok tygodniowy/ miesięczny).
5. **Statystyki i raporty:** Podsumowania wkładu domowników z użyciem wykresów: kolumnowych, kołowych i zestawień procentowych

## User Stories
### 1. Niestandardowe zadania
Jako osoba która lubi dobrą organizacje, chcę mieć możliwość dodania niestandardowych zadań, żeby inni mieli informację o tym co dzieje się w mieszkaniu.
**given:** Użytkownik znajduje się na ekranie głównym grafiku
**when:** Użytkownik wybierze opcje "dodaj niestandardowe zadanie" i wybierze status (do wykonania lub wykonane)
**then:** Wszyscy domownicy zobaczą je w grafiku oraz otrzymają powiadomienie
### 2. Statystyki wkładu użytkownika
Jako współlokator, chcę mieć informacje na temat procentowego wkładu każdego mieszkańca, żeby nikt nie czuł się pokrzywdzony niesprawiedliwym podziałem zadań.
**given:** Użytkownik jest zalogowany i znajduje się w panelu wybranego domostwa
**when:** Przejdzie do zakładki "statystyki" i wybierze interesujący go okres
**then:** System wyświetli wykresy procentowego wkładu mieszkańców w obowiązkach
### 3. Zgłoszenie wyjazdu
Jako student chcę mieć możliwość zgłoszenia wyjazdu, żeby nie dostawać zadań i nie zaburzać harmonogramu, kiedy wracam w rodzinne strony.
**given:** Użytkownik wchodzi na swój profil
**when:** Użytkownik zaznaczy wyjazd w jakimś terminie
**then:** System usunie go z grafiku, przypisze zadania innym osobom oraz zablokuje jego udział w statystykach na ten czas
### 4. Kontrola wykonania zadania przez dziecko
Jako zabiegany rodzic chcę mieć możliwość sprawdzenia czy moje dziecko wykonało zadania na czas, żeby nie tracić czasu na upominanie i wypytywanie w trakcie pracy.
**given:** Dziecko oznaczyło zadanie jako wykonane
**when:** Rodzic otworzy harmonogram na swoim telefonie
**then:** Rodzic zobaczy status zadania, godzinę jego wykonania oraz opcjonalnie zdjęcie. 
### 5. Cotygodniowa rotacja obowiązków
Jako użytkownik chcę aby aplikacja automatycznie rotowała cotygodniowe zadania, żeby nie tracić czasu na ciągłe uzupełnianie grafiku.
**given:** Użytkownik sprawdza grafik na kolejne tygodnie
**when:** System automatycznie generuje grafik na nadchodzące tygodnie
**then:** Przydziały zadań są automatycznie przesuwane na kolejnych użytkowników w oparciu o ustaloną kolejność
