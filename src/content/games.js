// Game content. Scoring is done on the SERVER from this data, never from client-sent scores.
export const kirana = {
  id: 'kirana', budget: 1000, needsRequired: true,
  items: [
    { id: 'atta', price: 320, need: true, name: { en: 'Atta 10 kg', hi: 'आटा 10 किलो' } },
    { id: 'oil', price: 180, need: true, name: { en: 'Cooking oil 1 L', hi: 'तेल 1 लीटर' } },
    { id: 'dal', price: 140, need: true, name: { en: 'Dal 1 kg', hi: 'दाल 1 किलो' } },
    { id: 'books', price: 220, need: true, name: { en: 'School notebooks', hi: 'स्कूल की कॉपियाँ' } },
    { id: 'chips', price: 120, need: false, name: { en: 'Chips and sweets', hi: 'चिप्स और मिठाई' } },
    { id: 'speaker', price: 450, need: false, name: { en: 'New speaker', hi: 'नया स्पीकर' } },
    { id: 'toy', price: 260, need: false, name: { en: 'Toy car', hi: 'खिलौना गाड़ी' } },
    { id: 'pot', price: 100, need: false, saving: true, name: { en: 'Put in my pot', hi: 'मेरी गुल्लक में' } },
  ],
  intro: { en: 'You have ₹1,000 for the week. Fill the basket. Needs first, and leave something for your pot.', hi: 'इस हफ़्ते के लिए आपके पास ₹1,000 हैं। टोकरी भरिए। पहले ज़रूरतें, और गुल्लक के लिए भी कुछ बचाइए।' },
  takeaway: { en: 'Needs first, then a small saving, then wants.', hi: 'पहले ज़रूरतें, फिर थोड़ी बचत, फिर चाहतें।' },
};

export const trap = {
  id: 'trap',
  offers: [
    { id: 't1', trap: false, text: { en: 'Bank card against your own fixed deposit. Limit is a share of the deposit.', hi: 'आपकी अपनी एफ़डी पर बैंक कार्ड। सीमा जमा का एक हिस्सा।' }, clue: { en: 'Backed by your own money, from a bank.', hi: 'आपके अपने पैसे से जुड़ा, बैंक से।' } },
    { id: 't2', trap: true, text: { en: 'Instant ₹10,000 in 2 minutes. Allow the app to read your contacts and photos.', hi: '2 मिनट में ₹10,000। ऐप को अपने कॉन्टैक्ट और फ़ोटो देखने दें।' }, clue: { en: 'Asking for contacts and photos is a red flag.', hi: 'कॉन्टैक्ट और फ़ोटो माँगना खतरे का संकेत है।' } },
    { id: 't3', trap: true, text: { en: 'Pay ₹500 "processing fee" first, then get your loan today.', hi: 'पहले ₹500 "प्रोसेसिंग फ़ीस" दीजिए, फिर आज ही कर्ज़ मिलेगा।' }, clue: { en: 'Real lenders do not ask you to pay before you get the loan.', hi: 'असली कर्ज़दाता कर्ज़ से पहले पैसा नहीं माँगते।' } },
    { id: 't4', trap: false, text: { en: 'Your bank offers a small recurring deposit. You can see all charges before you say yes.', hi: 'आपका बैंक छोटी आवर्ती जमा देता है। हाँ कहने से पहले सारे शुल्क दिखते हैं।' }, clue: { en: 'Clear charges and your own bank.', hi: 'साफ़ शुल्क और आपका अपना बैंक।' } },
    { id: 't5', trap: true, text: { en: 'A stranger calls: "Share the OTP and your card limit doubles."', hi: 'अजनबी का फ़ोन: "OTP बताइए, कार्ड की सीमा दोगुनी हो जाएगी।"' }, clue: { en: 'Nobody real ever needs your OTP.', hi: 'किसी असली को आपका OTP कभी नहीं चाहिए।' } },
    { id: 't6', trap: true, text: { en: 'Loan app: 40% interest for 7 days. The lender is not named anywhere.', hi: 'लोन ऐप: 7 दिन के लिए 40% ब्याज। कर्ज़दाता का नाम कहीं नहीं।' }, clue: { en: 'Very high interest and no named lender.', hi: 'बहुत ज़्यादा ब्याज और कर्ज़दाता का नाम नहीं।' } },
    { id: 't7', trap: false, text: { en: 'A lender listed in the RBI digital lending app directory, with a written statement of all charges.', hi: 'RBI की डिजिटल लेंडिंग ऐप सूची में दर्ज कर्ज़दाता, सारे शुल्क लिखित में।' }, clue: { en: 'Listed with the regulator and all charges in writing.', hi: 'नियामक की सूची में और सारे शुल्क लिखित में।' } },
    { id: 't8', trap: true, text: { en: 'Relative: "Give me a copy of your Aadhaar, I will get a SIM and a loan, you will not have to do anything."', hi: 'रिश्तेदार: "आधार की कॉपी दे दो, मैं सिम और लोन ले लूँगा, तुम्हें कुछ नहीं करना।"' }, clue: { en: 'Your papers should never be used without you.', hi: 'आपके कागज़ आपके बिना कभी इस्तेमाल नहीं होने चाहिए।' } },
  ],
  takeaway: { en: 'Safe offers come from a named bank or regulated lender, show every charge, and never ask for OTPs, contacts or fees up front.', hi: 'सुरक्षित ऑफ़र नाम वाले बैंक या नियमित कर्ज़दाता से आते हैं, हर शुल्क दिखाते हैं, और OTP, कॉन्टैक्ट या पहले फ़ीस नहीं माँगते।' },
};

