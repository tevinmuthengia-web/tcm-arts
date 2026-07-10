const { Resend } = require('resend');

// Initialize Resend with your API key (you'll add this to environment variables)
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPurchaseNotification = async (artwork, buyer, price) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `TCM Arts <noreply@${process.env.EMAIL_DOMAIN || 'tcm-arts.onrender.com'}>`,
      to: process.env.ADMIN_EMAIL || 'tevinmuthengia@gmail.com',
      subject: `🎨 New Artwork Purchase: ${artwork.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #d4af37;">🎨 Artwork Purchase Notification</h1>
          <p>Someone has expressed interest in purchasing an artwork from your gallery!</p>
          
          <div style="background: rgba(212, 175, 55, 0.1); padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #d4af37;">
            <h3>${artwork.title}</h3>
            <p><strong>Medium:</strong> ${artwork.medium}</p>
            <p><strong>Price:</strong> Ksh ${artwork.price.toLocaleString()}</p>
            <img src="${artwork.image_url}" alt="${artwork.title}" style="max-width: 200px; border-radius: 8px; margin-top: 10px;" />
          </div>
          
          <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h4>Buyer Information</h4>
            <p><strong>Name:</strong> ${buyer.name || 'Guest'}</p>
            <p><strong>Email:</strong> ${buyer.email || 'No email provided'}</p>
          </div>
          
          <p>Please contact the buyer to arrange payment and delivery.</p>
          <hr style="border-color: var(--border-color);" />
          <p style="color: #666; font-size: 12px;">TCM Arts - Fine Arts, Skating & Chess</p>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
};

module.exports = { sendPurchaseNotification };