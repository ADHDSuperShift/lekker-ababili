-- Seed Lesson Content for Lekker Ababili
-- English Lessons for Afrikaans Speakers

-- Lesson 1: Basic Greetings (English)
INSERT INTO public.lessons (
  language, 
  title, 
  title_af, 
  description, 
  description_af, 
  difficulty, 
  order_index,
  duration_minutes,
  is_premium,
  content
) VALUES (
  'en',
  'Basic Greetings',
  'Basiese Groete',
  'Learn how to greet people in English',
  'Leer hoe om mense in Engels te groet',
  'beginner',
  1,
  10,
  false,
  '{
    "type": "lesson",
    "sections": [
      {
        "type": "introduction",
        "title_af": "Welkom!",
        "content_af": "In hierdie les gaan ons leer hoe om mense in Engels te groet. Groete is baie belangrik in enige taal!",
        "audio_url": null
      },
      {
        "type": "vocabulary",
        "title_af": "Nuwe Woorde",
        "words": [
          {
            "english": "Hello",
            "afrikaans": "Hallo",
            "pronunciation": "heh-LOH",
            "example_en": "Hello, how are you?",
            "example_af": "Hallo, hoe gaan dit?"
          },
          {
            "english": "Good morning",
            "afrikaans": "Goeie môre",
            "pronunciation": "good MOR-ning",
            "example_en": "Good morning, everyone!",
            "example_af": "Goeie môre, almal!"
          },
          {
            "english": "Good afternoon",
            "afrikaans": "Goeie middag",
            "pronunciation": "good af-ter-NOON",
            "example_en": "Good afternoon, sir.",
            "example_af": "Goeie middag, meneer."
          },
          {
            "english": "Good evening",
            "afrikaans": "Goeie aand",
            "pronunciation": "good EEV-ning",
            "example_en": "Good evening, ladies.",
            "example_af": "Goeie aand, dames."
          },
          {
            "english": "Goodbye",
            "afrikaans": "Totsiens",
            "pronunciation": "good-BYE",
            "example_en": "Goodbye, see you later!",
            "example_af": "Totsiens, sien jou later!"
          }
        ]
      },
      {
        "type": "practice",
        "title_af": "Oefening",
        "exercises": [
          {
            "type": "multiple_choice",
            "question_af": "Hoe sê jy ''Goeie môre'' in Engels?",
            "options": ["Good morning", "Good evening", "Hello", "Goodbye"],
            "correct": 0,
            "explanation_af": "''Good morning'' beteken ''Goeie môre'' in Engels."
          },
          {
            "type": "multiple_choice",
            "question_af": "Wat beteken ''Goodbye'' in Afrikaans?",
            "options": ["Hallo", "Totsiens", "Dankie", "Asseblief"],
            "correct": 1,
            "explanation_af": "''Goodbye'' beteken ''Totsiens'' in Afrikaans."
          },
          {
            "type": "translation",
            "question_af": "Vertaal na Engels: ''Hallo, hoe gaan dit?''",
            "correct_answer": "Hello, how are you?",
            "hints_af": ["Begin met Hello", "how are you vra na jou welstand"]
          }
        ]
      },
      {
        "type": "summary",
        "title_af": "Opsomming",
        "content_af": "Goed gedaan! Jy het geleer hoe om mense in Engels te groet. Onthou om te oefen elke dag!",
        "learned": ["Hello", "Good morning", "Good afternoon", "Good evening", "Goodbye"]
      }
    ]
  }'
);