// Story Choices: short branching scenes. Each choice has a consequence and a score (1 = safe).
export const stories = [
  { id: 's1', scene: { en: 'Your cousin says: "Give me your Aadhaar copy for a SIM, I will bring it back tomorrow."', hi: 'चचेरा भाई कहता है: "सिम के लिए आधार की कॉपी दे दो, कल लौटा दूँगा।"' },
    choices: [
      { id: 'a', safe: false, text: { en: 'Give it, he is family', hi: 'दे देती हूँ, घर का है' }, result: { en: 'A copy can be used again and again. SIMs and loans can be opened in your name without you knowing.', hi: 'कॉपी बार-बार इस्तेमाल हो सकती है। आपके नाम पर सिम और लोन बिना बताए खुल सकते हैं।' } },
      { id: 'b', safe: true, text: { en: 'Say: "I will come to the shop with you"', hi: 'कहती हूँ: "मैं तुम्हारे साथ दुकान चलती हूँ"' }, result: { en: 'Good. Your papers stay with you and nothing happens in your name without you.', hi: 'बढ़िया। कागज़ आपके पास रहते हैं और आपके नाम पर आपके बिना कुछ नहीं होता।' } } ] },
  { id: 's2', scene: { en: 'A call: "Madam, your card is blocked. Tell me the OTP you just got to unblock it."', hi: 'फ़ोन: "मैडम, आपका कार्ड ब्लॉक हो गया है। अभी आया OTP बताइए, ठीक कर देंगे।"' },
    choices: [
      { id: 'a', safe: false, text: { en: 'Tell the OTP quickly', hi: 'जल्दी से OTP बता देती हूँ' }, result: { en: 'The OTP is the key to your money. Telling it lets them in.', hi: 'OTP आपके पैसे की चाबी है। बताने से वे अंदर आ जाते हैं।' } },
      { id: 'b', safe: true, text: { en: 'Hang up and call the number on the back of your card', hi: 'फ़ोन काटकर कार्ड के पीछे वाले नंबर पर खुद फ़ोन करती हूँ' }, result: { en: 'Right. Banks never ask for an OTP on a call.', hi: 'सही। बैंक फ़ोन पर OTP कभी नहीं माँगते।' } } ] },
];

export const ALL_GAMES = { kirana, trap, story: { id: 'story', stories } };
