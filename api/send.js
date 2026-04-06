export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook URL is not set' });
  }

  try {
    // フロントエンドから送られてきた raw body をそのまま Discord に流し込む
    // Content-Type ヘッダーを正確に引き継ぐのがコツです
    const contentType = req.headers['content-type'];
    
    // Vercel の Edge ネットワーク経由で送るための設定
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: req.body,
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.text();
      console.error('Discord Error:', errorData);
      return res.status(response.status).send(errorData);
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// 非常に重要：Vercel に Body を勝手に解析させない設定
export const config = {
  api: {
    bodyParser: false,
  },
};
