!(function main() {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const dictionaries = [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z];
    const points = [1, 4, 4, 2, 1, 4, 3, 3, 1, 10, 5, 2, 4, 2, 1, 4, 10, 1, 1, 1, 2, 5, 4, 8, 3, 10];
    const connected = [[4, 5, 1], [0, 4, 5, 6, 2], [1, 3, 5, 6, 7], [2, 6, 7], [0, 1, 5, 8, 9], [0, 1, 2, 4, 6, 8, 9, 10], [1, 2, 3, 5, 7, 9, 10, 11], [2, 3, 6, 10, 11], [4, 5, 9, 12, 13], [4, 5, 6, 8, 10, 12, 13, 14], [5, 6, 7, 9, 11, 13, 14, 15], [6, 7, 10, 14, 15], [8, 9, 13], [8, 9, 10, 12, 14], [9, 10, 11, 13, 15], [10, 11, 14]];
    let pp = [], tempWord = [], wordList = [], score = 0, inputs = [], board, ttt = document.getElementById("tempWord");
    let timing = false, time = 180;

    function timer() {
        if (timing === false) {return}
        const tr = document.getElementById("timer");
        const int = setInterval(() => {
            let min = Math.floor(time / 60), sec = time % 60;
            time <= 10 ? tr.style.color = "#f1619d" : tr.style.color = "var(--dark)";
            time === 0 ? endGame(int) : time -= 1;
            sec < 10 ? tr.textContent = `${min}:0${sec}` : tr.textContent = `${min}:${sec}`;
        }, 1000);
    }

    function pick_dice() {
        const dice = ["AACIOT", "ABILTY", "ABJMOQ", "ACDEMP", "ACELRS", "ADENVZ", "AHMORS", "BIFORX", "DENOSW", "DKNOTU", "EEFHIY", "EGKLUY", "EGINTV", "EHINPS", "ELPSTU", "GILRUW"];
        let bb = [], pick = [];
        for (let i = 0; i < 16; i++) {
            pick.push(dice[i].charAt(Math.floor(Math.random() * 6)));
        }
        for (let i = 0; i < 16; i++) {
            let j = Math.floor(Math.random() * pick.length);
            if (pick[j] === "Q") { pick[j] = "Qu"; };
            bb[i] = pick[j];
            pick.splice(j, 1);
        }
        return bb;
    }

    async function new_game() {

        timing = false;
        board = pick_dice(); pp = [];
        document.getElementById("addTime").addEventListener("click", () => timing === false ? timing = false : time += 60);
        document.getElementById("numWordsMade").innerHTML = "0";
        document.getElementById("words").innerHTML = "";
        
        let possible = [];
        let k = 0;
        // TRAVERSE ALL 2-LETTER PATHS (84) AND STORE AS NUMBER ARRAYS [i,j] IN possible ARRAY
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < connected[i].length; j++) {
                possible.push([i, connected[i][j]]);
            }
        }
        // TRAVERSE ALL 3- TO 8-LETTER PATHS and ...
        function traverse() {
            let n = possible.length;
            for (let i = k; i < n; i++) {
                for (let j = 0; j < 16; j++) {
                    if (connected[possible[i][possible[i].length - 1]].includes(j) && !possible[i].includes(j)) {
                        possible.push(possible[i].concat(j));
                    }
                }
            }
            k = n + 1;
            if (n < 55009) { traverse(); }
            else { replace(); }
        }
        traverse();

        // REPLACE NUMBERS WITH LETTERS
        function replace() {
            for (let i = 0; i < 16; i++) {
                if (board[i] === "Qu") {
                    board[i] = "QU";
                }
            }
            let l = possible.length;
            for (let i = 0; i < l; i++) {
                let www = "";
                for (let j = 0; j < possible[i].length; j++) {
                    www += board[possible[i][j]];
                }
                possible[i] = www;
            }
            findGood();
        }

        function findGood() {
            // SEARCH ALL POSSIBLE WORDS ARE IN DICTIONARY; dd IS DICTIONARY TO SEARCH, ele IS possible[i]
            let bSearch = function (dd, ele) {
                let start = 0;
                let end = dd.length - 1;
                let middle = Math.floor(start + end / 2);
                while (dd[middle] !== ele && start <= end) {
                    if (ele < dd[middle]) {
                        end = middle - 1;
                    } else {
                        start = middle + 1;
                    }
                    middle = Math.floor((start + end) / 2)
                }
                return dd[middle] === ele ? middle : -1;
            }
            for (let i = 0; i < possible.length; i++) {
                let dd;
                for (let j = 0; j < 26; j++) {
                    if (letters[j] === possible[i].charAt(0)) {
                        dd = dictionaries[j];
                        break;
                    }
                }
                let isGood = bSearch(dd, possible[i]);
                if (isGood !== -1) {
                    pp.push(possible[i]);
                }
            }
            pp = [...new Set(pp)];
            pp.sort();
            return;
        }
        setupBoard();
    }
    new_game();
    async function setupBoard() {
        let bs = "";
        timing = true;
        timer();
        for (let i = 0; i < 16; i++) {
            if (board[i] === "QU") { board[i] = "Qu"; }
            bs += `<div class="cell"><span id="c${i}" class="tar"><span class="ltr">${board[i]}</span></span></div>`;
        }
        document.getElementById("wrapper").innerHTML = bs;
        document.getElementById("possibleWords").innerHTML = pp.length;
        document.getElementById("words").innerHTML = `<span>${pp.toString().split(',').join(',&nbsp</span><span>')}</span>`;
        listen();
    };

    function listen() {
        for (let i = 0; i < 16; i++) {
            document.getElementById(`c${i}`).addEventListener("pointerdown", makeWord);
        }
    }

    // ON POINTER DOWN, MAKING WORD FROM POINTEROVER LETTERS
    function makeWord() {
        inputs.push(Number(this.id.toString().split('c')[1]));
        let tempLetter = this.innerText;
        tempWord.push(tempLetter);
        ttt.innerText += tempLetter;
        this.parentElement.classList.add("used");
        for (let i = 0; i < 16; i++) {
            document.getElementById(`c${i}`).addEventListener("pointerover", concat);
        }
        window.addEventListener("pointerup", stopMakeword);
    }

    function concat() {
        let x = Number(this.id.toString().split('c')[1]);
        if (connected[inputs[inputs.length - 1]].includes(x) && !document.getElementById(this.id).parentElement.classList.contains("used")) {
            inputs.push(x);
            ttt.innerText += this.innerText;
            tempWord.push(this.innerText);
            document.getElementById(this.id).parentElement.classList.add("used");
        }
    }

    // CHECK USER INPUT WORD IS IN DICTIONARY
    function stopMakeword() {
        let wrds = document.getElementById("numWordsMade");
        if (tempWord[0] === "Qu") {
            tempWord[0] = "Q";
            tempWord.splice(1, 0, "U");
        }
        for (let i = 0; i < 26; i++) {
            if (tempWord[0] === letters[i]) {
                arr = dictionaries[i];
                break;
            }
        }
        let ele = tempWord.join('');
        let binarySearch = function (arr, ele) {
            let start = 0;
            let end = arr.length - 1;
            let middle = Math.floor(start + end / 2);
            while (arr[middle] !== ele && start <= end) {
                if (ele < arr[middle]) {
                    end = middle - 1;
                } else {
                    start = middle + 1;
                }
                middle = Math.floor((start + end) / 2)
            }
            return arr[middle] === ele ? middle : -1;
        }
        let isInDictionary = binarySearch(arr, ele);
        let tempScore = 0;

        function applyEffects(w) {
            for (i in inputs) {
                let inp = document.getElementById(`c${inputs[i]}`);
                inp.parentElement.classList.add(w);
                setTimeout(() => {
                    inp.parentElement.classList.remove(w);
                }, 200);
            }
        }

        if (wordList.includes(ele)) { applyEffects("played"); }
        else if (isInDictionary === -1) { applyEffects("bad"); }
        else {
            applyEffects("good");
            wordList.push(ele); // add to list of played words
            highlight(ele);
            for (let i = 0; i < tempWord.length; i++) {
                for (let j = 0; j < 26; j++) {
                    if (tempWord[i] === letters[j]) {
                        tempScore += points[j];
                        continue;
                    }
                }
            }
            wrds.innerHTML = wordList.length;
            increaseScore(tempWord.length, tempScore);
            // createParticles(e.clientX, e.clientY);
        }
        // remove listeners
        for (let i = 0; i < 16; i++) {
            document.getElementById(`c${i}`).removeEventListener("pointerover", concat);
            document.getElementById(`c${i}`).parentElement.classList.remove("used");
        }
        ttt.innerText = "";
        tempWord = [];
        inputs = [];
        window.removeEventListener("pointerup", stopMakeword);
    }

    // HIGHLIGHT MADE WORD IN words
    function highlight(w) {
        for (let i = 0; i < pp.length; i++) {
            if (pp[i] === w) {
                pp.splice(i, 1, `<span class="bright">${w}</span>`);
                document.getElementById("words").innerHTML = `<span>${pp.toString().split(',').join(',&nbsp</span><span>')}</span>`;
                break;
            }
        }
    }

    // ANIMATE SCORE INCREASE
    function increaseScore(l, tempScore) {
        let sc = document.getElementById("score");
        switch (true) {
            case (l === 5): tempScore *= 2; break;
            case (l === 6): tempScore *= 3; break;
            case (l > 6): tempScore *= 4; break;
        }
        let int = setInterval(() => {
            if (tempScore === 0) {
                clearInterval(int);
                return;
            }
            score++;
            tempScore--;
            sc.innerHTML = score;
        }, 80);
    }

    // END GAME
    function endGame() {
        timing = false;
        let wrds = document.getElementById("words");
        wrds.innerHTML = `<span>${pp.toString().split(',').join(',&nbsp</span><span>')}</span>`;
        wrds.style.color = "rgba(255, 255, 255, 0.4)";
        wrds.style.display = "flex";
        for (let i = 0; i < 16; i++) {
            document.getElementById(`c${i}`).removeEventListener("pointerdown", makeWord);
        }
    } 

})();
