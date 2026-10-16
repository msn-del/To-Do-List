# To Do List

A simple to-do list built with plain HTML, CSS, and JavaScript. Add tasks, tick them off, edit or delete them, and filter by status. Tasks are saved in your browser, so they're still there after a refresh.

## Features

- Add tasks with the button or by pressing Enter (empty tasks are ignored)
- Mark tasks as done, with a strike-through that animates across the text
- Edit a task by clicking **Edit** or double-clicking its text (Enter saves, Escape cancels)
- Delete individual tasks
- Filter by **All**, **Active**, or **Done**
- Live counter showing how many tasks are left
- **Clear completed** button, shown only when there are finished tasks
- Tasks persist between visits using `localStorage`
- Friendly empty-state messages
- Responsive layout, keyboard-accessible controls, and reduced-motion support

## Tech Stack

- HTML, CSS, and vanilla JavaScript, with no build step and no dependencies
- [Google Fonts](https://fonts.google.com/): Familjen Grotesk (headings) and Instrument Sans (body text)

## Getting Started

1. Download or clone the project.
2. Open `save.html` in any browser.

No install or server is required. To preview with a local server instead:

```bash
npx serve .
```

## Project Structure

```
.
├── save.html   # Page markup
├── save.css    # Styles
└── save.js     # App logic
```

## How It Works

- **State:** Tasks are kept in a `tasks` array of objects shaped like `{ id, text, done }`. The current filter and the task being edited are tracked in two variables.
- **Rendering:** `render()` rebuilds the list from the state after every change, then updates the counter, empty message, and filter buttons.
- **Storage:** Every change is written to `localStorage` under the key `todo-tasks`. If storage is unavailable, the list still works for the current session.
- **Safety:** Task text is inserted with `textContent`, so anything typed is shown as plain text and never run as HTML.

## Customization

Colors and fonts are CSS variables at the top of `save.css`:

```css
:root {
  --page: #e8edf3;   /* page background */
  --paper: #fbfcfe;  /* card background */
  --ink: #17233a;    /* main text */
  --pen: #2b50d8;    /* accent color */
  --danger: #c23b3b; /* delete hover */
}
```

To reset all saved tasks, clear the site's data in your browser, or run `localStorage.removeItem('todo-tasks')` in the console.

## License

Add a license of your choice here.
