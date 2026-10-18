export const hook = {
  questions: [
    { id: 'h_want', text: { en: 'Have you ever wanted to buy something, but could not?', hi: 'क्या आपने कभी कुछ खरीदना चाहा, पर खरीद नहीं पाईं?' },
      options: [ { id: 'often', text: { en: 'Yes, often', hi: 'हाँ, अक्सर' }, lesson: 'L1' }, { id: 'sometimes', text: { en: 'Sometimes', hi: 'कभी-कभी' }, lesson: 'L1' }, { id: 'no', text: { en: 'Not really', hi: 'नहीं' }, lesson: 'L2' } ] },
    { id: 'h_account', text: { en: 'Is there a bank account in your own name?', hi: 'क्या आपके अपने नाम पर बैंक खाता है?' },
      options: [ { id: 'yes', text: { en: 'Yes', hi: 'हाँ' }, rung0: true }, { id: 'no', text: { en: 'No', hi: 'नहीं' }, lesson: 'L3' }, { id: 'unsure', text: { en: 'Not sure', hi: 'पता नहीं' }, lesson: 'L3' } ] },
  ],
};

export const night = [
  { id: 'n_spend', text: { en: 'Did you spend on something today that you had not planned?', hi: 'क्या आज आपने कुछ ऐसा खरीदा जिसकी योजना नहीं थी?' }, options: ['yes', 'no'] },
  { id: 'n_save', text: { en: 'Did you set aside even a small amount today?', hi: 'क्या आज आपने थोड़ी सी भी रकम अलग रखी?' }, options: ['yes', 'no'] },
  { id: 'n_want', text: { en: 'Was there something you wanted today but could not buy?', hi: 'क्या आज कुछ चाहिए था पर खरीद नहीं पाईं?' }, options: ['yes', 'no'] },
  { id: 'n_papers', text: { en: 'Has anyone asked for a copy of your Aadhaar, PAN or an OTP this week?', hi: 'क्या इस हफ़्ते किसी ने आधार, पैन की कॉपी या OTP माँगा?' }, options: ['yes', 'no', 'unsure'], risk: ['yes', 'unsure'] },
  { id: 'n_learn', text: { en: 'Did you learn one new thing about money this week?', hi: 'क्या इस हफ़्ते आपने पैसे के बारे में कुछ नया सीखा?' }, options: ['yes', 'no'] },
];

export const rungs = [
  { n: 0, id: 'account', gate: { lessons: 3 }, title: { en: 'Account in your own name, own number', hi: 'अपने नाम का खाता, अपना नंबर' }, help: { en: 'If you have none: go to a bank with your own PAN and a mobile number that is yours. Ask for a basic savings account.', hi: 'अगर नहीं है: अपने पैन और अपने मोबाइल नंबर के साथ बैंक जाइए। बेसिक बचत खाता माँगिए।' } },
  { n: 1, id: 'fd', gate: { lessons: 4, game: 'kirana' }, title: { en: 'Open a small fixed deposit', hi: 'छोटी एफ़डी खोलिए' }, help: { en: 'Minimums vary by bank and card. Ask the branch for the smallest amount that works with a card.', hi: 'न्यूनतम राशि बैंक और कार्ड के हिसाब से बदलती है। शाखा से पूछिए कि कार्ड के लिए सबसे कम कितनी चलेगी।' } },
  { n: 2, id: 'card', gate: { lessons: 5, game: 'trap' }, title: { en: 'Get a card against your deposit', hi: 'अपनी जमा पर कार्ड लीजिए' }, help: { en: 'Your credit file starts here. The limit is a share of the deposit.', hi: 'आपकी क्रेडिट फ़ाइल यहीं से शुरू होती है। सीमा जमा का एक हिस्सा होती है।' } },
  { n: 3, id: 'bill', gate: {}, title: { en: 'Pay one small bill in full', hi: 'एक छोटा बिल पूरा चुकाइए' }, help: { en: 'One phone or electricity bill, paid in full by the due date, every month.', hi: 'एक फ़ोन या बिजली का बिल, हर महीने नियत तारीख तक पूरा।' } },
  { n: 4, id: 'wait', gate: { treeMonths: 6 }, title: { en: 'Wait about six months', hi: 'लगभग छह महीने इंतज़ार' }, help: { en: 'A score needs history. Each on-time month adds a ring to your tree.', hi: 'स्कोर के लिए इतिहास चाहिए। हर समय पर महीना आपके पेड़ में एक छल्ला जोड़ता है।' } },
  { n: 5, id: 'graduate', gate: { safetyCheck: true }, title: { en: 'Check your report and graduate', hi: 'रिपोर्ट देखिए और आगे बढ़िए' }, help: { en: 'Get your free credit report, look for anything unfamiliar, then think about an unsecured card.', hi: 'मुफ़्त क्रेडिट रिपोर्ट लीजिए, कुछ अनजान दिखे तो देखिए, फिर बिना जमा वाले कार्ड के बारे में सोचिए।' } },
];

