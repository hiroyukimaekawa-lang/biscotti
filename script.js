// ハンバーガーメニューのトグル
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // メニューリンクをクリックしたときにメニューを閉じる
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// スクロール時のヘッダーのスタイル変更
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
}

// フェードインアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.concept-content, .about-content, .showcase-item, .news-item, .reservation-content'
    );
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// 商品データ（ECサイトの商品ラインナップから）
const products = [
    { name: 'ビスコッティ くるみチョコ(2本入り)', price: '¥300', image: './img/product-01.jpg', alt: 'ビスコッティ くるみチョコ' },
    { name: 'マカデミアナッツクッキー(4個入り)', price: '¥400', image: './img/product-02.jpg', alt: 'マカデミアナッツクッキー' },
    { name: '塩バターサブレ(4枚入り)', price: '¥400', image: './img/product-03.jpg', alt: '塩バターサブレ' },
    { name: 'ビスコッティ ストロベリー(2本入り)', price: '¥300', image: './img/product-04.jpg', alt: 'ビスコッティ ストロベリー' },
    { name: 'ディアマンクッキーチョコ(5枚入り)', price: '¥400', image: './img/product-05.jpg', alt: 'ディアマンクッキーチョコ' },
    { name: 'チョコチップクッキー(4枚入り)', price: '¥400', image: './img/product-06.jpg', alt: 'チョコチップクッキー' },
    { name: 'メレンゲクッキー(13個入り)', price: '¥400', image: './img/product-07.jpg', alt: 'メレンゲクッキー' },
    { name: 'メレンゲプレッツェル(4個入り)', price: '¥400', image: './img/product-08.jpg', alt: 'メレンゲプレッツェル' },
    { name: 'biscottiくんクッキー', price: '¥500', image: './img/product-09.jpg', alt: 'biscottiくんクッキー' },
    { name: 'フロランタン(4個入り)', price: '¥400', image: './img/product-10.jpg', alt: 'フロランタン' },
    { name: 'ビスコッティ コーヒー(2本入り)', price: '¥300', image: './img/product-11.jpg', alt: 'ビスコッティ コーヒー' },
    { name: 'ビスコッティ チョコレート(2本入り)', price: '¥300', image: './img/product-12.jpg', alt: 'ビスコッティ チョコレート' }
];

// 商品カルーセルのHTMLを生成
function generateProductCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    // カルーセルをクリア
    carouselTrack.innerHTML = '';
    
    // 商品を2セット追加（無限ループ用）
    for (let set = 0; set < 2; set++) {
        products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.className = 'carousel-item';
            productItem.innerHTML = `
                <div class="product-image">
                    <div class="image-placeholder">
                        <img src="${product.image}" alt="${product.alt}">
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                </div>
            `;
            carouselTrack.appendChild(productItem);
        });
    }
}

// 自動カルーセル機能
document.addEventListener('DOMContentLoaded', () => {
    // まず商品カルーセルを生成
    generateProductCarousel();
    
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carouselTrack || !prevBtn || !nextBtn) return;
    
    const items = carouselTrack.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const originalItems = products.length; // 元のアイテム数
    let currentIndex = 0;
    let autoSlideInterval;
    let isTransitioning = false;
    
    // レスポンシブ対応：表示するアイテム数を決定
    const getVisibleItems = () => {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };
    
    // カルーセルを移動（無限ループ対応）
    const moveCarousel = (index, smooth = true) => {
        if (isTransitioning) return;
        
        const visibleItems = getVisibleItems();
        const itemWidth = items[0].offsetWidth;
        const gap = 32; // gap分
        
        // トランジションを設定
        if (smooth) {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carouselTrack.style.transition = 'none';
        }
        
        currentIndex = index;
        const translateX = -currentIndex * (itemWidth + gap);
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // 最初のセットの最後に到達したら、2回目のセットの開始位置にジャンプ
        if (currentIndex >= originalItems) {
            setTimeout(() => {
                isTransitioning = true;
                carouselTrack.style.transition = 'none';
                currentIndex = currentIndex - originalItems;
                const newTranslateX = -currentIndex * (itemWidth + gap);
                carouselTrack.style.transform = `translateX(${newTranslateX}px)`;
                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            }, 500);
        }
        
        // 最初のセットの開始より前に戻ったら、2回目のセットの最後にジャンプ
        if (currentIndex < 0) {
            setTimeout(() => {
                isTransitioning = true;
                carouselTrack.style.transition = 'none';
                currentIndex = originalItems + currentIndex;
                const newTranslateX = -currentIndex * (itemWidth + gap);
                carouselTrack.style.transform = `translateX(${newTranslateX}px)`;
                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            }, 500);
        }
    };
    
    // 次へ（自動スライド用）
    const goNext = () => {
        moveCarousel(currentIndex + 1, true);
    };
    
    // 前へ（ボタン用）
    const goPrev = () => {
        moveCarousel(currentIndex - 1, true);
        resetAutoSlide();
    };
    
    // 次へ（ボタン用）
    const goNextManual = () => {
        moveCarousel(currentIndex + 1, true);
        resetAutoSlide();
    };
    
    // 自動スライドを開始
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            goNext();
        }, 3000); // 3秒ごとに自動スライド
    };
    
    // 自動スライドをリセット
    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };
    
    // イベントリスナー
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNextManual);
    
    // マウスホバーで自動スライドを一時停止
    const carouselWrapperFull = document.querySelector('.carousel-wrapper-full');
    if (carouselWrapperFull) {
        carouselWrapperFull.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        carouselWrapperFull.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    // ウィンドウリサイズ時の処理
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const itemWidth = items[0].offsetWidth;
            const gap = 32;
            const translateX = -currentIndex * (itemWidth + gap);
            carouselTrack.style.transition = 'none';
            carouselTrack.style.transform = `translateX(${translateX}px)`;
        }, 250);
    });
    
    // 初期化
    moveCarousel(0, false);
    startAutoSlide();
});

// 店舗写真の自動スライドショー
document.addEventListener('DOMContentLoaded', () => {
    const storePhotos = document.querySelectorAll('.store-photo');
    if (storePhotos.length === 0) return;
    
    let currentPhotoIndex = 0;
    
    // 最初の写真を表示
    storePhotos[0].classList.add('active');
    
    // 自動切り替え
    setInterval(() => {
        // 現在の写真を非表示
        storePhotos[currentPhotoIndex].classList.remove('active');
        
        // 次の写真のインデックスを計算
        currentPhotoIndex = (currentPhotoIndex + 1) % storePhotos.length;
        
        // 次の写真を表示
        storePhotos[currentPhotoIndex].classList.add('active');
    }, 4000); // 4秒ごとに切り替え
});
