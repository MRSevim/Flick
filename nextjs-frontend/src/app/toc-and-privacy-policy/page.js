import React from "react";
import links from "@/utils/Links";
import Link from "next/link";
import { envVariables } from "@/utils/HelperFuncs";

const page = () => {
  return (
    <div class="container">
      <div>
        <h1>Terms of Conditions</h1>
        <p>Last Updated: 15 June 2024</p>
        <p>
          Welcome to {envVariables.websiteName} (the "Website"). By accessing or
          using our Website, you agree to comply with and be bound by these
          Terms of Conditions ("Terms"). Please read them carefully.
        </p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account or using the Website, you agree to these Terms
          and our Privacy Policy. If you do not agree, please do not use our
          Website.
        </p>
        <h2>2. User Accounts</h2>
        <p>
          <strong>Eligibility:</strong> You must be at least 13 years old to
          create an account.
        </p>
        <p>
          <strong>Account Security:</strong> You are responsible for maintaining
          the confidentiality of your account information and password.
        </p>
        <p>
          <strong>Account Termination:</strong> We reserve the right to suspend
          or terminate accounts that violate these Terms.
        </p>
        <h2>3. User Conduct</h2>
        <p>You agree not to use the Website to:</p>
        <ul>
          <li>
            Post or transmit any content that is illegal, harmful, threatening,
            abusive, harassing, defamatory, vulgar, obscene, libelous, invasive
            of another’s privacy, hateful, or racially, ethnically, or otherwise
            objectionable.
          </li>
          <li>
            Post or transmit content that promotes terrorism, racism, sexism or
            any other form of discrimination, violence or hate.
          </li>
          <li>
            Impersonate any person or entity, or falsely state or otherwise
            misrepresent your affiliation with a person or entity.
          </li>
          <li>
            Post or transmit content that is not written in English. Non-English
            content is allowed if it serves a specific purpose, such as quoting
            something in another language to make a point.
          </li>
          <li>
            Post or transmit any unsolicited advertising, promotional materials,
            "junk mail," "spam," "chain letters," "pyramid schemes," or any
            other form of solicitation.
          </li>
        </ul>
        <h2>4. Content Management</h2>
        <p>
          <strong>Right to Remove Content:</strong> We reserve the right to
          remove any content that we determine, in our sole discretion, violates
          these Terms or is otherwise harmful.
        </p>
        <p>
          <strong>Right to Ban Users:</strong> We reserve the right to ban users
          who repeatedly violate these Terms, including but not limited to
          posting prohibited content.
        </p>
        <h2>5. Intellectual Property</h2>
        <p>
          All content on the Website, including graphics, logos, software, and
          content supplied by {envVariables.websiteName} or its content
          suppliers, is the property of {envVariables.websiteName} and protected
          by copyright laws. User-generated content, such as articles, remains
          the property of the respective users. However, by submitting content
          to the Website, users grant {envVariables.websiteName} a
          non-exclusive, royalty-free, worldwide license to use, distribute,
          display, and create derivative works from their content.
        </p>
        <h2>6. Dispute Resolution</h2>
        <p>
          Any disputes arising out of or relating to these Terms or the Website
          shall be resolved through binding arbitration, except for any disputes
          arising from the rights and obligations regarding intellectual
          property, which may be brought before the appropriate court of
          jurisdiction.
        </p>
        <p>
          For disputes not related to intellectual property, the arbitration
          shall be conducted under the rules of an internationally recognized
          arbitration body, such as the International Chamber of Commerce (ICC)
          or the United Nations Commission on International Trade Law
          (UNCITRAL). The place of arbitration shall be neutral and agreed upon
          by both parties.
        </p>
        <p>
          In the event of any disputes arising from intellectual property
          rights, the parties agree to submit to the exclusive jurisdiction of
          the international courts, such as the International Court of Justice
          (ICJ) or another appropriate international arbitration tribunal.
        </p>
        <p>
          This clause shall be governed by and interpreted in accordance with
          the principles of international law, rather than the laws of any
          specific country.
        </p>
        <h2>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Your continued
          use of the Website constitutes your acceptance of the revised Terms.
        </p>
      </div>

      <div>
        <h1>Privacy Policy</h1>
        <p>Last Updated: 10 June 2024</p>
        <p>
          {envVariables.websiteName} ("we," "us," "our") is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, and share your personal information.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          <strong>Personal Information:</strong> We collect information you
          provide when creating an account, such as your email address, and
          password.
        </p>
        <p>
          <strong>Usage Data:</strong> We collect information about how you use
          the Website, such as your IP address, browser type, and pages visited.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>
          <strong>Provide Services:</strong> To provide and improve our
          services, including managing your account and personalizing your
          experience.
        </p>
        <p>
          <strong>Communication:</strong> To send you notifications about
          actions on the Website, such as releases, likes, comments, and new
          followers.
        </p>
        <p>
          <strong>Security:</strong> To protect the security of our Website and
          users.
        </p>
        <h2>3. Sharing Your Information</h2>
        <p>
          <strong>Legal Requirements:</strong> We may disclose your information
          if required by law or in response to legal processes.
        </p>
        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction.
        </p>
        <h2>5. Your Rights</h2>
        <p>
          <strong>Access:</strong> You have the right to access the personal
          information we hold about you.
        </p>
        <p>
          <strong>Correction:</strong> You have the right to request correction
          of inaccurate personal information.
        </p>
        <p>
          <strong>Deletion:</strong> You have the right to request deletion of
          your personal information, subject to certain exceptions.
        </p>
        <h2>6. Cookies</h2>
        <p>
          We use cookies to improve your experience on our Website. You can
          control the use of cookies through your browser settings.
        </p>
        <h2>7. Changes to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on our Website.
        </p>
      </div>
      <h1>Contact Us</h1>
      <p>
        If you have any questions about Terms of Conditions (ToC) or Privacy
        Policy, please contact us at{" "}
        <Link
          href={links.mail}
          className="unstyled-link hovered-link"
          target="_blank"
        >
          {envVariables.email}
        </Link>{" "}
      </p>
    </div>
  );
};
export default page;
