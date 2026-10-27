/**
 * Le Matin — 共通JavaScript
 * 機能：
 *  1. ヘッダースクロール制御
 *  2. ハンバーガーメニュー（モバイル）
 *  3. スクロールフェードイン
 *  4. メニューページ：カテゴリータブ切り替え
 *  5. お知らせページ：カテゴリーフィルター（一覧・サイドバー共通）
 *  6. スムーズスクロール（アンカーリンク）
 */

'use strict';

/* ============================================
   1. ヘッダー：スクロールで背景を濃くする
============================================ */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期チェック
})();


/* ============================================
   2. ハンバーガーメニュー（モバイル）
============================================ */
(function initHamburger() {
  const btn    = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;

  function toggleMenu(open) {
    btn.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    // メニューを開いているときは背景スクロールを止める
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', function () {
    const isOpen = btn.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // メニュー内のリンクをクリックしたら閉じる
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  // Escキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.classList.contains('open')) {
      toggleMenu(false);
      btn.focus();
    }
  });
})();


/* ============================================
   3. スクロールフェードイン（IntersectionObserver）
============================================ */
(function initFadeIn() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  // IntersectionObserver 非対応ブラウザはそのまま表示
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ============================================
   4. メニューページ：カテゴリータブ切り替え
============================================ */
(function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetId = tab.dataset.target;

      // タブのアクティブ切り替え
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // セクションの表示切り替え
      document.querySelectorAll('.menu-category').forEach(function (section) {
        if (section.id === targetId) {
          section.removeAttribute('hidden');
          // フェードイン再実行
          section.querySelectorAll('.fade-in').forEach(function (el) {
            el.classList.remove('visible');
            // 少し遅らせて再観察させる
            requestAnimationFrame(function () {
              el.classList.add('visible');
            });
          });
        } else {
          section.setAttribute('hidden', '');
        }
      });
    });
  });
})();


/* ============================================
   5. お知らせページ：カテゴリーフィルター
   （フィルターボタン・サイドバーリンク共通）
============================================ */
(function initNewsFilter() {
  const filterBtns   = document.querySelectorAll('.news-filter-btn');
  const sidebarLinks = document.querySelectorAll('.sidebar-cat-link');
  const articles     = document.querySelectorAll('.news-article');
  if (!filterBtns.length && !sidebarLinks.length) return;

  /**
   * @param {string} filter - 'all' またはカテゴリー文字列
   */
  function applyFilter(filter) {
    articles.forEach(function (article) {
      if (filter === 'all' || article.dataset.category === filter) {
        article.classList.remove('hidden');
      } else {
        article.classList.add('hidden');
      }
    });

    // フィルターボタンのアクティブ状態
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.dataset.filter);
    });
  });

  sidebarLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      applyFilter(link.dataset.filter);
      // モバイル時はフィルター結果までスクロール
      const newsList = document.getElementById('news-list');
      if (newsList) {
        newsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ============================================
   6. スムーズスクロール（#アンカーリンク）
   ※ html { scroll-behavior: smooth } の補完
   　 ヘッダー固定分のオフセットを適用
============================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('site-header')
        ? document.getElementById('site-header').offsetHeight
        : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 24;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
