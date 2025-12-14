import { Metadata } from 'next';
import { LegalLayout, Section, SubSection, List } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service - Riff',
  description: 'Terms of Service for using Riff presentation platform.',
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="December 14, 2024">
      <Section title="1. Acceptance of Terms">
        <p>
          Welcome to Riff. By accessing or using our services at riff.im (the &quot;Service&quot;),
          you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree
          to these Terms, please do not use the Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and Riff
          (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We may update these Terms from time to time,
          and your continued use of the Service constitutes acceptance of any changes.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Riff is a presentation creation platform that allows users to create, edit,
          and share slide presentations using markdown-based content. The Service includes:
        </p>
        <List items={[
          "A web-based editor for creating and editing presentations",
          "AI-powered features for theme generation and image creation",
          "Publishing and sharing capabilities for your presentations",
          "Document import functionality to convert existing content to slides",
        ]} />
      </Section>

      <Section title="3. Account Registration">
        <p>
          To access certain features of the Service, you may need to create an account
          using Google authentication. By creating an account, you agree to:
        </p>
        <List items={[
          "Provide accurate and complete information",
          "Maintain the security of your account credentials",
          "Accept responsibility for all activities under your account",
          "Notify us immediately of any unauthorized access",
        ]} />
        <p>
          You must be at least 13 years old to use the Service. If you are under 18,
          you represent that you have your parent or guardian&apos;s permission to use the Service.
        </p>
      </Section>

      <Section title="4. Your Content">
        <SubSection title="Ownership">
          <p>
            You retain ownership of all content you create, upload, or share through the
            Service (&quot;Your Content&quot;). This includes your presentations, text, images,
            and any other materials you provide.
          </p>
        </SubSection>

        <SubSection title="License to Riff">
          <p>
            By using the Service, you grant us a limited, non-exclusive, worldwide license to:
          </p>
          <List items={[
            "Host, store, and display Your Content as necessary to provide the Service",
            "Create backups of Your Content for service reliability",
            "Make Your Content available when you choose to publish or share it",
          ]} />
          <p>
            This license is solely for the purpose of operating and improving the Service.
            We will not sell Your Content or use it for purposes unrelated to the Service.
          </p>
        </SubSection>

        <SubSection title="Content Responsibility">
          <p>
            You are solely responsible for Your Content. You represent and warrant that:
          </p>
          <List items={[
            "You own or have the necessary rights to use and share Your Content",
            "Your Content does not infringe on any third party's intellectual property rights",
            "Your Content does not violate any applicable laws or regulations",
          ]} />
        </SubSection>
      </Section>

      <Section title="5. AI-Generated Content">
        <p>
          The Service includes AI-powered features for generating themes and images.
          Regarding AI-generated content:
        </p>
        <List items={[
          "AI outputs are generated based on your prompts and inputs",
          "We do not guarantee the accuracy, appropriateness, or quality of AI outputs",
          "You are responsible for reviewing and approving any AI-generated content before use",
          "AI-generated images are subject to the terms of our third-party AI providers",
        ]} />
      </Section>

      <Section title="6. Prohibited Conduct">
        <p>You agree not to use the Service to:</p>
        <List items={[
          "Upload or share content that is illegal, harmful, threatening, abusive, or harassing",
          "Infringe on intellectual property rights of others",
          "Distribute malware, viruses, or other harmful code",
          "Attempt to gain unauthorized access to the Service or other users' accounts",
          "Use the Service for spam, phishing, or fraudulent purposes",
          "Interfere with or disrupt the Service's infrastructure",
          "Scrape, crawl, or collect data from the Service without permission",
          "Use the Service in any way that violates applicable laws",
        ]} />
      </Section>

      <Section title="7. Intellectual Property">
        <SubSection title="Riff's Rights">
          <p>
            The Service, including its design, features, and underlying technology,
            is owned by Riff and protected by intellectual property laws. You may not
            copy, modify, or create derivative works of the Service without our permission.
          </p>
        </SubSection>

        <SubSection title="Trademarks">
          <p>
            &quot;Riff&quot; and associated logos are trademarks of Riff. You may not use
            our trademarks without prior written consent.
          </p>
        </SubSection>
      </Section>

      <Section title="8. Third-Party Services">
        <p>
          The Service integrates with third-party services including:
        </p>
        <List items={[
          "Google (for authentication)",
          "AI providers (for image and theme generation)",
          "Cloud storage providers (for hosting your content)",
        ]} />
        <p>
          Your use of these third-party services is subject to their respective terms
          and privacy policies. We are not responsible for the practices of third-party services.
        </p>
      </Section>

      <Section title="9. Service Availability">
        <p>
          We strive to keep the Service available and reliable, but we do not guarantee
          uninterrupted access. The Service may be temporarily unavailable due to:
        </p>
        <List items={[
          "Scheduled maintenance and updates",
          "Technical issues or outages",
          "Circumstances beyond our reasonable control",
        ]} />
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the Service
          at any time with or without notice.
        </p>
      </Section>

      <Section title="10. Termination">
        <SubSection title="By You">
          <p>
            You may stop using the Service at any time. You can delete your account
            and associated data by contacting us.
          </p>
        </SubSection>

        <SubSection title="By Us">
          <p>
            We may suspend or terminate your access to the Service if you violate these
            Terms or for any other reason at our discretion. Upon termination, your right
            to use the Service ceases immediately.
          </p>
        </SubSection>
      </Section>

      <Section title="11. Disclaimers">
        <p className="uppercase text-white/50 text-sm">
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
          ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING, BUT NOT
          LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p className="uppercase text-white/50 text-sm mt-4">
          WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
          COMPLETELY SECURE. YOUR USE OF THE SERVICE IS AT YOUR OWN RISK.
        </p>
      </Section>

      <Section title="12. Limitation of Liability">
        <p className="uppercase text-white/50 text-sm">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIFF SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
          LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
        </p>
        <p className="uppercase text-white/50 text-sm mt-4">
          OUR TOTAL LIABILITY FOR ANY CLAIMS RELATED TO THE SERVICE SHALL NOT EXCEED
          THE AMOUNT YOU PAID US, IF ANY, IN THE TWELVE MONTHS PRECEDING THE CLAIM.
        </p>
      </Section>

      <Section title="13. Indemnification">
        <p>
          You agree to indemnify and hold harmless Riff and its officers, directors,
          employees, and agents from any claims, damages, losses, or expenses (including
          reasonable attorneys&apos; fees) arising from your use of the Service or violation
          of these Terms.
        </p>
      </Section>

      <Section title="14. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws
          of the State of Delaware, United States, without regard to its conflict of
          law provisions. Any disputes arising from these Terms shall be resolved in
          the courts of Delaware.
        </p>
      </Section>

      <Section title="15. General Provisions">
        <SubSection title="Entire Agreement">
          <p>
            These Terms, together with our Privacy Policy, constitute the entire
            agreement between you and Riff regarding the Service.
          </p>
        </SubSection>

        <SubSection title="Severability">
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining
            provisions shall continue in full force and effect.
          </p>
        </SubSection>

        <SubSection title="Waiver">
          <p>
            Our failure to enforce any right or provision of these Terms shall not
            constitute a waiver of such right or provision.
          </p>
        </SubSection>

        <SubSection title="Assignment">
          <p>
            You may not assign or transfer these Terms without our prior written consent.
            We may assign these Terms without restriction.
          </p>
        </SubSection>
      </Section>

      <Section title="16. Contact Us">
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mt-2">
          <strong className="text-white">Email:</strong>{' '}
          <a href="mailto:hello@riff.im" className="text-amber-400 hover:text-amber-300">
            hello@riff.im
          </a>
        </p>
      </Section>
    </LegalLayout>
  );
}
