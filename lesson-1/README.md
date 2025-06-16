# Habit Tracker CLI

A simple command-line app for managing habits

## Usage

Run commands using
```bash
node index.js <command> [options]
```

Replace `<command>` with one of the supported commands.

---

## Supported Commands & Parameters

Below are all the commands, with a description of their parameters.

### 1. `add`
Add a new habit.

**Parameters:**
- `--name <string>`: (Required) The name of the habit.
- `--freq <daily|weekly|monthly>`: (Required) The frequency with which you want to track the habit.

**Example:**
```bash
node index.js add --name "Drink Water" --freq daily
```

### 2. `list`
List all habits.

**Parameters:**  
No additional parameters.

**Example:**
```bash
node index.js list
```

### 3. `update`
Update an existing habit's name or frequency.

**Parameters:**
- `--id <string>`: (Required) The unique ID of the habit.
- `--name <string>`: (Optional) The new name of the habit.
- `--freq <daily|weekly|monthly>`: (Optional) The new frequency for the habit.

**Example:**
```bash
node index.js update --id <habit_id> --name "Morning Run" --freq weekly
```

### 4. `delete`
Delete a habit.

**Parameters:**
- `--id <string>`: (Required) The unique ID of the habit.

**Example:**
```bash
node index.js delete --id <habit_id>
```

### 5. `done`
Mark a habit as completed for today.

**Parameters:**
- `--id <string>`: (Required) The unique ID of the habit.

**Example:**
```bash
node index.js done --id <habit_id>
```

### 6. `stats`
Show statistics for your habits.

**Parameters:**  
No additional parameters.

**Example:**
```bash
node index.js stats
```

**Environment Variable:**  
You can set the `DAY_OFFSET` variable to offset the day for stats, for example:

```bash
DAY_OFFSET=1 node index.js stats
```