-- Lesson 2: Introducing Yourself (English)
INSERT INTO public.lessons (
  language,
  title,
  title_af,
  description,
  description_af,
  difficulty,
  order_index,
  duration_minutes,
  is_premium,
  content
) VALUES (
  'en',
  'Introducing Yourself',
  'Jouself Bekendstel',
  'Learn how to introduce yourself in English',
  'Leer hoe om jouself in Engels bekend te stel',
  'beginner',
  2,
  15,
  false,
  '{
    "type": "lesson",
    "sections": [
      {
        "type": "introduction",
        "title_af": "Kom ons leer!",
        "content_af": "In hierdie les gaan ons leer hoe om jouself aan ander mense bekend te stel in Engels."
      },
      {
        "type": "vocabulary",
        "title_af": "Nuttige Frases",
        "words": [
          {
            "english": "My name is...",
            "afrikaans": "My naam is...",
            "pronunciation": "my NAME iz",
            "example_en": "My name is John.",
            "example_af": "My naam is John."
          },
          {
            "english": "I am from...",
            "afrikaans": "Ek kom van...",
            "pronunciation": "I am FROM",
            "example_en": "I am from South Africa.",
            "example_af": "Ek kom van Suid-Afrika."
          },
          {
            "english": "Nice to meet you",
            "afrikaans": "Aangenaam kennis",
            "pronunciation": "NICE to MEET you",
            "example_en": "Nice to meet you, Sarah!",
            "example_af": "Aangenaam kennis, Sarah!"
          },
          {
            "english": "How are you?",
            "afrikaans": "Hoe gaan dit?",
            "pronunciation": "HOW are YOU",
            "example_en": "How are you today?",
            "example_af": "Hoe gaan dit vandag?"
          },
          {
            "english": "I am fine, thank you",
            "afrikaans": "Dit gaan goed, dankie",
            "pronunciation": "I am FINE, thank YOU",
            "example_en": "I am fine, thank you. And you?",
            "example_af": "Dit gaan goed, dankie. En jy?"
          }
        ]
      },
      {
        "type": "dialogue",
        "title_af": "Voorbeeld Gesprek",
        "conversation": [
          {"speaker": "Person A", "english": "Hello! My name is David.", "afrikaans": "Hallo! My naam is David."},
          {"speaker": "Person B", "english": "Hi David! I am Sarah. Nice to meet you!", "afrikaans": "Haai David! Ek is Sarah. Aangenaam kennis!"},
          {"speaker": "Person A", "english": "Nice to meet you too! Where are you from?", "afrikaans": "Aangenaam kennis ook! Waar kom jy vandaan?"},
          {"speaker": "Person B", "english": "I am from Cape Town. And you?", "afrikaans": "Ek kom van Kaapstad. En jy?"},
          {"speaker": "Person A", "english": "I am from Pretoria.", "afrikaans": "Ek kom van Pretoria."}
        ]
      },
      {
        "type": "practice",
        "title_af": "Toets Jouself",
        "exercises": [
          {
            "type": "fill_blank",
            "question_af": "Voltooi: ''My ____ is Peter.''",
            "answer": "name",
            "explanation_af": "''My name is'' beteken ''My naam is''."
          },
          {
            "type": "multiple_choice",
            "question_af": "Hoe sê jy ''Aangenaam kennis'' in Engels?",
            "options": ["Nice to meet you", "How are you", "Thank you", "Goodbye"],
            "correct": 0,
            "explanation_af": "''Nice to meet you'' beteken ''Aangenaam kennis''."
          }
        ]
      }
    ]
  }'
);

-- Lesson 3: Numbers 1-10 (English)
INSERT INTO public.lessons (
  language,
  title,
  title_af,
  description,
  description_af,
  difficulty,
  order_index,
  duration_minutes,
  is_premium,
  content
) VALUES (
  'en',
  'Numbers 1-10',
  'Nommers 1-10',
  'Learn to count from 1 to 10 in English',
  'Leer tel van 1 tot 10 in Engels',
  'beginner',
  3,
  10,
  false,
  '{
    "type": "lesson",
    "sections": [
      {
        "type": "vocabulary",
        "title_af": "Nommers",
        "words": [
          {"english": "One", "afrikaans": "Een", "pronunciation": "WUN", "number": 1},
          {"english": "Two", "afrikaans": "Twee", "pronunciation": "TOO", "number": 2},
          {"english": "Three", "afrikaans": "Drie", "pronunciation": "THREE", "number": 3},
          {"english": "Four", "afrikaans": "Vier", "pronunciation": "FOR", "number": 4},
          {"english": "Five", "afrikaans": "Vyf", "pronunciation": "FIVE", "number": 5},
          {"english": "Six", "afrikaans": "Ses", "pronunciation": "SIX", "number": 6},
          {"english": "Seven", "afrikaans": "Sewe", "pronunciation": "SEV-en", "number": 7},
          {"english": "Eight", "afrikaans": "Ag", "pronunciation": "ATE", "number": 8},
          {"english": "Nine", "afrikaans": "Nege", "pronunciation": "NINE", "number": 9},
          {"english": "Ten", "afrikaans": "Tien", "pronunciation": "TEN", "number": 10}
        ]
      },
      {
        "type": "practice",
        "title_af": "Oefen Tel",
        "exercises": [
          {
            "type": "matching",
            "question_af": "Pas die Engels woorde by die Afrikaanse woorde:",
            "pairs": [
              {"left": "One", "right": "Een"},
              {"left": "Five", "right": "Vyf"},
              {"left": "Ten", "right": "Tien"}
            ]
          }
        ]
      }
    ]
  }'
);

