'use strict';

// Ждём полной загрузки DOM (на случай, если defer убран)
document.addEventListener('DOMContentLoaded', function () {

  // 1) Поиск формы через document.forms
  const form = document.forms['orderForm'];   // по name/id
  // либо: document.forms[0];  либо: document.forms.orderForm
  if (!form) return;   // на страницах без формы скрипт просто выходит

  // 2) Обработчик submit
  form.addEventListener('submit', function (event) {

    // 3) Отменяем перезагрузку страницы
    event.preventDefault();

    // 4) Получаем данные через FormData
    const formData = new FormData(form);

    // Для наглядности — как объект
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // 5) Выводим в консоль разработчика
    console.log('Данные формы:', data);

    // 6) Валидация. При ошибке — SweetAlert с ошибкой
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Имя должно содержать минимум 2 символа.');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Введите корректный email.');
    }
    if (!data.password || data.password.length < 6) {
      errors.push('Пароль должен быть не короче 6 символов.');
    }
    const qty = Number(data.quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      errors.push('Количество товара должно быть положительным числом.');
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Ошибка в данных',
        html: errors.map(e => `• ${e}`).join('<br>'),
        confirmButtonText: 'Исправить'
      });
      return;  // не отправляем
    }

    // 7) Успех — SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Заказ оформлен!',
      html: `Спасибо, <b>${escapeHtml(data.name)}</b>!<br>
             Мы свяжемся с вами по адресу ${escapeHtml(data.email)}.`,
      confirmButtonText: 'Отлично'
    }).then(() => {
      form.reset();   // очищаем форму после подтверждения
    });

    // Реальная отправка на сервер (когда появится бэкенд):
    // fetch('/api/order', { method: 'POST', body: formData });
  });

});

// Простая защита от XSS при вставке пользовательских данных в HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
