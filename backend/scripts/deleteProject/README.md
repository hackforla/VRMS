# Delete Project Script - Modular Structure

This directory contains the modular implementation of the project deletion script.

## File Structure

```
deleteProject/
├── README.md          # This file
├── index.js           # Main orchestration file (entry point)
├── config.js          # Configuration constants (database names)
├── utils.js           # Utility functions (validation, CLI parsing, help)
├── finders.js         # Database query functions (find related records)
├── displays.js        # Display functions (show detailed information)
└── deleters.js        # Deletion functions (delete/update operations)
```

## Module Descriptions

### `index.js`

Main orchestration file that coordinates the entire deletion process.

- Parses command-line arguments
- Validates input and environment
- Connects to MongoDB
- Orchestrates the find → display → delete workflow
- Handles errors and cleanup

### `config.js`

Configuration constants used throughout the script.

- Database names (production, development, test)
- Can be extended with other configuration values

### `utils.js`

Utility and helper functions.

- `checkEnv()` - Validates required environment variables
- `isValidObjectId()` - Validates MongoDB ObjectId format
- `getProjectIdFromArgs()` - Extracts project ID from CLI arguments
- `printHelp()` - Displays usage information

### `finders.js`

Database query functions for finding related records.

- `findProject()` - Find the project by ID
- `findProjectEvents()` - Find all events for the project
- `findEventCheckIns()` - Find all check-ins for project events
- `findProjectTeamMembers()` - Find team members
- `findUsersReferencingProject()` - Find users with project references
- `findRelatedRecurringEvents()` - Find recurring events

### `displays.js`

Display functions for showing detailed record information.

- `displayUserDetails()` - Show user information
- `displayEventDetails()` - Show event information
- `displayCheckInDetails()` - Show check-in information (with user lookup)
- `displayProjectTeamMemberDetails()` - Show team member information
- `displayRecurringEventDetails()` - Show recurring event information

### `deleters.js`

Deletion and update functions.

- `deleteCheckIns()` - Delete check-in records
- `deleteProjectTeamMembers()` - Delete team member records
- `updateUsersRemoveProject()` - Remove project references from users
- `deleteEvents()` - Delete event records
- `deleteRecurringEvents()` - Delete recurring event records
- `deleteProject()` - Delete the project itself

## Usage

### From the deleteProject directory:

```bash
node index.js --project-id=<PROJECT_ID> [options]
```

### From the scripts directory (backwards compatible):

```bash
node deleteProjectAndAssociatedRecords.js --project-id=<PROJECT_ID> [options]
```

### Options:

- `--project-id=<ID>` - MongoDB ObjectId of the project to delete (REQUIRED)
- `--prod` - Operate on production database
- `--live` - Operate on development/staging database
- `--test` - Operate on test database
- `--mock` - Dry run (no actual deletion)
- `--execute` - Execute the deletion
- `--help` - Show help message

## Examples

```bash
# Dry run on production
node index.js --project-id=644748563212e6001fbca24a --prod --mock

# Execute on test database
node index.js --project-id=644748563212e6001fbca24a --test --execute

# Execute on production (with 5-second warning)
node index.js --project-id=644748563212e6001fbca24a --prod --execute
```

## Safety Features

1. **Mock mode** - Preview all changes before executing
2. **5-second warning** - Countdown for production/live databases
3. **Validation** - Validates project ID and environment variables
4. **Detailed output** - Shows exactly what will be deleted
5. **Orphan detection** - Identifies orphaned check-ins

## Deletion Order

The script follows this order to maintain referential integrity:

1. Check-ins
2. Project team members
3. User references (updated, not deleted)
4. Events
5. Recurring events
6. Project

## Environment Requirements

- `MIGRATION_DB_URI` - MongoDB connection string

Load from `backend/.env` file.

## See Also

- Main documentation: `tmp/GUIDE.md`
- Manual deletion steps for MongoDB Compass users
