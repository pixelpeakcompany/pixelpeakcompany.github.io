// Blog-specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeShareButtons();
    initializeReadingProgress();
    initializeTableOfContents();
});

// Social sharing functionality
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = window.location.href;
            const title = document.title;
            
            shareArticle(platform, url, title);
        });
    });
}

function shareArticle(platform, url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        default:
            return;
    }
    
    // Open share window
    window.open(shareUrl, 'share-dialog', 'width=600,height=400,resizable=yes,scrollbars=yes');
    
    // Track sharing event
    trackShareEvent(platform);
}

// Reading progress indicator
function initializeReadingProgress() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    // Add styles for progress bar
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--gray-200);
            z-index: 1001;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-600), var(--secondary-600));
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const start = articleTop - windowHeight;
        const end = articleTop + articleHeight;
        const progress = Math.max(0, Math.min(100, ((scrollTop - start) / (end - start)) * 100));
        
        const progressFill = progressBar.querySelector('.progress-fill');
        progressFill.style.width = `${progress}%`;
    });
}

// Auto-generate table of contents
function initializeTableOfContents() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // Only show TOC if there are enough headings
    
    // Create table of contents
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h4>Table of Contents</h4><ul class="toc-list"></ul>';
    
    const tocList = toc.querySelector('.toc-list');
    
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const listItem = document.createElement('li');
        listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    // Add TOC styles
    const tocStyles = document.createElement('style');
    tocStyles.textContent = `
        .table-of-contents {
            background-color: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
            position: sticky;
            top: 120px;
        }
        
        .table-of-contents h4 {
            color: var(--gray-900);
            margin-bottom: 16px;
            font-size: 1rem;
        }
        
        .toc-list {
            list-style: none;
            padding: 0;
        }
        
        .toc-item {
            margin-bottom: 8px;
        }
        
        .toc-h3 {
            margin-left: 16px;
        }
        
        .toc-link {
            color: var(--gray-600);
            font-size: 14px;
            transition: color 0.3s ease;
            display: block;
            padding: 4px 0;
        }
        
        .toc-link:hover,
        .toc-link.active {
            color: var(--primary-600);
        }
        
        @media (max-width: 768px) {
            .table-of-contents {
                position: static;
                margin: 24px -16px;
                border-radius: 0;
                border-left: none;
                border-right: none;
            }
        }
    `;
    document.head.appendChild(tocStyles);
    
    // Insert TOC after the intro paragraph
    const introParagraph = article.querySelector('.article-intro');
    if (introParagraph && introParagraph.nextElementSibling) {
        introParagraph.parentNode.insertBefore(toc, introParagraph.nextElementSibling);
    }
    
    // Highlight active TOC link on scroll
    const tocLinks = toc.querySelectorAll('.toc-link');
    
    window.addEventListener('scroll', function() {
        let activeHeading = null;
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 0) {
                activeHeading = heading;
            }
        });
        
        // Update active link
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 120;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Track sharing events (replace with actual analytics)
function trackShareEvent(platform) {
    console.log(`Article shared on ${platform}`);
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            method: platform,
            content_type: 'article',
            content_id: window.location.pathname
        });
    }
}

// Enhanced reading experience
function initializeReadingEnhancements() {
    // Add copy link functionality for headings
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    
    headings.forEach(heading => {
        heading.style.position = 'relative';
        
        const copyLink = document.createElement('button');
        copyLink.className = 'heading-link';
        copyLink.innerHTML = '🔗';
        copyLink.title = 'Copy link to this section';
        
        // Add styles for heading links
        const linkStyles = `
            .heading-link {
                position: absolute;
                left: -32px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                font-size: 16px;
                opacity: 0;
                transition: opacity 0.3s ease;
                cursor: pointer;
                padding: 4px;
            }
            
            .article-content h2:hover .heading-link,
            .article-content h3:hover .heading-link {
                opacity: 0.6;
            }
            
            .heading-link:hover {
                opacity: 1 !important;
            }
            
            @media (max-width: 768px) {
                .heading-link {
                    display: none;
                }
            }
        `;
        
        if (!document.querySelector('#heading-link-styles')) {
            const style = document.createElement('style');
            style.id = 'heading-link-styles';
            style.textContent = linkStyles;
            document.head.appendChild(style);
        }
        
        copyLink.addEventListener('click', function() {
            const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            });
        });
        
        heading.appendChild(copyLink);
    });
}

// Initialize reading enhancements
initializeReadingEnhancements();
