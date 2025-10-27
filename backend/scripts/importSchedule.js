import xlsx from 'xlsx';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Game from '../models/Game.js';
import Team from '../models/Team.js';
import League from '../models/League.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Import schedule from Excel file to MongoDB
 *
 * Expected Excel format:
 * | Date | Time | Home Team | Away Team | Venue | League |
 * |------|------|-----------|-----------|-------|--------|
 *
 * Usage: node importSchedule.js <path-to-excel-file>
 */

async function importSchedule(excelFilePath) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Read Excel file
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log(`✓ Found ${data.length} games in Excel file`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of data) {
      try {
        // Find or create teams
        const homeTeamName = row['Home Team'] || row['home_team'] || row['HomeTeam'];
        const awayTeamName = row['Away Team'] || row['away_team'] || row['AwayTeam'];
        const leagueName = row['League'] || row['league'];
        const date = row['Date'] || row['date'];
        const time = row['Time'] || row['time'];
        const venue = row['Venue'] || row['venue'];

        if (!homeTeamName || !awayTeamName) {
          console.log(`⚠ Skipping row - missing team names`);
          skipped++;
          continue;
        }

        // Find league
        let league = null;
        if (leagueName) {
          league = await League.findOne({ name: new RegExp(leagueName, 'i') });
          if (!league) {
            console.log(`⚠ League "${leagueName}" not found, creating without league reference`);
          }
        }

        // Find teams
        let homeTeam = await Team.findOne({ name: new RegExp(homeTeamName, 'i') });
        let awayTeam = await Team.findOne({ name: new RegExp(awayTeamName, 'i') });

        if (!homeTeam) {
          console.log(`⚠ Home team "${homeTeamName}" not found in database - skipping game`);
          skipped++;
          continue;
        }

        if (!awayTeam) {
          console.log(`⚠ Away team "${awayTeamName}" not found in database - skipping game`);
          skipped++;
          continue;
        }

        // Parse date
        let scheduledDate;
        if (typeof date === 'number') {
          // Excel date serial number
          scheduledDate = xlsx.SSF.parse_date_code(date);
          scheduledDate = new Date(scheduledDate.y, scheduledDate.m - 1, scheduledDate.d);
        } else if (date) {
          scheduledDate = new Date(date);
        } else {
          console.log(`⚠ Skipping row - missing date`);
          skipped++;
          continue;
        }

        // Check if game already exists
        const existingGame = await Game.findOne({
          homeTeam: homeTeam._id,
          awayTeam: awayTeam._id,
          scheduledDate: {
            $gte: new Date(scheduledDate.setHours(0, 0, 0, 0)),
            $lt: new Date(scheduledDate.setHours(23, 59, 59, 999))
          }
        });

        if (existingGame) {
          console.log(`⚠ Game already exists: ${homeTeamName} vs ${awayTeamName} on ${scheduledDate.toDateString()}`);
          skipped++;
          continue;
        }

        // Create game
        const game = new Game({
          league: league?._id,
          homeTeam: homeTeam._id,
          awayTeam: awayTeam._id,
          scheduledDate,
          scheduledTime: time || 'TBD',
          venue: venue || 'TBD',
          status: 'scheduled'
        });

        await game.save();
        console.log(`✓ Imported: ${homeTeamName} vs ${awayTeamName} on ${scheduledDate.toDateString()}`);
        imported++;

      } catch (err) {
        console.error(`✗ Error processing row:`, err.message);
        errors++;
      }
    }

    console.log('\n=== Import Summary ===');
    console.log(`✓ Successfully imported: ${imported} games`);
    console.log(`⚠ Skipped: ${skipped} games`);
    console.log(`✗ Errors: ${errors} games`);
    console.log(`📊 Total processed: ${data.length} rows`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node importSchedule.js <path-to-excel-file>');
  console.error('Example: node importSchedule.js schedule.xlsx');
  process.exit(1);
}

// Run import
importSchedule(filePath);
