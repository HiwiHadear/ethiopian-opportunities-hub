// Shared email styling and branding
export interface EmailBranding {
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  company_name: string;
  company_website?: string;
  support_email?: string;
}

export const getEmailStyles = (branding?: EmailBranding) => {
  const primaryColor = branding?.primary_color || '#667eea';
  const secondaryColor = branding?.secondary_color || '#764ba2';
  
  return {
  main: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background-color: #f6f9fc;
    margin: 0;
    padding: 0;
  `,
  container: `
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  `,
  header: `
    background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
    padding: 40px 30px;
    text-align: center;
  `,
  headerTitle: `
    color: #ffffff;
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `,
  content: `
    padding: 40px 30px;
  `,
  greeting: `
    color: #333333;
    font-size: 18px;
    margin: 0 0 20px 0;
  `,
  text: `
    color: #666666;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 20px 0;
  `,
  card: `
    background-color: #f8f9fa;
    border-left: 4px solid ${primaryColor};
    padding: 20px;
    border-radius: 4px;
    margin: 20px 0;
  `,
  cardTitle: `
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
  `,
  cardDetail: `
    color: #666666;
    font-size: 14px;
    margin: 8px 0;
    display: flex;
    align-items: center;
  `,
  label: `
    font-weight: 600;
    color: #333333;
    margin-right: 8px;
    min-width: 100px;
  `,
  button: `
    display: inline-block;
    background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
    color: #ffffff;
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 16px;
    margin: 20px 0;
    box-shadow: 0 4px 12px ${primaryColor}4D;
  `,
  statusBadge: (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      accepted: '#10b981',
      rejected: '#ef4444',
    };
    return `
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      background-color: ${colors[status] || '#6b7280'}22;
      color: ${colors[status] || '#6b7280'};
    `;
  },
  footer: `
    background-color: #f8f9fa;
    padding: 30px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
  `,
  footerText: `
    color: #9ca3af;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 10px 0;
  `,
  divider: `
    height: 1px;
    background-color: #e5e7eb;
    margin: 20px 0;
  `,
  statsBox: `
    background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
    color: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    margin: 30px 0;
    box-shadow: 0 4px 12px ${primaryColor}4D;
  `,
  statsNumber: `
    font-size: 48px;
    font-weight: bold;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `,
  statsLabel: `
    font-size: 18px;
    margin: 10px 0 0 0;
    opacity: 0.95;
  `,
  applicationList: `
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  `,
  applicationItem: `
    background-color: #ffffff;
    padding: 16px;
    border-radius: 6px;
    margin-bottom: 12px;
    border: 1px solid #e5e7eb;
  `,
  };
};

export interface InstantNotificationData {
  recipientName: string;
  applicantName: string;
  applicationType: 'job' | 'tender';
  title: string;
  appliedAt: string;
  dashboardUrl: string;
  branding?: EmailBranding;
}

export function generateInstantNotificationEmail(data: InstantNotificationData): string {
  const applicationTypeLabel = data.applicationType === 'job' ? 'Job' : 'Tender';
  const emailStyles = getEmailStyles(data.branding);
  const companyName = data.branding?.company_name || 'Your Company';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New ${applicationTypeLabel} Application</title>
      </head>
      <body style="${emailStyles.main}">
        <div style="padding: 40px 20px;">
          <div style="${emailStyles.container}">
            <div style="${emailStyles.header}">
              ${data.branding?.logo_url ? `
                <img src="${data.branding.logo_url}" alt="${companyName}" style="height: 48px; width: auto; margin-bottom: 16px;" />
              ` : ''}
              <h1 style="${emailStyles.headerTitle}">🎉 New Application Received!</h1>
            </div>
            
            <div style="${emailStyles.content}">
              <p style="${emailStyles.greeting}">Hello ${data.recipientName},</p>
              
              <p style="${emailStyles.text}">
                Great news! A new ${applicationTypeLabel.toLowerCase()} application has just been submitted and is awaiting your review.
              </p>
              
              <div style="${emailStyles.card}">
                <h2 style="${emailStyles.cardTitle}">${applicationTypeLabel} Application Details</h2>
                
                <div style="${emailStyles.cardDetail}">
                  <span style="${emailStyles.label}">Applicant:</span>
                  <span>${data.applicantName}</span>
                </div>
                
                <div style="${emailStyles.cardDetail}">
                  <span style="${emailStyles.label}">${applicationTypeLabel}:</span>
                  <span>${data.title}</span>
                </div>
                
                <div style="${emailStyles.cardDetail}">
                  <span style="${emailStyles.label}">Submitted:</span>
                  <span>${new Date(data.appliedAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}</span>
                </div>
                
                <div style="${emailStyles.cardDetail}">
                  <span style="${emailStyles.label}">Status:</span>
                  <span style="${emailStyles.statusBadge('pending')}">Pending Review</span>
                </div>
              </div>
              
              <p style="${emailStyles.text}">
                Don't keep them waiting! Review the application now to provide timely feedback.
              </p>
              
              <div style="text-align: center;">
                <a href="${data.dashboardUrl}" style="${emailStyles.button}">
                  Review Application →
                </a>
              </div>
            </div>
            
            <div style="${emailStyles.footer}">
              <p style="${emailStyles.footerText}">
                You're receiving this email because you have instant notifications enabled for new applications.
              </p>
              <p style="${emailStyles.footerText}">
                Want to change your notification preferences? Update them in your admin settings.
              </p>
              ${data.branding?.support_email ? `
                <p style="${emailStyles.footerText}">
                  Need help? Contact us at ${data.branding.support_email}
                </p>
              ` : ''}
              ${data.branding?.company_website ? `
                <p style="${emailStyles.footerText}">
                  <a href="${data.branding.company_website}" style="color: #9ca3af; text-decoration: underline;">Visit our website</a>
                </p>
              ` : ''}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export interface DigestData {
  recipientName: string;
  frequency: 'daily' | 'weekly';
  totalApplications: number;
  jobApplications?: Array<{
    full_name: string;
    email: string;
    applied_at: string;
    status: string;
    jobs: {
      title: string;
      company: string;
    };
  }>;
  tenderApplications?: Array<{
    company_name: string;
    company_email: string;
    applied_at: string;
    status: string;
    tenders: {
      title: string;
      organization: string;
    };
  }>;
  dashboardUrl: string;
  branding?: EmailBranding;
}

export function generateDigestEmail(data: DigestData): string {
  const periodLabel = data.frequency === 'daily' ? 'Daily' : 'Weekly';
  const timePeriod = data.frequency === 'daily' ? '24 hours' : '7 days';
  const emailStyles = getEmailStyles(data.branding);
  const companyName = data.branding?.company_name || 'Your Company';
  
  let applicationsHTML = '';
  
  if (data.jobApplications && data.jobApplications.length > 0) {
    applicationsHTML += `
      <h3 style="color: #333333; font-size: 20px; margin: 30px 0 15px 0; display: flex; align-items: center;">
        💼 Job Applications (${data.jobApplications.length})
      </h3>
      <div style="${emailStyles.applicationList}">
    `;
    
    data.jobApplications.slice(0, 10).forEach(app => {
      applicationsHTML += `
        <div style="${emailStyles.applicationItem}">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <strong style="color: #333333; font-size: 16px;">${app.full_name || app.email}</strong>
            <span style="${emailStyles.statusBadge(app.status)}">${app.status}</span>
          </div>
          <div style="color: #666666; font-size: 14px; margin-bottom: 4px;">
            Applied for: <strong>${app.jobs.title}</strong>
          </div>
          <div style="color: #9ca3af; font-size: 13px;">
            ${app.jobs.company} • ${new Date(app.applied_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        </div>
      `;
    });
    
    if (data.jobApplications.length > 10) {
      applicationsHTML += `
        <p style="color: #666666; text-align: center; margin: 15px 0 0 0;">
          And ${data.jobApplications.length - 10} more job application(s)...
        </p>
      `;
    }
    
    applicationsHTML += `</div>`;
  }
  
  if (data.tenderApplications && data.tenderApplications.length > 0) {
    applicationsHTML += `
      <h3 style="color: #333333; font-size: 20px; margin: 30px 0 15px 0; display: flex; align-items: center;">
        📋 Tender Applications (${data.tenderApplications.length})
      </h3>
      <div style="${emailStyles.applicationList}">
    `;
    
    data.tenderApplications.slice(0, 10).forEach(app => {
      applicationsHTML += `
        <div style="${emailStyles.applicationItem}">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <strong style="color: #333333; font-size: 16px;">${app.company_name || app.company_email}</strong>
            <span style="${emailStyles.statusBadge(app.status)}">${app.status}</span>
          </div>
          <div style="color: #666666; font-size: 14px; margin-bottom: 4px;">
            Applied for: <strong>${app.tenders.title}</strong>
          </div>
          <div style="color: #9ca3af; font-size: 13px;">
            ${app.tenders.organization} • ${new Date(app.applied_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        </div>
      `;
    });
    
    if (data.tenderApplications.length > 10) {
      applicationsHTML += `
        <p style="color: #666666; text-align: center; margin: 15px 0 0 0;">
          And ${data.tenderApplications.length - 10} more tender application(s)...
        </p>
      `;
    }
    
    applicationsHTML += `</div>`;
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${periodLabel} Application Digest</title>
      </head>
      <body style="${emailStyles.main}">
        <div style="padding: 40px 20px;">
          <div style="${emailStyles.container}">
            <div style="${emailStyles.header}">
              ${data.branding?.logo_url ? `
                <img src="${data.branding.logo_url}" alt="${companyName}" style="height: 48px; width: auto; margin-bottom: 16px;" />
              ` : ''}
              <h1 style="${emailStyles.headerTitle}">📊 ${periodLabel} Application Digest</h1>
            </div>
            
            <div style="${emailStyles.content}">
              <p style="${emailStyles.greeting}">Hello ${data.recipientName},</p>
              
              <p style="${emailStyles.text}">
                Here's your ${periodLabel.toLowerCase()} summary of application activity from the last ${timePeriod}.
              </p>
              
              <div style="${emailStyles.statsBox}">
                <h2 style="${emailStyles.statsNumber}">${data.totalApplications}</h2>
                <p style="${emailStyles.statsLabel}">New Application${data.totalApplications !== 1 ? 's' : ''}</p>
              </div>
              
              ${applicationsHTML}
              
              <div style="${emailStyles.divider}"></div>
              
              <p style="${emailStyles.text}">
                Ready to review these applications? Head to your dashboard to take action.
              </p>
              
              <div style="text-align: center;">
                <a href="${data.dashboardUrl}" style="${emailStyles.button}">
                  Go to Dashboard →
                </a>
              </div>
            </div>
            
            <div style="${emailStyles.footer}">
              <p style="${emailStyles.footerText}">
                You're receiving this ${data.frequency} digest based on your notification preferences.
              </p>
              <p style="${emailStyles.footerText}">
                Want to change how often you receive these? Update your preferences in the admin settings.
              </p>
              ${data.branding?.support_email ? `
                <p style="${emailStyles.footerText}">
                  Need help? Contact us at ${data.branding.support_email}
                </p>
              ` : ''}
              ${data.branding?.company_website ? `
                <p style="${emailStyles.footerText}">
                  <a href="${data.branding.company_website}" style="color: #9ca3af; text-decoration: underline;">Visit our website</a>
                </p>
              ` : ''}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
