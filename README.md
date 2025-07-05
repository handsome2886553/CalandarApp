# Calendar App

A beautiful desktop calendar application built with Electron.

## Features

- 📅 Monthly calendar view with navigation
- ➕ Add, view, and delete events
- 🎯 Today's events sidebar
- 📋 Upcoming events preview
- ⌨️ Keyboard shortcuts
- 💾 Local data persistence
- 🎨 Modern, responsive UI

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd CalandarApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
This will start the app with developer tools open.

#### Production Mode
```bash
npm start
```

### Building for Distribution

#### Build for current platform
```bash
npm run build
```

#### Create distributable package
```bash
npm run dist
```

## Project Structure

```
CalandarApp/
├── main.js          # Main Electron process
├── renderer.js      # Renderer process (UI logic)
├── index.html       # Main application window
├── styles.css       # Application styles
├── package.json     # Project configuration
└── README.md        # This file
```

## Keyboard Shortcuts

- `Ctrl/Cmd + N` - Create new event
- `Ctrl/Cmd + R` - Reload application
- `Ctrl/Cmd + Shift + I` - Toggle Developer Tools
- `Escape` - Close modal dialogs

## Features Overview

### Calendar Navigation
- Navigate between months using arrow buttons
- Click on any date to add an event
- Visual indicators for days with events

### Event Management
- Add events with title, date, time, and description
- View today's events in the sidebar
- See upcoming events for the next week
- Click on events to delete them

### Data Storage
- Events are stored locally using localStorage
- Data persists between application sessions

## Customization

### Changing the App Icon
1. Replace the icon files in the `assets/` directory (you'll need to create this directory and add icons)
2. Update the icon paths in `package.json` build configuration

### Modifying the UI
- Edit `styles.css` for visual changes
- Modify `index.html` for structural changes
- Update `renderer.js` for functionality changes

## Troubleshooting

### Application won't start
- Ensure Node.js is installed and up to date
- Run `npm install` to ensure all dependencies are installed
- Check the console for error messages

### Events not saving
- Events are stored in localStorage
- Check browser console for any storage-related errors
- Ensure the application has proper file system permissions

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- [ ] Event categories and color coding
- [ ] Event reminders and notifications
- [ ] Import/export calendar data
- [ ] Multiple calendar views (week, day)
- [ ] Event search functionality
- [ ] Recurring events support
- [ ] Integration with external calendar services
