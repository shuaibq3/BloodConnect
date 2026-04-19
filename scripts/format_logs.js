const fs = require('fs');
const readline = require('readline');

async function processLineByLine(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log('# Conversation Log\n');

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      
      if (entry.type === 'USER_INPUT' && entry.content) {
        let content = entry.content;
        // Strip <USER_REQUEST> tags if present
        content = content.replace(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/, '$1').trim();
        // Remove ADDITIONAL_METADATA if present
        content = content.replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/, '').trim();
        
        console.log(`\n## USER\n\n${content}\n`);
      } else if (entry.type === 'PLANNER_RESPONSE' && entry.content) {
        console.log(`\n## AI\n\n${entry.content}\n`);
      }
    } catch (e) {
      // Skip non-json lines
    }
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  process.exit(1);
}

processLineByLine(args[0]);
