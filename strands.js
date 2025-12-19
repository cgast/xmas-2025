// ============================================================ 
// 🎮 KONFIGURATIONSBEREICH - HIER KANNST DU ALLES ANPASSEN! 🎮 
// ============================================================ 
// 
// Gitter-Visualisierung (6x6): 
// 
//     0 1 2 3 4 5 
//   ┌─────────────┐ 
// 0 │ Z T M I G I │ 
// 1 │ I L B A U L │ 
// 2 │ P I R I T O │ 
// 3 │ L S I O A D │ 
// 4 │ Z E K P E A │ 
// 5 │ G A R T C H │ 
//   └─────────────┘ 
// 
// Wörter und ihre verschlungenen Pfade: 
// - MARIOKART: M(0,2)→A(1,3)→R(2,2)→I(2,3)→O(3,3)→K(4,2)→A(5,1)→R(5,2)→T(5,3) ← Spangram! 
// - BLITZ: B(1,2)→L(1,1)→I(2,1)→T(0,1)→Z(0,0) 
// - PILZ: P(2,0)→I(1,0)→L(1,1)→Z(0,0) 
// - LUIGI: L(1,5)→U(1,4)→I(0,5)→G(0,4)→I(0,3) 
// - PEACH: P(4,3)→E(4,4)→A(4,5)→C(5,4)→H(5,5) 
// - TOAD: T(2,4)→O(2,5)→A(3,4)→D(3,5) 
// - SIEG: S(3,1)→I(3,2)→E(4,1)→G(5,0) 
// 
// ============================================================ 

const CONFIG = { 
    theme: "Auf der Rennstrecke 🏎️", 
    rows: 6, 
    cols: 6, 

    // Das Buchstabengitter - jeder Buchstabe wird genutzt! 
    grid: [ 
        "ZTMIGI", 
        "ILBAUL", 
        "PIRITO", 
        "LSIOAD", 
        "ZEKPEA", 
        "GARTCH", 
    ], 

    // Die zu findenden Wörter 
    words: [ 
        { word: "MARIOKART", isSpangram: true }, // Das lange Spangram! 
        { word: "BLITZ", isSpangram: false }, 
        { word: "PILZ", isSpangram: false }, 
        { word: "LUIGI", isSpangram: false }, 
        { word: "PEACH", isSpangram: false }, 
        { word: "TOAD", isSpangram: false }, 
        { word: "SIEG", isSpangram: false }, 
    ], 

    maxHints: 2, 
    nextPage: "02-wordle.html", 
}; 

// ============================================================ 
// 🎮 SPIELLOGIK - AB HIER NICHTS ÄNDERN! 🎮 
// ============================================================ 

let selectedCells = []; 
let foundWords = []; 
let hintsLeft = CONFIG.maxHints; 
let isMouseDown = false; 
let wordPaths = {}; 

function findWordPath(word, grid, rows, cols) { 
    const directions = [ 
        [-1, -1], 
        [-1, 0], 
        [-1, 1], 
        [0, -1], 
        [0, 1], 
        [1, -1], 
        [1, 0], 
        [1, 1], 
    ]; 

    function dfs(row, col, idx, visited) { 
        if (idx === word.length) return []; 
        if (row < 0 || row >= rows || col < 0 || col >= cols) 
            return null; 
        const key = `${row},${col}`; 
        if (visited.has(key)) return null; 
        if (grid[row][col] !== word[idx]) return null; 

        visited.add(key); 
        if (idx === word.length - 1) return [{ row, col }]; 

        for (const [dr, dc] of directions) { 
            const result = dfs( 
                row + dr, 
                col + dc, 
                idx + 1, 
                new Set(visited), 
            ); 
            if (result) return [{ row, col }, ...result]; 
        } 
        return null; 
    } 

    for (let r = 0; r < rows; r++) { 
        for (let c = 0; c < cols; c++) { 
            if (grid[r][c] === word[0]) { 
                const path = dfs(r, c, 0, new Set()); 
                if (path) return path; 
            } 
        } 
    } 
    return null; 
} 

