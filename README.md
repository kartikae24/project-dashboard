# Project Management Dashboard

A modern, responsive **Project Management Dashboard** built with HTML,
CSS, and vanilla JavaScript. The application provides a centralized
interface for organizing and reviewing project-related information
through dedicated dashboard sections.

The interface is structured around a sidebar, a top navigation bar, and
separate views for the dashboard, project library, project details,
team, tasks, calendar, analytics, and settings.

> **Project type:** Frontend web application\
> **Repository:**
> [kartikae24/project-dashboard](https://github.com/kartikae24/project-dashboard)\
> **Application folder:** `portfolio-dashboard/`

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Features and Sections](#features-and-sections)
-   [Technology Stack](#technology-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [How to Use](#how-to-use)
-   [Application Architecture](#application-architecture)
-   [Design and Interface](#design-and-interface)
-   [Accessibility](#accessibility)
-   [Browser Compatibility](#browser-compatibility)
-   [Limitations and Scope](#limitations-and-scope)
-   [Future Improvements](#future-improvements)
-   [Contributing](#contributing)
-   [Author](#author)
-   [License](#license)

------------------------------------------------------------------------

## Overview

The Project Management Dashboard is designed to bring common
project-management views together in one web interface. Instead of
navigating between separate pages or tools, users can move between
dedicated sections from a shared application layout.

The project is organized as a frontend application. Its HTML provides
the main application shell, CSS is separated into reusable and
page-specific stylesheets, and JavaScript is divided into utilities,
shared components, data/state modules, and page modules.

The application is intended as a practical demonstration of frontend
development concepts, including:

-   Structuring a multi-section web interface.
-   Separating layout, components, and page-specific styling.
-   Organizing JavaScript into focused modules.
-   Building a consistent dashboard navigation experience.
-   Creating a responsive interface for different screen sizes.

## Features and Sections

The application includes the following main sections:

### 1. Dashboard

The central overview area of the application. It is intended to provide
a starting point for reviewing project-related information.

### 2. Project Library

A dedicated section for viewing the projects managed or presented within
the dashboard.

### 3. Project Details

A separate view for displaying information about an individual project.

### 4. Team

A section dedicated to team-related information.

### 5. Tasks

A dedicated area for task-related information and work tracking.

### 6. Calendar

A calendar-oriented section for viewing project or task schedules.

### 7. Analytics

An analytics section for presenting project-related information in a
visual or summarized format. The project includes a separate JavaScript
module for chart-related functionality.

### 8. Settings

A dedicated section for application settings.

### Shared Interface Components

-   Sidebar navigation for moving between application sections.
-   Top navigation bar shared across the main content area.
-   Central page-content container for displaying the selected section.
-   Toast notification container for application feedback.
-   Modal container for dialog-based interactions.

The exact actions and data behavior available within each section depend
on the implementation in the corresponding JavaScript modules.

------------------------------------------------------------------------

## Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  HTML5                               Application structure and semantic
                                      page sections

  CSS3                                Layout, styling, responsive
                                      presentation, and animations

  JavaScript (Vanilla)                Application behavior, navigation,
                                      shared utilities, and page logic

  Google Fonts -- Inter               Interface typography

  Font Awesome 6.5.1                  Icons used by the interface
  -----------------------------------------------------------------------

### No Framework Required

The project is organized as a plain HTML, CSS, and JavaScript frontend.
The repository's application entry point is `index.html`; the project
structure does not show a framework-specific build configuration or a
package installation workflow.

------------------------------------------------------------------------

## Project Structure

The application is located inside the `portfolio-dashboard/` directory.

``` text
project-dashboard/
└── portfolio-dashboard/
    ├── index.html
    │
    ├── css/
    │   ├── variables.css
    │   ├── reset.css
    │   ├── animations.css
    │   ├── layout.css
    │   ├── components.css
    │   └── pages/
    │       ├── dashboard.css
    │       ├── library.css
    │       ├── details.css
    │       ├── team.css
    │       ├── tasks.css
    │       ├── calendar.css
    │       ├── analytics.css
    │       └── settings.css
    │
    └── js/
        ├── utils.js
        ├── store.js
        ├── data.js
        ├── charts.js
        ├── app.js
        │
        ├── components/
        │   ├── sidebar.js
        │   └── topbar.js
        │
        └── pages/
            ├── dashboard.js
            ├── library.js
            ├── details.js
            ├── team.js
            ├── tasks.js
            ├── calendar.js
            ├── analytics.js
            └── settings.js
```

### Folder and File Responsibilities

**`index.html`** - Main entry point of the application. - Loads the
stylesheets and JavaScript modules. - Defines the shared application
layout and page-section containers.

**`css/`** - `variables.css`: shared design variables. - `reset.css`:
baseline styling. - `animations.css`: animation-related styles. -
`layout.css`: overall application layout. - `components.css`: shared
component styling. - `pages/`: styles specific to individual application
sections.

**`js/`** - `utils.js`: shared helper functions. - `store.js`: shared
application state/store module. - `data.js`: application data module. -
`charts.js`: chart-related functionality. - `app.js`: application-level
initialization and coordination. - `components/`: shared interface
components such as the sidebar and topbar. - `pages/`: JavaScript logic
organized by application section.

------------------------------------------------------------------------

## Getting Started

### Prerequisites

You only need:

-   A modern web browser such as Google Chrome, Mozilla Firefox,
    Microsoft Edge, or Safari.
-   Git (optional, if you want to clone the repository).
-   A code editor such as Visual Studio Code (optional, for examining or
    editing the source code).

No Node.js installation or package manager setup is indicated by the
current project structure.

### 1. Clone the Repository

Open a terminal and run:

``` bash
git clone https://github.com/kartikae24/project-dashboard.git
```

### 2. Open the Application Directory

``` bash
cd project-dashboard/portfolio-dashboard
```

### 3. Run the Project

Open `index.html` in your preferred web browser.

Alternatively, open the `portfolio-dashboard` folder in Visual Studio
Code and use the **Live Server** extension to serve `index.html`
locally.

> If you use Live Server, make sure the server is started from the
> `portfolio-dashboard/` directory so that the relative CSS and
> JavaScript paths resolve correctly.

------------------------------------------------------------------------

## How to Use

1.  Open the application by launching `index.html` in a browser.
2.  Use the sidebar to navigate between the available dashboard
    sections.
3.  Open the Dashboard section to access the main overview.
4.  Navigate to Project Library and Project Details to explore
    project-related views.
5.  Use the Team, Tasks, and Calendar sections to explore their
    respective areas.
6.  Open Analytics to view the analytics section.
7.  Visit Settings to access the settings interface.

The available interactions and data operations are determined by the
implemented functionality in each section.

------------------------------------------------------------------------

## Application Architecture

The application follows a modular frontend structure.

### HTML Layer

`index.html` defines the main application shell. It contains the
sidebar, topbar, main page-content area, individual page-section
containers, and shared containers for notifications and modals.

### CSS Layer

Styling is separated into: - Global design variables and reset rules. -
Shared layout and component styles. - Animation styles. - Page-specific
stylesheets.

This organization makes it easier to locate and maintain styles without
keeping the entire interface in one large stylesheet.

### JavaScript Layer

JavaScript responsibilities are separated into: - Shared utilities and
state/data modules. - Reusable navigation components. - Chart-related
functionality. - Individual page modules. - Application initialization.

This modular approach improves code organization and makes individual
sections easier to maintain.

------------------------------------------------------------------------

## Design and Interface

The application uses a dashboard-style layout with:

-   A shared sidebar navigation area.
-   A topbar above the main content.
-   Dedicated content sections for each feature area.
-   Inter as the primary interface font.
-   Font Awesome icons.
-   Separate stylesheets for layout, components, animations, and
    individual pages.
-   A dark theme declared on the main HTML document.

The page includes a viewport configuration for adapting the interface to
different screen widths. Actual responsive behavior is controlled by the
CSS implementation.

------------------------------------------------------------------------

## Accessibility

The main HTML structure includes several accessibility-oriented
attributes:

-   Semantic `header`, `main`, and `aside` elements.
-   An accessible label for the sidebar navigation region.
-   Labels for the main page sections.
-   `aria-hidden` attributes on page sections.
-   An `aria-live` notification container for status feedback.

These attributes provide a foundation for assistive-technology support.
Accessibility should also be tested with keyboard navigation and screen
readers as the interface evolves.

------------------------------------------------------------------------

## Browser Compatibility

The application is intended to run in modern browsers that support
standard HTML5, CSS3, and JavaScript features.

For the best experience, use an up-to-date version of Chrome, Firefox,
Edge, or Safari.

The interface loads Google Fonts and Font Awesome from external CDNs, so
an internet connection is required for those externally hosted font and
icon resources to load.

------------------------------------------------------------------------

## Limitations and Scope

-   This repository contains a frontend application.
-   The inspected project structure does not identify a dedicated
    backend server or database setup.
-   No framework-specific build or package installation process is
    included in the application structure.
-   Persistent storage, authentication, multi-user synchronization, and
    production deployment behavior should not be assumed unless
    implemented separately in the source code.
-   Some visual resources, such as externally hosted fonts and icons,
    require an internet connection.

------------------------------------------------------------------------

## Future Improvements

Possible enhancements for future versions include:

-   Connecting the interface to a secure backend and database.
-   Adding user authentication and role-based access.
-   Implementing persistent project and task storage.
-   Supporting project creation, editing, and deletion workflows.
-   Adding task priorities, deadlines, and status filters.
-   Improving calendar interactions and scheduling.
-   Expanding analytics with additional project metrics and
    visualizations.
-   Adding automated tests and accessibility checks.
-   Providing deployment instructions and a hosted demo.

These are potential improvements, not claims about features already
implemented.

------------------------------------------------------------------------

## Contributing

Contributions and suggestions are welcome.

1.  Fork the repository.

2.  Create a feature branch:

    ``` bash
    git checkout -b feature/your-feature-name
    ```

3.  Make your changes.

4.  Test the application in a browser.

5.  Commit your changes:

    ``` bash
    git commit -m "Add: describe your changes"
    ```

6.  Push the branch and open a Pull Request.

Please keep the existing separation between shared styles, page-specific
styles, shared JavaScript components, and page modules when making
changes.

------------------------------------------------------------------------

## Author

**Kartikae Chaudhary**

-   GitHub: [@kartikae24](https://github.com/kartikae24)
-   Project Repository:
    [project-dashboard](https://github.com/kartikae24/project-dashboard)

------------------------------------------------------------------------

## License

No license file was visible in the repository structure at the time this
README was prepared. Unless a license is added to the repository, users
should not assume that the project is released under an open-source
license.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
Built as a frontend project to practice and demonstrate web development,
modular code organization, and dashboard interface design.
```{=html}
</p>
```
