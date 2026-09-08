document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('products-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let allProducts = [];

    const EBOOK_SUPABASE_URL = 'https://kqnbkrehurqptonplezz.supabase.co';
    const EBOOK_ANON_KEY = 'sb_publishable_Qsjuvm0FKg1Vc9StRMiwLg_bxvM0HlM';

    try {
        let localProducts = [];
        try {
            const response = await fetch('./products.json');
            if (response.ok) {
                localProducts = await response.json();
            }
        } catch (localErr) {
            console.warn('Local products load warning:', localErr);
        }

        let dbProducts = [];
        try {
            const apiRes = await fetch(`${EBOOK_SUPABASE_URL}/rest/v1/ebook_products?is_published=eq.true&select=*&order=created_at.desc`, {
                headers: {
                    'apikey': EBOOK_ANON_KEY,
                    'Authorization': `Bearer ${EBOOK_ANON_KEY}`
                }
            });
            if (apiRes.ok) {
                const resJson = await apiRes.json();
                if (Array.isArray(resJson) && resJson.length > 0) {
                    dbProducts = resJson.map(p => ({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        price: (p.price_cents / 100).toFixed(2),
                        category: p.category || 'AI Business',
                        rating: String(p.rating || '4.9'),
                        reviews: String(p.reviews || '120'),
                        image: p.cover_url || `./images/cover_${p.id}.svg`,
                        paymentUrl: p.stripe_payment_url || '#',
                        downloadUrl: p.download_url || '#'
                    }));
                }
            }
        } catch (dbErr) {
            console.warn('Ebook Supabase fetch note:', dbErr);
        }

        const productMap = new Map();
        localProducts.forEach(p => productMap.set(p.id, p));
        dbProducts.forEach(p => {
            if (!productMap.has(p.id)) {
                productMap.set(p.id, p);
            }
        });
        allProducts = Array.from(productMap.values());
        renderProducts(allProducts);

        // Category Filter Tabs Logic
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCategory = btn.dataset.category;
                if (selectedCategory === 'all') {
                    renderProducts(allProducts);
                } else {
                    const filtered = allProducts.filter(p => p.category === selectedCategory);
                    renderProducts(filtered);
                }
            });
        });

    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<p style="text-align:center; color:#ef4444;">Failed to load products. Please try again later.</p>';
    }

    function renderProducts(productsToRender) {
        container.innerHTML = '';

        if (productsToRender.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:#94a3b8; padding:40px;">No resources found in this category.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const category = product.category || 'AI Business';
            const rating = product.rating || '4.9';
            const reviews = product.reviews || '120';
            const coverImage = product.image || `./images/cover_${product.id}.svg`;

            card.innerHTML = `
                <div class="product-cover-wrap">
                    <img src="${coverImage}" alt="${product.title}" class="product-image" loading="lazy">
                </div>
                <div class="category-tag">${category}</div>
                <h2 class="product-title">${product.title}</h2>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <div class="rating-wrap">
                        <span>★</span>
                        <span>${rating}</span>
                        <span style="color:#64748b; font-weight:400;">(${reviews})</span>
                    </div>
                    <div class="product-price">$${product.price} USD</div>
                </div>
                <a href="${product.paymentUrl}" class="btn-buy" target="_blank" rel="noopener">Buy Now &rarr;</a>
            `;
            container.appendChild(card);
        });
    }
});
