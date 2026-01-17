console.log('get_posts.js loaded');

const badgeConfig = {
    'test': { name: 'Test Category', icon: '✱', class: 'example_theme'}
};

const projectFiles = [
    'posts/test.md'
];

console.log('Project files:', projectFiles);

function stripFrontmatter(content) {
    // Remove frontmatter between --- markers
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    return content.replace(frontmatterRegex, '');
}

async function loadAndDisplayWithZeroMd(category) {
    console.log('Loading markdown for category:', category);
    
    const grid = document.getElementById('projects-grid');
    const titleEl = document.getElementById('category-title');
    
    // Set the category title
    if (badgeConfig[category]) {
        titleEl.textContent = badgeConfig[category].name;
    }
    
    // Create zero-md elements for each markdown file
    for (let filePath of projectFiles) {
        try {
            // Fetch the markdown file
            const response = await fetch(filePath);
            if (!response.ok) continue;
            
            const content = await response.text();
            
            // Strip frontmatter
            const markdownWithoutFrontmatter = stripFrontmatter(content);
            
            const tile = document.createElement('div');
            tile.className = 'project-tile';
            
            const zeroMd = document.createElement('zero-md');
            
            // Add markdown inline instead of using src
            const script = document.createElement('script');
            script.type = 'text/markdown';
            script.textContent = markdownWithoutFrontmatter;
            
            // Add custom styling template
            const template = document.createElement('template');
            template.innerHTML = `
                <link rel="stylesheet" href="markdown-styles.css" />
            `;
            
            zeroMd.appendChild(script);
            zeroMd.appendChild(template);
            tile.appendChild(zeroMd);
            grid.appendChild(tile);
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
        }
    }
}

// Get category from URL parameter
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

// Initialize if on category page
document.addEventListener('DOMContentLoaded', () => {
    const category = getCategoryFromURL();
    console.log('Category from URL:', category);
    if (category && badgeConfig[category]) {
        loadAndDisplayWithZeroMd(category);
    }
});