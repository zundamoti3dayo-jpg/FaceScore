export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  try {
    // フロントエンドから送られてきたFormDataをそのままDiscordへ転送
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: req.body, // バイナリデータ（画像含む）を保持
      headers: {
        'Content-Type': req.headers['content-type'],
      },
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errText = await response.text();
      return res.status(500).json({ error: errText });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Vercelで大きなバイナリを扱うための設定
export const config = {
  api: {
    bodyParser: false, 
  },
};
