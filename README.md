# Christmas 2025 Puzzle Game Collection

An interactive Christmas puzzle game collection built with HTML, CSS, and vanilla JavaScript. Features three sequentially-unlocked puzzle games with a Mario Kart theme, designed as a personalized gift experience.

## Games

### 1. Strands (Word Path Puzzle)
Find hidden words by tracing paths through a 6x6 letter grid. Theme: "Auf der Rennstrecke" (On the Race Track).

### 2. Wordle (Word Guessing)
Guess the secret 5-letter word in 6 attempts with color-coded feedback after each guess.

### 3. Connections (Group Matching)
Find 4 groups of 4 related words. Categories include Mario Kart characters, items, tracks, and vehicle parts.

### 4. Finale
Victory celebration with animated gift box reveal, fireworks, and confetti.

## Bonus Games

- **bonus/wordle/** - Standalone Wordle with random words and statistics tracking
- **bonus/connections/** - Standalone Connections game

## Project Structure

```
xmas-2025/
├── index.html           # Landing page
├── 01-strands.html      # Game 1: Word search
├── 02-wordle.html       # Game 2: Word guessing
├── 03-connections.html  # Game 3: Group matching
├── 04-finale.html       # Victory screen
├── common.js            # Shared snowflake animation
├── common.css           # Global styles
├── strands.js           # Strands game logic
├── strands.css          # Strands styles
├── index.css            # Landing page styles
└── bonus/
    ├── wordle/          # Bonus Wordle game
    └── connections/     # Bonus Connections game
```

## Features

- Pure HTML/CSS/JavaScript (no frameworks)
- Responsive design for desktop and mobile
- Touch and mouse input support
- Animated snowflakes, fireworks, and confetti
- German language interface
- LocalStorage for bonus game statistics

## Running

Open `index.html` in a web browser to start playing.

## License

See [LICENSE](LICENSE) for details.
