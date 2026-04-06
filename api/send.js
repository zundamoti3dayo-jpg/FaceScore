// api/send.js
export default async function handler(req, res) {
  // POSTメソッド以外は拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error("Webhook URL is missing in Environment Variables");
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  try {
    // フロントエンドから届いたBody（FormData）をそのまま転送
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: req.body, 
      // Vercelが自動的にContent-Typeを引き継げない場合があるため、明示的に指定しない（自動に任せる）
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const status = response.status;
      const text = await response.text();
      return res.status(status).json({ error: text });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// 必須設定：BodyParserを無効にすることで、画像データを壊さずに受信できます
export const config = {
  api: {
    bodyParser: false,
  },
};
