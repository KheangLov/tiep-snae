export type AppLocale = 'en' | 'km'

export const locales: AppLocale[] = ['en', 'km']

export const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  km: 'ខ្មែរ',
}

type MessageDict = Record<string, string>

export const messages: Record<AppLocale, MessageDict> = {
  en: {
    'app.name': 'Tiep Snae',
    'app.tagline': 'Digital wedding invitations, entirely private',

    'nav.templates': 'Templates',
    'nav.myInvitations': 'My Invitations',
    'nav.createNew': 'Create New',
    'nav.settings': 'AI Assistant',
    'nav.accountMenu': 'Menu',
    'nav.language': 'Language',
    'nav.switchLight': 'Switch to light mode',
    'nav.switchDark': 'Switch to dark mode',
    'nav.darkMode': 'Dark mode',

    'common.close': 'Close',
    'common.cancel': 'Cancel',

    'privacy.open': 'Privacy',
    'privacy.short': 'Private',
    'privacy.title': 'Your privacy',
    'privacy.subtitle': "Your invitation stays under your control. We never see it.",
    'privacy.localTitle': 'Invitation data stays in this browser',
    'privacy.localBody': "Invitation text and public media links are saved in this browser. Image and audio files stay in storage you control and are never uploaded to us.",
    'privacy.trackingTitle': 'No tracking',
    'privacy.trackingBody': "We don't use analytics or trackers that identify you or your guests.",
    'privacy.aiTitle': 'AI assistant (optional)',
    'privacy.aiBody': 'If you use the AI assistant, your messages go directly from your browser to the AI provider you choose, using your own API key. We never see them.',
    'privacy.feedbackTitle': 'No accounts',
    'privacy.feedbackBody': "There's nothing to sign up for. Just start designing.",
    'privacy.storageTitle': "What's stored right now",
    'privacy.savedInvites': '{count} invitation(s) saved',
    'privacy.keySaved': 'AI key saved',
    'privacy.noKey': 'No AI key saved',
    'privacy.storageUsed': '{size} used',
    'privacy.preferencesNote': 'Your theme and language preference are also stored locally so we can remember them for you.',
    'privacy.deleteData': 'Delete all my data',
    'privacy.deleteTitle': 'Delete all local data?',
    'privacy.deleteBody': 'This permanently removes every invitation, AI key, and preference stored in this browser. This cannot be undone.',
    'privacy.deleteConfirm': 'Delete everything',
  },
  km: {
    'app.name': 'Tiep Snae',
    'app.tagline': 'សំបុត្រអញ្ជើញអាពាហ៍ពិពាហ៍ឌីជីថល ជាឯកជនទាំងស្រុង',

    'nav.templates': 'ពុម្ព',
    'nav.myInvitations': 'សំបុត្រអញ្ជើញរបស់ខ្ញុំ',
    'nav.createNew': 'បង្កើតថ្មី',
    'nav.settings': 'ជំនួយការ AI',
    'nav.accountMenu': 'ម៉ឺនុយ',
    'nav.language': 'ភាសា',
    'nav.switchLight': 'ប្តូរទៅរបៀបភ្លឺ',
    'nav.switchDark': 'ប្តូរទៅរបៀបងងឹត',
    'nav.darkMode': 'របៀបងងឹត',

    'common.close': 'បិទ',
    'common.cancel': 'ច្រានចោល',

    'privacy.open': 'ភាពឯកជន',
    'privacy.short': 'ឯកជន',
    'privacy.title': 'ភាពឯកជនរបស់អ្នក',
    'privacy.subtitle': 'សំបុត្រអញ្ជើញរបស់អ្នកនៅតែស្ថិតក្រោមការគ្រប់គ្រងរបស់អ្នក។ យើងមិនដែលឃើញវាទេ។',
    'privacy.localTitle': 'ទិន្នន័យសំបុត្រអញ្ជើញស្ថិតក្នុងកម្មវិធីរុករកនេះ',
    'privacy.localBody': 'អត្ថបទសំបុត្រអញ្ជើញ និងតំណមេឌៀសាធារណៈ ត្រូវបានរក្សាទុកក្នុងកម្មវិធីរុករកនេះ។ ឯកសាររូបភាព និងសំឡេងនៅតែស្ថិតក្នុងកន្លែងផ្ទុកដែលអ្នកគ្រប់គ្រង ហើយមិនត្រូវបានផ្ទុកឡើងមកយើងទេ។',
    'privacy.trackingTitle': 'គ្មានការតាមដាន',
    'privacy.trackingBody': 'យើងមិនប្រើឧបករណ៍វិភាគ ឬតាមដានដែលកំណត់អត្តសញ្ញាណអ្នក ឬភ្ញៀវរបស់អ្នកឡើយ។',
    'privacy.aiTitle': 'ជំនួយការ AI (ស្រេចចិត្ត)',
    'privacy.aiBody': 'ប្រសិនបើអ្នកប្រើជំនួយការ AI សារបស់អ្នកនឹងផ្ញើដោយផ្ទាល់ពីកម្មវិធីរុករករបស់អ្នក ទៅកាន់អ្នកផ្តល់សេវា AI ដោយប្រើគន្លឹះផ្ទាល់ខ្លួនរបស់អ្នក។ យើងមិនដែលឃើញវាឡើយ។',
    'privacy.feedbackTitle': 'គ្មានគណនី',
    'privacy.feedbackBody': 'មិនចាំបាច់ចុះឈ្មោះអ្វីទាំងអស់ទេ។ គ្រាន់តែចាប់ផ្តើមរចនា។',
    'privacy.storageTitle': 'អ្វីដែលកំពុងរក្សាទុកឥឡូវនេះ',
    'privacy.savedInvites': 'សំបុត្រអញ្ជើញ {count} បានរក្សាទុក',
    'privacy.keySaved': 'គន្លឹះ AI បានរក្សាទុក',
    'privacy.noKey': 'គ្មានគន្លឹះ AI',
    'privacy.storageUsed': 'បានប្រើ {size}',
    'privacy.preferencesNote': 'ស្បែក និងភាសាដែលអ្នកជ្រើសរើស ក៏ត្រូវបានរក្សាទុកនៅលើមូលដ្ឋានផងដែរ ដើម្បីឱ្យយើងចងចាំវាសម្រាប់អ្នក។',
    'privacy.deleteData': 'លុបទិន្នន័យទាំងអស់របស់ខ្ញុំ',
    'privacy.deleteTitle': 'លុបទិន្នន័យមូលដ្ឋានទាំងអស់?',
    'privacy.deleteBody': 'សកម្មភាពនេះនឹងលុបសំបុត្រអញ្ជើញ គន្លឹះ AI និងចំណូលចិត្តទាំងអស់ដែលបានរក្សាទុកនៅក្នុងកម្មវិធីរុករកនេះជាអចិន្ត្រៃយ៍។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
    'privacy.deleteConfirm': 'លុបអ្វីៗទាំងអស់',
  },
}
