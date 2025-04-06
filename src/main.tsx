
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set up theme preference before initial render
const initializeTheme = () => {
  // Check if user has a theme preference in localStorage
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (storedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Use system preference if no stored preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
};

// Error handling for the entire application
const renderApp = () => {
  try {
    // Initialize theme before rendering the app
    initializeTheme();
    
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error("Root element not found. Cannot render application.");
    }
    
    const root = createRoot(rootElement);
    root.render(<App />);
    
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Failed to render application:", error);
    
    // Display a fallback UI if rendering fails
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Application Error</h2>
          <p>Sorry, there was an error loading the application. Please try refreshing the page.</p>
        </div>
      `;
    }
  }
};

renderApp();
