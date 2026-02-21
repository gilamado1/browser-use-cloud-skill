#!/usr/bin/env node
/**
 * Browser Use Cloud - Task Runner
 * 
 * Usage:
 *   node run-task.js "Your task description here"
 *   
 * Environment:
 *   BROWSER_USE_API_KEY - API key (required)
 *   MAX_STEPS - Max steps (default: 30)
 *   START_URL - URL to navigate to first (optional)
 *   STRUCTURED_OUTPUT - JSON schema for output (optional)
 */

const { BrowserUseClient } = require('browser-use-sdk');

const apiKey = process.env.BROWSER_USE_API_KEY;
if (!apiKey) {
    console.error('Error: BROWSER_USE_API_KEY environment variable not set');
    process.exit(1);
}

const taskDescription = process.argv.slice(2).join(' ');
if (!taskDescription) {
    console.error('Usage: node run-task.js "Your task description"');
    process.exit(1);
}

const maxSteps = parseInt(process.env.MAX_STEPS) || 30;
const startUrl = process.env.START_URL;
const structuredOutput = process.env.STRUCTURED_OUTPUT;

async function runTask() {
    const client = new BrowserUseClient({ apiKey });

    console.error(`Creating task: "${taskDescription.substring(0, 60)}..."`);
    console.error(`Max steps: ${maxSteps}`);
    if (startUrl) console.error(`Start URL: ${startUrl}`);

    const taskParams = {
        task: taskDescription,
        llm: 'browser-use-llm',
        maxSteps
    };

    if (startUrl) taskParams.startUrl = startUrl;
    if (structuredOutput) taskParams.structuredOutput = structuredOutput;

    const task = await client.tasks.createTask(taskParams);
    console.error(`Task ID: ${task.id}`);
    console.error('Running...');

    let finalResult = null;
    let dots = 0;

    for await (const update of task.watch()) {
        if (update.event === 'status' && update.data) {
            const status = update.data.status;
            
            // Progress indicator
            if (status === 'started') {
                process.stderr.write('.');
                dots++;
                if (dots % 50 === 0) process.stderr.write('\n');
            }

            if (status === 'finished' || status === 'stopped') {
                finalResult = update.data;
                break;
            }
        }
    }

    if (dots > 0) console.error(''); // newline after dots

    if (finalResult) {
        console.error(`Status: ${finalResult.status}`);
        console.error(`Success: ${finalResult.isSuccess}`);
        console.error('---');
        
        // Output to stdout (for piping)
        console.log(finalResult.output);
        
        process.exit(finalResult.isSuccess ? 0 : 1);
    } else {
        console.error('Error: No result received');
        process.exit(1);
    }
}

runTask().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