function validateGrid() { 
    const errors = []; 
    console.log("=== GITTER-VALIDIERUNG ==="); 
    console.log("Gitter:"); 
    CONFIG.grid.forEach((row, i) => console.log(`${i}: ${row}`)); 
    console.log(""); 

    for (const w of CONFIG.words) {
        const path = findWordPath(
            w.word,
            CONFIG.grid,
            CONFIG.rows,
            CONFIG.cols,
        );
        if (!path) {
            errors.push(w.word);
            console.log(`❌ ${w.word}: NICHT GEFUNDEN`);
        } else {
            wordPaths[w.word] = path;
            console.log(
                `✓ ${w.word}: ${path.map((p) => `(${p.row},${p.col})`).join("→")}`
            );
        }
    }

    if (errors.length > 0) {
        document.getElementById("validation-error").classList.add("visible");
        const errorList = document.getElementById("error-list");
        errors.forEach((word) => {
            const li = document.createElement("li");
            li.textContent = word;
            errorList.appendChild(li);
        });
    }
    return errors.length === 0;
}

function initGame() {
    document.getElementById("theme-text").textContent = CONFIG.theme;
    document.getElementById("hints-left").textContent = hintsLeft;
    document.getElementById("total-count").textContent = CONFIG.words.length;

    // Set grid columns CSS variable
    document.getElementById("grid").style.setProperty("--grid-cols", CONFIG.cols);

    // Validate grid first
    if (!validateGrid()) {
        return;
    }

    // Create grid
    const gridEl = document.getElementById("grid");
    for (let r = 0; r < CONFIG.rows; r++) {
        for (let c = 0; c < CONFIG.cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.textContent = CONFIG.grid[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("mousedown", () => startSelection(r, c));
            cell.addEventListener("mouseenter", () => continueSelection(r, c));
            cell.addEventListener("touchstart", (e) => {
                e.preventDefault();
                startSelection(r, c);
            });
            cell.addEventListener("touchmove", (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.classList.contains("cell")) {
                    continueSelection(
                        parseInt(element.dataset.row),
                        parseInt(element.dataset.col)
                    );
                }
            });

            gridEl.appendChild(cell);
        }
    }

    document.addEventListener("mouseup", endSelection);
    document.addEventListener("touchend", endSelection);

    // Create word display (hidden until found)
    const foundWordsEl = document.getElementById("found-words");
    CONFIG.words.forEach((w) => {
        const wordEl = document.createElement("div");
        wordEl.className = "found-word";
        wordEl.id = `word-${w.word}`;
        // Show placeholder with word length instead of the actual word
        const placeholder = w.isSpangram ? `⭐ ${"?".repeat(w.word.length)}` : "?".repeat(w.word.length);
        wordEl.textContent = placeholder;
        wordEl.dataset.word = w.word;
        wordEl.dataset.isSpangram = w.isSpangram;
        foundWordsEl.appendChild(wordEl);
    });
}

function startSelection(row, col) {
    isMouseDown = true;
    selectedCells = [{ row, col }];
    updateSelection();
}

function continueSelection(row, col) {
    if (!isMouseDown) return;
    const last = selectedCells[selectedCells.length - 1];
    if (last.row === row && last.col === col) return;

    // Check if adjacent (including diagonal)
    const rowDiff = Math.abs(row - last.row);
    const colDiff = Math.abs(col - last.col);
    if (rowDiff > 1 || colDiff > 1) return;

    // Check if already selected - if so, allow backtracking
    const existingIndex = selectedCells.findIndex(
        (c) => c.row === row && c.col === col
    );
    if (existingIndex !== -1) {
        // Backtrack to this cell
        selectedCells = selectedCells.slice(0, existingIndex + 1);
    } else {
        selectedCells.push({ row, col });
    }
    updateSelection();
}

function endSelection() {
    isMouseDown = false;
}

function updateSelection() {
    // Clear previous selection
    document.querySelectorAll(".cell.selected").forEach((c) => {
        c.classList.remove("selected");
    });

    // Mark selected cells
    selectedCells.forEach((c) => {
        const cell = document.querySelector(
            `.cell[data-row="${c.row}"][data-col="${c.col}"]`
        );
        if (cell && !cell.classList.contains("found")) {
            cell.classList.add("selected");
        }
    });

    // Update current word display
    const word = selectedCells.map((c) => CONFIG.grid[c.row][c.col]).join("");
    document.getElementById("current-word").textContent = word;
}

