import { LegalDocumentScreen } from '@/components/settings/LegalDocumentScreen';

export default function TermsOfUseScreen() {
  return (
    <LegalDocumentScreen
      title="Terms of Use"
      sections={[
        {
          heading: 'Agreement',
          body:
            'By using FitLife you agree to these Terms. If you do not agree, do not use the app.',
        },
        {
          heading: 'Not medical advice',
          body:
            'FitLife provides general fitness and nutrition information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a physician before beginning a new exercise program.',
        },
        {
          heading: 'Assumption of risk',
          body:
            'Physical exercise involves inherent risk. You assume full responsibility for your participation and for stopping if you experience pain, dizziness, or distress.',
        },
        {
          heading: 'Coach tips',
          body:
            'Coach tips use scripted motivational replies — not a live AI model and not a human coach. Do not use the app for emergencies.',
        },
        {
          heading: 'Acceptable use',
          body:
            'Do not misuse the app for emergencies. Do not rely on med tracking for prescription dosing.',
        },
        {
          heading: 'Disclaimer of warranties',
          body:
            'FitLife is provided “as is” without warranties of any kind. We do not guarantee specific fitness or weight outcomes.',
        },
        {
          heading: 'Limitation of liability',
          body:
            'To the maximum extent permitted by law, FitLife and its operators are not liable for indirect or consequential damages arising from use of the app.',
        },
        {
          heading: 'Contact',
          body: 'Email support@fitlife.app for support or legal questions.',
        },
      ]}
    />
  );
}
