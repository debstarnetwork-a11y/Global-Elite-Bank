const fs = require('fs');
let content = fs.readFileSync('src/components/landing/ContactView.tsx', 'utf8');

const defaultHeadingsStr = `
    membershipApplicationsHeading: 'Membership Applications',
    memberSupportHeading: 'Member Support',
    privateBankingHeading: 'Private Banking & Wealth',
    headOfficeHeading: 'Head Office',
    cardLostHeading: 'Card Lost or Stolen?',
    suspiciousActivityHeading: 'Suspicious Activity?',
    mediaInquiriesHeading: 'Media Inquiries?',
    partnershipInquiriesHeading: 'Partnership Inquiries?',
`;

// Insert the default headings into the content fallback object
content = content.replace(/(membershipApplicationsEmail: 'globalelitefund@gmail\.com',)/, "$1" + defaultHeadingsStr);

content = content.replace(/<h3 className="text-lg font-bold text-foreground mb-2">Membership Applications<\/h3>/g, '<h3 className="text-lg font-bold text-foreground mb-2">{content.membershipApplicationsHeading}</h3>');
content = content.replace(/<h3 className="text-lg font-bold text-foreground mb-2">Member Support<\/h3>/g, '<h3 className="text-lg font-bold text-foreground mb-2">{content.memberSupportHeading}</h3>');
content = content.replace(/<h3 className="text-lg font-bold text-foreground mb-2">Private Banking & Wealth<\/h3>/g, '<h3 className="text-lg font-bold text-foreground mb-2">{content.privateBankingHeading}</h3>');
content = content.replace(/<h3 className="text-lg font-bold text-foreground mb-2">Head Office<\/h3>/g, '<h3 className="text-lg font-bold text-foreground mb-2">{content.headOfficeHeading}</h3>');

content = content.replace(/<h4 className="font-bold text-foreground mb-2">Card Lost or Stolen\?<\/h4>/g, '<h4 className="font-bold text-foreground mb-2">{content.cardLostHeading}</h4>');
content = content.replace(/<h4 className="font-bold text-foreground mb-2">Suspicious Activity\?<\/h4>/g, '<h4 className="font-bold text-foreground mb-2">{content.suspiciousActivityHeading}</h4>');
content = content.replace(/<h4 className="font-bold text-foreground mb-2">Media Inquiries\?<\/h4>/g, '<h4 className="font-bold text-foreground mb-2">{content.mediaInquiriesHeading}</h4>');
content = content.replace(/<h4 className="font-bold text-foreground mb-2">Partnership Inquiries\?<\/h4>/g, '<h4 className="font-bold text-foreground mb-2">{content.partnershipInquiriesHeading}</h4>');

fs.writeFileSync('src/components/landing/ContactView.tsx', content);
console.log('Done replacing ContactView!');