function clearSelection() {
    selectedCells = [];
    updateSelection();
    hideMessage();
}

function isValidPath(cells) {
    // Check that all cells are adjacent (including diagonally)
    for (let i = 1; i < cells.length; i++) {
        const prev = cells[i - 1];
        const curr = cells[i];
        const rowDiff = Math.abs(curr.row - prev.row);
        const colDiff = Math.abs(curr.col - prev.col);
        if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
            return false;
        }
    }
    // Check no cell is used twice
    const seen = new Set();
    for (const cell of cells) {
        const key = `${cell.row},${cell.col}`;
        if (seen.has(key)) return false;
        seen.add(key);
    }
    return true;
}

function submitWord() {
    const word = selectedCells.map((c) => CONFIG.grid[c.row][c.col]).join("");

    if (word.length < 3) {
        showMessage("Mindestens 3 Buchstaben!", "error");
        return;
    }

    if (foundWords.includes(word)) {
        showMessage("Bereits gefunden!", "error");
        return;
    }

    const wordConfig = CONFIG.words.find((w) => w.word === word);
    if (!wordConfig) {
        showMessage("Kein gültiges Wort!", "error");
        return;
    }

    // Verify the path is valid (adjacent cells, no repeats)
    if (!isValidPath(selectedCells)) {
        showMessage("Ungültiger Pfad!", "error");
        return;
    }

    // Word found!
    foundWords.push(word);
    const wordEl = document.getElementById(`word-${word}`);
    wordEl.classList.add("found");
    // Reveal the actual word
    wordEl.textContent = wordConfig.isSpangram ? `⭐ ${word}` : word;
    document.getElementById("found-count").textContent = foundWords.length;

    // Mark cells as found
    selectedCells.forEach((c) => {
        const cell = document.querySelector(
            `.cell[data-row="${c.row}"][data-col="${c.col}"]`
        );
        cell.classList.remove("selected");
        cell.classList.add("found");
        if (wordConfig.isSpangram) {
            cell.classList.add("spangram");
        }
    });

    if (wordConfig.isSpangram) {
        showMessage("🌟 SPANGRAM gefunden! 🌟", "success");
    } else {
        showMessage("✓ Richtig!", "success");
    }

    selectedCells = [];
    document.getElementById("current-word").textContent = "";

    // Check if game is complete
    if (foundWords.length === CONFIG.words.length) {
        setTimeout(() => {
            showMessage("🎉 Alle Wörter gefunden! 🎉", "success");
            document.getElementById("next-button").classList.add("visible");
        }, 500);
    }
}

function showHint() {
    if (hintsLeft <= 0) {
        showMessage("Keine Hinweise mehr!", "error");
        return;
    }

    // Find an unfound word
    const unfoundWord = CONFIG.words.find((w) => !foundWords.includes(w.word));
    if (!unfoundWord) return;

    const path = wordPaths[unfoundWord.word];
    if (!path || path.length === 0) return;

    // Highlight first letter
    const firstCell = path[0];
    const cell = document.querySelector(
        `.cell[data-row="${firstCell.row}"][data-col="${firstCell.col}"]`
    );
    if (cell) {
        cell.style.animation = "pulse 0.5s 3";
        setTimeout(() => {
            cell.style.animation = "";
        }, 1500);
    }

    hintsLeft--;
    document.getElementById("hints-left").textContent = hintsLeft;
    const hintType = unfoundWord.isSpangram ? "das Spangram" : "ein Wort";
    showMessage(`Hinweis: Suche ${hintType} mit ${unfoundWord.word.length} Buchstaben!`, "success");
}

function showMessage(text, type) {
    const msgEl = document.getElementById("message");
    msgEl.textContent = text;
    msgEl.className = `message ${type}`;
}

function hideMessage() {
    const msgEl = document.getElementById("message");
    msgEl.className = "message";
}

function goToNext() {
    window.location.href = CONFIG.nextPage;
}

initGame();