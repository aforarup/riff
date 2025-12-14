import { Metadata } from 'next';
import { LegalLayout, Section, SubSection, List } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy - Riff',
  description: 'Privacy Policy for Riff presentation platform. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="December 14, 2024">
      <Section title="Introduction">
        <p>
          At Riff (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we respect your privacy and are committed
          to protecting your personal information. This Privacy Policy explains how we collect,
          use, share, and protect information when you use our presentation platform at riff.im
          (the &quot;Service&quot;).
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance
          with this Privacy Policy. If you do not agree with our practices, please do not use
          the Service.
        </p>
      </Section>

      <Section title="1. Information We Collect">
        <SubSection title="Information You Provide">
          <p>We collect information you provide directly to us, including:</p>
          <List items={[
            "Account information: When you sign in with Google, we receive your name, email address, and profile picture",
            "Content: Presentations, text, images, and other materials you create or upload",
            "Communications: Any messages or feedback you send to us",
          ]} />
        </SubSection>

        <SubSection title="Information Collected Automatically">
          <p>When you use the Service, we automatically collect certain information:</p>
          <List items={[
            "Usage data: Pages visited, features used, and actions taken within the Service",
            "Device information: Browser type, operating system, and device identifiers",
            "Log data: IP address, access times, and referring URLs",
          ]} />
        </SubSection>

        <SubSection title="Cookies and Similar Technologies">
          <p>
            We use cookies and similar technologies to maintain your session, remember your
            preferences, and analyze how you use the Service. You can control cookies through
            your browser settings, but disabling them may affect functionality.
          </p>
        </SubSection>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <List items={[
          "Provide and maintain the Service",
          "Store and display your presentations",
          "Process your requests and respond to your inquiries",
          "Improve and develop new features",
          "Analyze usage patterns and optimize performance",
          "Send you important updates about the Service",
          "Protect against fraud and abuse",
          "Comply with legal obligations",
        ]} />
      </Section>

      <Section title="3. How We Share Your Information">
        <p>
          We do not sell your personal information. We may share your information in the
          following circumstances:
        </p>

        <SubSection title="Service Providers">
          <p>We work with third-party service providers who help us operate the Service:</p>
          <List items={[
            "Vercel: Hosting and infrastructure",
            "Google: Authentication services",
            "AI providers: Image and theme generation (prompts only, not personal data)",
            "Analytics providers: Usage analysis (anonymized data)",
          ]} />
        </SubSection>

        <SubSection title="Public Content">
          <p>
            When you publish a presentation, it becomes accessible via a public URL.
            Anyone with the link can view published content. Unpublished presentations
            remain private to your account.
          </p>
        </SubSection>

        <SubSection title="Legal Requirements">
          <p>
            We may disclose your information if required by law, legal process, or
            government request, or to protect our rights and the safety of our users.
          </p>
        </SubSection>

        <SubSection title="Business Transfers">
          <p>
            If Riff is involved in a merger, acquisition, or sale of assets, your
            information may be transferred as part of that transaction.
          </p>
        </SubSection>
      </Section>

      <Section title="4. Data Retention">
        <p>
          We retain your information for as long as your account is active or as needed
          to provide the Service. Specifically:
        </p>
        <List items={[
          "Account data: Retained until you delete your account",
          "Presentations: Retained until you delete them or your account",
          "Usage logs: Retained for up to 12 months",
          "Published content: May be cached by third parties even after deletion",
        ]} />
        <p>
          After account deletion, we may retain certain information as required by law
          or for legitimate business purposes (e.g., fraud prevention).
        </p>
      </Section>

      <Section title="5. Your Rights and Choices">
        <SubSection title="Access and Export">
          <p>
            You can access your presentations and account information through the Service.
            Your content is stored in markdown format, making it easy to export and use
            elsewhere.
          </p>
        </SubSection>

        <SubSection title="Correction">
          <p>
            You can update your presentations at any time through the editor. Account
            information is synced from your Google account.
          </p>
        </SubSection>

        <SubSection title="Deletion">
          <p>
            You can delete individual presentations through the Service. To delete your
            account and all associated data, please contact us at hello@riff.im.
          </p>
        </SubSection>

        <SubSection title="Opt-Out">
          <p>
            You can opt out of non-essential communications by contacting us. Note that
            we may still send you important service-related messages.
          </p>
        </SubSection>
      </Section>

      <Section title="6. Data Security">
        <p>
          We implement appropriate technical and organizational measures to protect your
          information, including:
        </p>
        <List items={[
          "Encryption: All data is encrypted in transit using HTTPS/TLS",
          "Secure infrastructure: Hosted on Vercel with enterprise-grade security",
          "Access controls: Limited employee access to personal data",
          "Authentication: Secure OAuth 2.0 through Google",
        ]} />
        <p>
          However, no method of transmission over the internet is 100% secure. While we
          strive to protect your information, we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="7. Third-Party Services">
        <p>
          The Service integrates with third-party services that have their own privacy
          policies:
        </p>
        <List items={[
          "Google (Authentication): https://policies.google.com/privacy",
          "Vercel (Hosting): https://vercel.com/legal/privacy-policy",
        ]} />
        <p>
          We encourage you to review the privacy policies of any third-party services
          you interact with through Riff.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          The Service is not intended for children under 13 years of age. We do not
          knowingly collect personal information from children under 13. If you are a
          parent or guardian and believe your child has provided us with personal
          information, please contact us so we can delete it.
        </p>
      </Section>

      <Section title="9. International Data Transfers">
        <p>
          The Service is hosted in the United States through Vercel&apos;s global infrastructure.
          If you access the Service from outside the United States, your information may be
          transferred to, stored, and processed in the United States or other countries
          where our service providers operate.
        </p>
        <p>
          By using the Service, you consent to the transfer of your information to countries
          that may have different data protection laws than your country of residence.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any
          significant changes by posting the new policy on this page and updating the
          &quot;Last updated&quot; date.
        </p>
        <p>
          We encourage you to review this Privacy Policy periodically. Your continued use
          of the Service after any changes indicates your acceptance of the updated policy.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          If you have any questions or concerns about this Privacy Policy or our data
          practices, please contact us at:
        </p>
        <p className="mt-2">
          <strong className="text-white">Email:</strong>{' '}
          <a href="mailto:hello@riff.im" className="text-amber-400 hover:text-amber-300">
            hello@riff.im
          </a>
        </p>
      </Section>

      <Section title="12. Additional Rights for Specific Regions">
        <SubSection title="European Economic Area (EEA)">
          <p>
            If you are in the EEA, you may have additional rights under GDPR, including
            the right to access, rectify, port, and erase your data, as well as the right
            to restrict or object to certain processing. To exercise these rights, contact
            us at hello@riff.im.
          </p>
        </SubSection>

        <SubSection title="California">
          <p>
            California residents may have additional rights under CCPA, including the right
            to know what personal information we collect and how it&apos;s used, the right to
            delete personal information, and the right to opt-out of the sale of personal
            information (note: we do not sell personal information).
          </p>
        </SubSection>
      </Section>
    </LegalLayout>
  );
}
