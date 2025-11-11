const readline = require("readline");
const chalk = require("chalk");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

let players = ["Player 1", "Player 2"];
let currentPlayer = 0;
let symbols = ['O', 'X'];

function printBoard() {
    console.clear();
    console.log(chalk.bold.yellow("\n🎮 TIC TAC TOE\n"));
    console.log([
        chalk.gray(" --- --- --- ---"),
        chalk.gray("|   | 0 | 1 | 2 |"),
        chalk.gray(" --- --- --- ---"),
        `| 0 | ${colorize(board[0][0])} | ${colorize(board[0][1])} | ${colorize(board[0][2])} |`,
        `| 1 | ${colorize(board[1][0])} | ${colorize(board[1][1])} | ${colorize(board[1][2])} |`,
        `| 2 | ${colorize(board[2][0])} | ${colorize(board[2][1])} | ${colorize(board[2][2])} |`,
        chalk.gray(" --- --- --- ---"),
    ].join("\n"));
}

function colorize(cell) {
    if (cell === 'X') return chalk.redBright.bold(cell);
    if (cell === 'O') return chalk.blueBright.bold(cell);
    return chalk.gray(cell);
}

function askName(playerIndex, callback) {
    rl.question(chalk.cyan(`Enter name for Player ${playerIndex + 1}: `), (input) => {
        if (input.trim() !== "") players[playerIndex] = input.trim();
        callback();
    });
}

function init() {
    askName(0, () => {
        askName(1, () => {
            startGame();
        });
    });
}

function startGame() {
    console.log(chalk.greenBright(`\nWelcome, ${chalk.blueBright(players[0])} (O) and ${chalk.redBright(players[1])} (X)!`));
    console.log(chalk.gray("Let's get you to play.\n"));
    askMove();
}

function askMove() {
    printBoard();
    rl.question(chalk.cyan(`${players[currentPlayer]} (${symbols[currentPlayer]}), enter your move (row col): `), (input) => {
        const [row, col] = input.split(" ").map(Number);

        if (
            isNaN(row) || isNaN(col) ||
            row < 0 || row > 2 ||
            col < 0 || col > 2
        ) {
            console.log(chalk.red("❌ Invalid input. Please enter row and column between 0–2."));
            return setTimeout(askMove, 1000);
        }

        if (board[row][col] !== ' ') {
            console.log(chalk.yellow("⚠️  That cell is already taken!"));
            return setTimeout(askMove, 1000);
        }

        board[row][col] = symbols[currentPlayer];

        if (checkWin()) {
            printBoard();
            console.log(chalk.greenBright(`🎉 ${players[currentPlayer]} wins!`));
            return rl.close();
        }

        if (checkDraw()) {
            printBoard();
            console.log(chalk.magentaBright("🤝 It's a draw!"));
            return rl.close();
        }

        currentPlayer = 1 - currentPlayer;
        askMove();
    });
}

function checkDraw() {
    return board.flat().every(c => c !== ' ');
}

function checkWin() {
    const b = board;

    for (let i = 0; i < 3; i++) {
        if (b[i][0] === b[i][1] && b[i][1] === b[i][2] && b[i][0] !== ' ')
            return true;
    }

    for (let i = 0; i < 3; i++) {
        if (b[0][i] === b[1][i] && b[1][i] === b[2][i] && b[0][i] !== ' ')
            return true;
    }

    if (b[0][0] === b[1][1] && b[1][1] === b[2][2] && b[0][0] !== ' ') return true;
    if (b[0][2] === b[1][1] && b[1][1] === b[2][0] && b[0][2] !== ' ') return true;

    return false;
}

init();