export const safety = {
  steps: [
    { id: 'aadhaar', url: 'https://myaadhaar.uidai.gov.in', title: { en: 'Where was your Aadhaar used?', hi: 'आपका आधार कहाँ इस्तेमाल हुआ?' },
      how: { en: ['Open the official UIDAI site or the mAadhaar app.', 'Sign in with the OTP on your own number.', 'Open "Authentication History" and read the list.', 'Anything you do not recognise? Tap "unfamiliar".'], hi: ['UIDAI की आधिकारिक साइट या mAadhaar ऐप खोलिए।', 'अपने नंबर पर आए OTP से साइन इन कीजिए।', '"ऑथेंटिकेशन हिस्ट्री" खोलकर सूची पढ़िए।', 'कुछ अनजान दिखे तो "अनजान" दबाइए।'] } },
    { id: 'sims', url: 'https://sancharsaathi.gov.in', title: { en: 'Which SIMs are in your name?', hi: 'आपके नाम पर कौन से सिम हैं?' },
      how: { en: ['Open the official Sanchar Saathi site.', 'Sign in with your mobile number and OTP.', 'Read the list of numbers in your name.', 'A number you do not use? Tap "unfamiliar".'], hi: ['संचार साथी की आधिकारिक साइट खोलिए।', 'अपने मोबाइल नंबर और OTP से साइन इन कीजिए।', 'आपके नाम के नंबरों की सूची पढ़िए।', 'ऐसा नंबर जो आप इस्तेमाल नहीं करतीं? "अनजान" दबाइए।'] } },
    { id: 'report', url: 'https://www.cibil.com', title: { en: 'Read your free credit report', hi: 'अपनी मुफ़्त क्रेडिट रिपोर्ट पढ़िए' },
      how: { en: ['Ask for the free yearly report from a credit bureau.', 'Look at every loan and card listed.', 'A loan or card you never took? Tap "unfamiliar".'], hi: ['क्रेडिट ब्यूरो से साल की मुफ़्त रिपोर्ट माँगिए।', 'हर लोन और कार्ड देखिए।', 'ऐसा लोन या कार्ड जो आपने नहीं लिया? "अनजान" दबाइए।'] } },
  ],
  allFamiliar: { en: 'All familiar. Detective badge earned. Next check in three months.', hi: 'सब जाना-पहचाना। डिटेक्टिव बैज मिला। अगली जाँच तीन महीने बाद।' },
  unfamiliar: {
    en: ['Lock your Aadhaar biometrics on the UIDAI site.', 'Ask the bureau to dispute the item. They must resolve it in 30 days.', 'For help: Women Helpline 181, free legal aid 15100.', 'You do not have to decide alone. An NGO or a trusted person can sit with you.'],
    hi: ['UIDAI साइट पर अपना आधार बायोमेट्रिक लॉक कीजिए।', 'ब्यूरो से उस प्रविष्टि पर आपत्ति दर्ज कराइए। उन्हें 30 दिन में हल करना होता है।', 'मदद के लिए: महिला हेल्पलाइन 181, मुफ़्त कानूनी सहायता 15100।', 'आपको अकेले फ़ैसला नहीं करना है। कोई NGO या भरोसेमंद व्यक्ति साथ बैठ सकता है।'] },
};

export const BADGES = {
  first_step: { en: 'First step', hi: 'पहला कदम' }, trap_spotter: { en: 'Trap spotter', hi: 'जाल पहचानने वाली' },
  basket_boss: { en: 'Basket boss', hi: 'टोकरी की मालकिन' }, detective: { en: 'Document detective', hi: 'डॉक्यूमेंट डिटेक्टिव' },
  rung_0: { en: 'Rung 0', hi: 'सीढ़ी 0' }, rung_1: { en: 'Rung 1', hi: 'सीढ़ी 1' }, rung_2: { en: 'Rung 2', hi: 'सीढ़ी 2' },
  rung_3: { en: 'Rung 3', hi: 'सीढ़ी 3' }, rung_4: { en: 'Rung 4', hi: 'सीढ़ी 4' }, rung_5: { en: 'Rung 5', hi: 'सीढ़ी 5' },
  full_tree: { en: 'Six rings', hi: 'छह छल्ले' }, story_sharp: { en: 'Story sharp', hi: 'समझदार चुनाव' },
};
