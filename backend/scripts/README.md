# Schedule Import Utility

This script allows you to import game schedules from Excel files into your MongoDB database.

## Setup

1. Make sure you have the required dependencies installed:
   ```bash
   cd backend
   npm install
   ```

2. Ensure your `.env` file has the correct `MONGODB_URI`

## Excel File Format

Your Excel file should have the following columns (column names are case-insensitive):

| Date       | Time    | Home Team | Away Team | Venue        | League          |
|------------|---------|-----------|-----------|--------------|-----------------|
| 2025-01-15 | 7:00 PM | Team A    | Team B    | Court 1      | Winter League   |
| 2025-01-16 | 8:30 PM | Team C    | Team D    | Court 2      | Winter League   |

### Column Details:

- **Date** (required): Game date in format MM/DD/YYYY or YYYY-MM-DD
- **Time** (optional): Game time (e.g., "7:00 PM", "19:00")
- **Home Team** (required): Name of home team (must exist in database)
- **Away Team** (required): Name of away team (must exist in database)
- **Venue** (optional): Game location
- **League** (optional): League name (must exist in database)

### Alternative Column Names:

The script supports these alternative column names:
- Date: `Date`, `date`
- Time: `Time`, `time`
- Home Team: `Home Team`, `home_team`, `HomeTeam`
- Away Team: `Away Team`, `away_team`, `AwayTeam`
- Venue: `Venue`, `venue`
- League: `League`, `league`

## Important Notes

⚠️ **Before importing:**

1. **Teams must exist** in your database before importing games. Create all teams first through the application or API.

2. **Leagues must exist** if you want to associate games with leagues. The league field is optional.

3. **No duplicates**: The script will skip games that already exist (same teams on the same date).

## Usage

### Method 1: Using npm script

```bash
cd backend
npm run import:schedule path/to/your/schedule.xlsx
```

### Method 2: Direct node command

```bash
cd backend
node scripts/importSchedule.js path/to/your/schedule.xlsx
```

### Example:

```bash
# If your Excel file is in the backend directory
npm run import:schedule schedule.xlsx

# If your Excel file is elsewhere
npm run import:schedule "C:/Users/YourName/Documents/schedule.xlsx"
```

## Output

The script will show:
- ✓ Successfully imported games
- ⚠ Skipped games (duplicates or missing data)
- ✗ Errors
- 📊 Summary statistics

### Example Output:

```
✓ Connected to MongoDB
✓ Found 10 games in Excel file
✓ Imported: Team A vs Team B on Tue Jan 15 2025
✓ Imported: Team C vs Team D on Wed Jan 16 2025
⚠ Skipping row - missing team names
⚠ Home team "Team X" not found in database - skipping game

=== Import Summary ===
✓ Successfully imported: 8 games
⚠ Skipped: 2 games
✗ Errors: 0 games
📊 Total processed: 10 rows

✓ Database connection closed
```

## Troubleshooting

**"Team not found in database"**
- Create the team first through the application before importing games

**"League not found"**
- Create the league first, or remove the League column from your Excel file

**"Skipping row - missing date"**
- Ensure all rows have a Date column with valid dates

**"Game already exists"**
- The script detected a duplicate game. This is normal and the duplicate will be skipped.

## Tips

1. **Test with a small file first**: Try importing 2-3 games before importing your full schedule

2. **Backup your database**: Always backup before importing large amounts of data

3. **Review skipped games**: Check the output to see why games were skipped and fix any issues

4. **Team name matching**: Team names in Excel should match exactly (case-insensitive) with team names in your database