-- Spanish Lesson 1: Basic Greetings
INSERT INTO public.lessons (
  language,
  title,
  title_af,
  description,
  description_af,
  difficulty,
  order_index,
  duration_minutes,
  is_premium,
  content
) VALUES (
  'es',
  'Basic Greetings',
  'Basiese Groete',
  'Learn how to greet people in Spanish',
  'Leer hoe om mense in Spaans te groet',
  'beginner',
  1,
  10,
  false,
  '{
    "type": "lesson",
    "sections": [
      {
        "type": "introduction",
        "title_af": "Bienvenidos! (Welkom!)",
        "content_af": "In hierdie les gaan ons leer hoe om mense in Spaans te groet. Spaans is n pragtige taal wat in baie lande gepraat word!"
      },
      {
        "type": "vocabulary",
        "title_af": "Nuwe Woorde",
        "words": [
          {
            "spanish": "Hola",
            "afrikaans": "Hallo",
            "pronunciation": "OH-lah",
            "example_es": "¡Hola! ¿Cómo estás?",
            "example_af": "Hallo! Hoe gaan dit?"
          },
          {
            "spanish": "Buenos días",
            "afrikaans": "Goeie môre",
            "pronunciation": "BWEH-nos DEE-as",
            "example_es": "Buenos días, señor.",
            "example_af": "Goeie môre, meneer."
          },
          {
            "spanish": "Buenas tardes",
            "afrikaans": "Goeie middag",
            "pronunciation": "BWEH-nas TAR-des",
            "example_es": "Buenas tardes, amigos.",
            "example_af": "Goeie middag, vriende."
          },
          {
            "spanish": "Buenas noches",
            "afrikaans": "Goeie nag / Goeie aand",
            "pronunciation": "BWEH-nas NO-ches",
            "example_es": "Buenas noches, mamá.",
            "example_af": "Goeie nag, ma."
          },
          {
            "spanish": "Adiós",
            "afrikaans": "Totsiens",
            "pronunciation": "ah-dee-OHS",
            "example_es": "¡Adiós! Hasta luego.",
            "example_af": "Totsiens! Tot later."
          }
        ]
      },
      {
        "type": "practice",
        "title_af": "Oefening",
        "exercises": [
          {
            "type": "multiple_choice",
            "question_af": "Hoe sê jy ''Goeie môre'' in Spaans?",
            "options": ["Hola", "Buenos días", "Adiós", "Buenas noches"],
            "correct": 1,
            "explanation_af": "''Buenos días'' beteken ''Goeie môre'' in Spaans."
          }
        ]
      }
    ]
  }'
);

-- French Lesson 1: Basic Greetings
INSERT INTO public.lessons (
  language,
  title,
  title_af,
  description,
  description_af,
  difficulty,
  order_index,
  duration_minutes,
  is_premium,
  content
) VALUES (
  'fr',
  'Basic Greetings',
  'Basiese Groete',
  'Learn how to greet people in French',
  'Leer hoe om mense in Frans te groet',
  'beginner',
  1,
  10,
  false,
  '{
    "type": "lesson",
    "sections": [
      {
        "type": "introduction",
        "title_af": "Bienvenue! (Welkom!)",
        "content_af": "In hierdie les gaan ons leer hoe om mense in Frans te groet. Frans is die taal van romantiek!"
      },
      {
        "type": "vocabulary",
        "title_af": "Nuwe Woorde",
        "words": [
          {
            "french": "Bonjour",
            "afrikaans": "Goeie dag / Hallo",
            "pronunciation": "bohn-ZHOOR",
            "example_fr": "Bonjour, comment allez-vous?",
            "example_af": "Goeie dag, hoe gaan dit met u?"
          },
          {
            "french": "Salut",
            "afrikaans": "Haai / Hallo (informeel)",
            "pronunciation": "sah-LOO",
            "example_fr": "Salut! Ça va?",
            "example_af": "Haai! Gaan dit goed?"
          },
          {
            "french": "Bonsoir",
            "afrikaans": "Goeie aand",
            "pronunciation": "bohn-SWAHR",
            "example_fr": "Bonsoir, madame.",
            "example_af": "Goeie aand, mevrou."
          },
          {
            "french": "Au revoir",
            "afrikaans": "Totsiens",
            "pronunciation": "oh ruh-VWAHR",
            "example_fr": "Au revoir! À bientôt!",
            "example_af": "Totsiens! Tot siens!"
          },
          {
            "french": "Merci",
            "afrikaans": "Dankie",
            "pronunciation": "mehr-SEE",
            "example_fr": "Merci beaucoup!",
            "example_af": "Baie dankie!"
          }
        ]
      },
      {
        "type": "practice",
        "title_af": "Oefening",
        "exercises": [
          {
            "type": "multiple_choice",
            "question_af": "Hoe sê jy ''Dankie'' in Frans?",
            "options": ["Bonjour", "Salut", "Merci", "Au revoir"],
            "correct": 2,
            "explanation_af": "''Merci'' beteken ''Dankie'' in Frans."
          }
        ]
      }
    ]
  }'
);

-- Add a few achievements
INSERT INTO public.achievements (name, name_af, description, description_af, icon, criteria) VALUES
('First Lesson', 'Eerste Les', 'Complete your first lesson', 'Voltooi jou eerste les', '🎓', '{"lessons_completed": 1}'),
('Five Lessons', 'Vyf Lesse', 'Complete 5 lessons', 'Voltooi 5 lesse', '📚', '{"lessons_completed": 5}'),
('Week Streak', 'Week Streep', 'Study for 7 days in a row', 'Studeer vir 7 dae agtereenvolgens', '🔥', '{"streak_days": 7}'),
('Polyglot', 'Poliglot', 'Study 3 different languages', 'Studeer 3 verskillende tale', '🌍', '{"languages_count": 3}');
