import init, { start } from './pkg/portfolio_website.js';

async function run() {
    await init();
    start();
}

run();