import { LegalDocumentScreen } from '@/components/settings/LegalDocumentScreen';

export default function PrivacyPolicyScreen() {
  return (
    <LegalDocumentScreen
      title="Privacy Policy"
      sections={[
        {
          heading: 'Overview',
          body:
            'FitLife AI Coach (“FitLife”) helps you track home workouts, nutrition notes, and wellness habits. This policy describes what we collect and how we use it.',
        },
        {
          heading: 'Data we store',
          body:
            'Profile info you enter (name, goals, weight, sex), workout progress, notes, med checklists, and chat messages are stored on your device (AsyncStorage). If you sign in with Supabase when configured, account data may sync to our database.',
        },
        {
          heading: 'Data we do not sell',
          body:
            'We do not sell your personal information. We do not use third-party ad tracking in v1.0.',
        },
        {
          heading: 'Photos (Food Scan beta)',
          body:
            'Food photos you pick are processed on-device for beta macro estimates. We do not upload food images to a server in this version unless you later enable cloud features.',
        },
        {
          heading: 'Children',
          body:
            'FitLife is not directed at children under 13. Do not use the app if you are under the age required in your region without parental consent.',
        },
        {
          heading: 'Changes',
          body:
            'We may update this policy. Continued use after changes means you accept the updated policy.',
        },
        {
          heading: 'Contact',
          body: 'Email support@fitlife.app for privacy requests or account deletion help.',
        },
      ]}
    />
  );
}
