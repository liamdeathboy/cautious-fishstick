(function () {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) {
        return;
    }

    const resultsCount = document.getElementById('blog-results-count');
    let posts = [];

    const fallbackPosts = [
        {
            slug: 'best-unblocked-games-2026',
            title: 'Best Unblocked Games of 2026: Why Schplay.com Is #1',
            excerpt: 'Top unblocked games for 2026, five other online game websites, and the full Schplay games catalog.',
            category: 'Guides',
            date: '2026-02-23',
            readTime: '12 min read'
        },
        {
            slug: 'getting-started-with-schplay',
            title: 'How We Launch New Games on Schplay',
            excerpt: 'A simple look at the review checklist we use before publishing each game.',
            category: 'Updates',
            date: '2026-02-20',
            readTime: '4 min read'
        },
        {
            slug: 'classroom-mode-guide',
            title: 'Classroom Mode Guide for Teachers',
            excerpt: 'How to build playlists, share safe links, and keep class sessions focused.',
            category: 'Guides',
            date: '2026-02-14',
            readTime: '5 min read'
        },
        {
            slug: 'weekly-update-template',
            title: 'Weekly Update Post Template',
            excerpt: 'A ready-to-copy format for patch notes and weekly site updates.',
            category: 'Community',
            date: '2026-02-10',
            readTime: '3 min read'
        }
    ];

    const formatDate = (dateString) => {
        const parsed = new Date(dateString + 'T00:00:00');
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }

        return parsed.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isValidPost = (post) => Boolean(post && post.slug && post.title && post.excerpt && post.date);
    const sortByDateDesc = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();

    const createCard = (post) => {
        const article = document.createElement('article');
        article.className = 'post-card';

        const meta = document.createElement('p');
        meta.className = 'post-meta';

        const time = document.createElement('time');
        time.dateTime = post.date;
        time.textContent = formatDate(post.date);
        meta.appendChild(time);

        if (post.readTime) {
            const readTime = document.createElement('span');
            readTime.textContent = post.readTime;
            meta.appendChild(readTime);
        }

        if (post.category) {
            const category = document.createElement('span');
            category.className = 'post-category';
            category.textContent = post.category;
            meta.appendChild(category);
        }

        const title = document.createElement('h2');
        title.textContent = post.title;

        const excerpt = document.createElement('p');
        excerpt.textContent = post.excerpt;

        const link = document.createElement('a');
        link.href = 'blog/' + post.slug + '.html';
        link.className = 'post-link';
        link.textContent = 'Read post';

        article.appendChild(meta);
        article.appendChild(title);
        article.appendChild(excerpt);
        article.appendChild(link);

        return article;
    };

    const renderPosts = () => {
        grid.innerHTML = '';

        if (!posts.length) {
            const empty = document.createElement('p');
            empty.className = 'blog-empty';
            empty.textContent = 'No posts yet. Add one in data/blog-posts.json.';
            grid.appendChild(empty);
            if (resultsCount) {
                resultsCount.textContent = '0 posts';
            }
            return;
        }

        posts.forEach((post) => {
            grid.appendChild(createCard(post));
        });

        if (resultsCount) {
            const label = posts.length === 1 ? 'post' : 'posts';
            resultsCount.textContent = posts.length + ' ' + label;
        }
    };

    const loadPosts = async () => {
        try {
            const response = await fetch('data/blog-posts.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Could not load blog post data.');
            }

            const payload = await response.json();
            if (!payload || !Array.isArray(payload.posts)) {
                throw new Error('Blog post data is malformed.');
            }

            posts = payload.posts.filter(isValidPost).sort(sortByDateDesc);
            if (!posts.length) {
                posts = fallbackPosts.slice();
            }
        } catch (error) {
            posts = fallbackPosts.slice();
        }

        renderPosts();
    };

    loadPosts();
})();
