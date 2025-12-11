# Weekly History Feature

## Overview
The app now tracks blood pressure measurements on a weekly basis, showing only current week measurements on the home screen, with historical data organized in a dedicated History screen.

## How It Works

### 📅 Weekly Tracking
- **Week Definition**: Sunday to Saturday
- **Current Week**: Measurements from this Sunday onwards are shown in the Home screen
- **Historical Data**: Measurements from previous weeks are moved to History

### 🏠 Home Screen
- **Display**: Shows only measurements from the current week
- **Header Indicator**: "Current Week Measurements" with calendar icon
- **New Button**: History icon (🕒) in the header to access past data
- **Auto-Cleanup**: On Sunday, previous week's measurements automatically become history

### 📚 History Screen
The History screen is organized by weeks, showing:
- **Week Range**: e.g., "Dec 1 - Dec 7, 2025"
- **Measurement Count**: Number of readings in that week
- **Week Average**: Average blood pressure for the week
- **All Measurements**: Each individual reading with:
  - Date and time
  - BP values (systolic/diastolic) and heart rate
  - Classification badge (color-coded)
  - Notes (if any)

### 🗂️ Organization
- Most recent weeks appear first
- Each week is collapsible/expandable
- Measurements within each week are sorted by date (newest first)
- Color-coded classifications for easy visual assessment

## Header Actions (5 buttons)

1. **Share** 📤 - Generate and share medical report
2. **History** 🕒 - View past weeks' measurements (NEW!)
3. **Edit** ✏️ - Edit user profile
4. **Delete** 🗑️ - Delete user account
5. **Switch** 👥 - Switch to another user

## Database Changes

### New Methods in `DatabaseService.ts`

1. **`getCurrentWeekMeasurements(userId)`**
   - Returns only measurements from current week (Sunday onwards)
   - Used by HomeScreen to display current week data

2. **`getAllMeasurementsByUserId(userId)`**
   - Returns ALL measurements for a user
   - Used by History screen to show complete history

## Technical Implementation

### Week Calculation
```typescript
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff)); // Returns Sunday of that week
}
```

### Filtering Logic
- **Current Week**: `date >= currentWeekStart`
- **Historical**: `date < currentWeekStart`

## User Experience

### Normal Flow
1. User adds measurements during the week
2. All appear on Home screen under "Current Week Measurements"
3. User can view statistics and patterns

### Saturday Night / Sunday Morning
1. When Sunday arrives, previous week's data is no longer shown on Home
2. Data is automatically available in History
3. User starts fresh with empty Home screen for new week

### Accessing History
1. Tap History icon (🕒) in Home screen header
2. Browse past weeks organized chronologically
3. See averages and individual measurements
4. Tap back arrow to return to Home

## Benefits

✅ **Cleaner Interface**: Home screen only shows relevant current data
✅ **Better Organization**: Historical data grouped by meaningful time periods
✅ **Pattern Recognition**: Week-level averages help identify trends
✅ **Complete History**: Nothing is deleted, all data is preserved
✅ **Easy Navigation**: One tap to access complete history

## Future Enhancements (Optional)

Possible future features:
- Monthly/Yearly views
- Export history to PDF
- Graph trends over multiple weeks
- Week-to-week comparison
- Search/filter history by date range
- Backup/restore historical data

## Files Modified

1. **`src/services/DatabaseService.ts`**
   - Added `getCurrentWeekMeasurements()`
   - Added `getAllMeasurementsByUserId()`

2. **`src/screens/HomeScreen.tsx`**
   - Changed to use `getCurrentWeekMeasurements()`
   - Added History button in header
   - Added week indicator UI

3. **`src/screens/HistoryScreen.tsx`** (NEW)
   - Complete history viewer
   - Week-based grouping
   - Average calculations per week

4. **`src/navigation/AppNavigator.tsx`**
   - Added History screen route
   - Configured navigation flow
