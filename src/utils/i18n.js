export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "locale";
export const SUPPORTED_LOCALES = ["en", "hi"];

const dictionaries = {
  en: {
    common: {
      back: "Back",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      settings: "Settings",
      loading: "Loading",
      retry: "Retry",
      delete: "Delete",
      loadingModels: "Loading models...",
      saveKeyToEnableModels: "Save an API key to enable models",
      unauthorized: "Unauthorized.",
      genericError: "Something went wrong.",
      goHome: "Go home",
    },
    home: {
      title: "Welcome to LexiconAI",
      description:
        "Select a chat from the sidebar or start a new conversation to get started. LexiconAI helps you explore ideas, refactor code, and ship faster with an elegant, distraction-free interface.",
      startChat: "Start a new chat",
      signIn: "Sign in to start chatting",
      customizeSettings: "Customize settings",
    },
    chat: {
      yourWorkspace: "Your AI workspace",
      newChat: "New Chat",
      history: "History",
      loadingChats: "Loading chats...",
      loadChatsError: "Unable to load chats.",
      noChats: "No chats yet. Start a new one.",
      untitledChat: "Untitled chat",
      chatNotFound: "Chat not found.",
      freePlan: "Free plan",
      loadingMessages: "Loading messages...",
      firstConversationTitle: "Start your first conversation",
      firstConversationDescription:
        "Ask anything — brainstorm ideas, refactor code, or get answers fast.",
      selectModel: "Select a model after saving an API key.",
      loadMessagesError: "Unable to load messages.",
      sendMessageError: "Unable to send message.",
      askAnything: "Ask {model} anything...",
      selectModelPlaceholder: "Select a model to get started...",
      send: "Send",
      sending: "Sending...",
    },
    auth: {
      signIn: "Sign In",
      signOut: "Sign Out",
      signUp: "Sign Up",
      welcomeBack: "Welcome back — sign in to continue.",
      createAccount: "Create your account in seconds.",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      passwordPlaceholder: "Enter your password",
      createPasswordPlaceholder: "Create a password",
      confirmPasswordPlaceholder: "Confirm your password",
      signingIn: "Signing in...",
      creatingAccount: "Creating account...",
      createAccountButton: "Create account",
      continueWithGithub: "Continue with GitHub",
      continueWithGoogle: "Continue with Google",
      oauthSignInHelp:
        "OAuth sign-in keeps your account secure. Use email & password too.",
      oauthSignUpHelp:
        "OAuth sign-up is instant if you prefer Google or GitHub.",
      noAccount: "Don’t have an account?",
      hasAccount: "Already have an account?",
      invalidCredentials: "Invalid email or password.",
      oauthLinked:
        "This email is already linked to a different sign-in method.",
      accessDenied:
        "Access was denied. Try again or use another sign-in method.",
      authConfiguration:
        "Authentication is not configured correctly for this environment.",
      databaseMissing:
        "Database is not configured. Set MONGODB_URI in .env.local.",
      databaseBlocked:
        "Database connection failed. MongoDB Atlas is blocking this machine. Add your current IP to the Atlas IP access list or update MONGODB_URI.",
      signInUnavailable: "Unable to sign in right now.",
      accountExists: "An account already exists for this email.",
      registerMissingFields:
        "Email, password, and confirmation are required.",
      registerPasswordLength: "Password must be at least 8 characters.",
      registerPasswordsMismatch: "Passwords do not match.",
      createAccountError: "Failed to create account.",
    },
    settings: {
      title: "Settings",
      subtitle: "Personalize LexiconAI",
      general: "General",
      generalDescription: "Customize the way LexiconAI looks and behaves.",
      models: "Models",
      account: "Account",
      modelsTitle: "AI Model Configuration",
      modelsDescription:
        "Choose your default model and tune generation behavior.",
      defaultModel: "Default model",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      language: "Language",
      english: "English",
      hindi: "Hindi",
      provider: "Provider",
      apiKey: "API key",
      apiKeyPlaceholder: "Enter your API key",
      checkingSavedKeys: "Checking saved keys...",
      noSavedKey: "No saved key for this provider yet.",
      saveApiKey: "Save API key",
      saving: "Saving...",
      encryptedHint:
        "Your key is encrypted before it is stored. Keys are never shown again.",
      savedKeys: "Saved keys",
      noKeySaved: "No key saved",
      accountDescription:
        "Manage your profile, security, and personal data.",
      guest: "Guest",
      signInToViewAccount: "Sign in to view your account",
      freePlan: "Free Plan",
      messagesSent: "Messages sent",
      conversations: "Conversations",
      changePassword: "Change Password",
      exportData: "Export Data",
      deleteAccount: "Delete Account",
      exportReady: "Export ready. Downloading now.",
      accountDeleted: "Account data deleted. Signing you out...",
      deleteConfirm:
        "Delete all your chats and messages? This cannot be undone.",
      passwordManagedByProvider:
        "Password changes are managed by your OAuth provider. Please update it in GitHub.",
      loadUsageError: "Unable to load usage.",
      updatePasswordError: "Unable to update password.",
      exportDataError: "Unable to export data.",
      deleteAccountError: "Unable to delete account data.",
      apiKeyRequired: "Please enter an API key.",
      signInToSaveKeys: "Please sign in to save API keys securely.",
      loadKeysError: "Unable to load keys.",
      loadKeyStatusError: "Unable to load key status.",
      saveApiKeyError: "Unable to save API key.",
      deleteApiKeyError: "Unable to delete API key.",
      providerRequired: "Provider is required.",
      providerAndKeyRequired: "Provider and API key are required.",
      unsupportedProvider: "Unsupported provider.",
      validateKeyError: "Unable to validate API key right now.",
      apiKeySaved: "API key saved.",
      apiKeyRemoved: "API key removed.",
      noProviderKey: "No API key found for provider.",
      savedKeyEnding: "Saved {provider} key ending in {lastFour}.",
      removedProviderKey: "{provider} key removed.",
      savedKeyMasked: "Saved ••••{lastFour}",
      noProviderApiKeySaved: "No {provider} API key saved.",
      failedProcessRequest: "Failed to process request.",
      failedExportData: "Failed to export data.",
      failedDeleteAccountData: "Failed to delete account data.",
    },
    states: {
      somethingWentWrong: "Something went wrong",
      unexpectedError:
        "An unexpected error occurred. Try again — and if it keeps happening, refresh the page.",
      loadingDescription: "Getting things ready for you…",
      pageNotFound: "Page not found",
      pageNotFoundDescription:
        "The page you're looking for doesn't exist anymore or may have been moved.",
    },
  },
  hi: {
    common: {
      back: "वापस",
      cancel: "रद्द करें",
      saveChanges: "बदलाव सहेजें",
      settings: "सेटिंग्स",
      loading: "लोड हो रहा है",
      retry: "फिर से कोशिश करें",
      delete: "हटाएँ",
      loadingModels: "मॉडल लोड हो रहे हैं...",
      saveKeyToEnableModels: "मॉडल चालू करने के लिए API key सहेजें",
      unauthorized: "अनधिकृत।",
      genericError: "कुछ गलत हो गया।",
      goHome: "होम पर जाएँ",
    },
    home: {
      title: "LexiconAI में आपका स्वागत है",
      description:
        "शुरू करने के लिए साइडबार से कोई चैट चुनें या नई बातचीत शुरू करें। LexiconAI आपको विचार खोजने, कोड रिफैक्टर करने और साफ-सुथरे इंटरफ़ेस के साथ तेजी से काम पूरा करने में मदद करता है।",
      startChat: "नई चैट शुरू करें",
      signIn: "चैट शुरू करने के लिए साइन इन करें",
      customizeSettings: "सेटिंग्स अनुकूलित करें",
    },
    chat: {
      yourWorkspace: "आपका AI कार्यक्षेत्र",
      newChat: "नई चैट",
      history: "इतिहास",
      loadingChats: "चैट लोड हो रही हैं...",
      loadChatsError: "चैट लोड नहीं हो सकीं।",
      noChats: "अभी कोई चैट नहीं है। नई शुरू करें।",
      untitledChat: "बिना शीर्षक की चैट",
      chatNotFound: "चैट नहीं मिली।",
      freePlan: "फ्री प्लान",
      loadingMessages: "संदेश लोड हो रहे हैं...",
      firstConversationTitle: "अपनी पहली बातचीत शुरू करें",
      firstConversationDescription:
        "कुछ भी पूछें — विचार बनाएं, कोड रिफैक्टर करें, या जल्दी जवाब पाएँ।",
      selectModel: "API key सहेजने के बाद मॉडल चुनें।",
      loadMessagesError: "संदेश लोड नहीं हो सके।",
      sendMessageError: "संदेश भेजा नहीं जा सका।",
      askAnything: "{model} से कुछ भी पूछें...",
      selectModelPlaceholder: "शुरू करने के लिए मॉडल चुनें...",
      send: "भेजें",
      sending: "भेजा जा रहा है...",
    },
    auth: {
      signIn: "साइन इन",
      signOut: "साइन आउट",
      signUp: "साइन अप",
      welcomeBack: "फिर से स्वागत है — जारी रखने के लिए साइन इन करें।",
      createAccount: "कुछ ही सेकंड में अपना खाता बनाएँ।",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      createPasswordPlaceholder: "पासवर्ड बनाएँ",
      confirmPasswordPlaceholder: "अपना पासवर्ड फिर से दर्ज करें",
      signingIn: "साइन इन किया जा रहा है...",
      creatingAccount: "खाता बनाया जा रहा है...",
      createAccountButton: "खाता बनाएँ",
      continueWithGithub: "GitHub के साथ जारी रखें",
      continueWithGoogle: "Google के साथ जारी रखें",
      oauthSignInHelp:
        "OAuth साइन-इन आपके खाते को सुरक्षित रखता है। आप ईमेल और पासवर्ड भी उपयोग कर सकते हैं।",
      oauthSignUpHelp:
        "यदि आप Google या GitHub पसंद करते हैं, तो OAuth साइन-अप तुरंत हो जाता है।",
      noAccount: "क्या आपका खाता नहीं है?",
      hasAccount: "क्या आपके पास पहले से खाता है?",
      invalidCredentials: "ईमेल या पासवर्ड गलत है।",
      oauthLinked:
        "यह ईमेल पहले से किसी दूसरे साइन-इन तरीके से जुड़ा है।",
      accessDenied:
        "प्रवेश अस्वीकृत किया गया। फिर से कोशिश करें या दूसरा साइन-इन तरीका अपनाएँ।",
      authConfiguration:
        "इस वातावरण के लिए ऑथेंटिकेशन सही तरीके से कॉन्फ़िगर नहीं है।",
      databaseMissing:
        "डेटाबेस कॉन्फ़िगर नहीं है। .env.local में MONGODB_URI सेट करें।",
      databaseBlocked:
        "डेटाबेस कनेक्शन विफल हो गया। MongoDB Atlas इस मशीन को ब्लॉक कर रहा है। अपना मौजूदा IP Atlas access list में जोड़ें या MONGODB_URI अपडेट करें।",
      signInUnavailable: "अभी साइन इन नहीं हो पा रहा है।",
      accountExists: "इस ईमेल के लिए पहले से एक खाता मौजूद है।",
      registerMissingFields:
        "ईमेल, पासवर्ड और पुष्टि आवश्यक हैं।",
      registerPasswordLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
      registerPasswordsMismatch: "पासवर्ड मेल नहीं खाते।",
      createAccountError: "खाता नहीं बनाया जा सका।",
    },
    settings: {
      title: "सेटिंग्स",
      subtitle: "LexiconAI को अपनी पसंद के अनुसार बनाएं",
      general: "सामान्य",
      generalDescription:
        "LexiconAI का रूप और व्यवहार अपनी पसंद के अनुसार बदलें।",
      models: "मॉडल",
      account: "खाता",
      modelsTitle: "AI मॉडल कॉन्फ़िगरेशन",
      modelsDescription:
        "अपना डिफ़ॉल्ट मॉडल चुनें और जनरेशन व्यवहार समायोजित करें।",
      defaultModel: "डिफ़ॉल्ट मॉडल",
      theme: "थीम",
      light: "लाइट",
      dark: "डार्क",
      system: "सिस्टम",
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिन्दी",
      provider: "प्रदाता",
      apiKey: "API key",
      apiKeyPlaceholder: "अपनी API key दर्ज करें",
      checkingSavedKeys: "सहेजी गई keys जाँची जा रही हैं...",
      noSavedKey: "इस प्रदाता के लिए अभी कोई key सहेजी नहीं गई है।",
      saveApiKey: "API key सहेजें",
      saving: "सहेजा जा रहा है...",
      encryptedHint:
        "आपकी key सहेजने से पहले एन्क्रिप्ट की जाती है। Keys दोबारा नहीं दिखाई जातीं।",
      savedKeys: "सहेजी गई keys",
      noKeySaved: "कोई key सहेजी नहीं गई",
      accountDescription:
        "अपनी प्रोफ़ाइल, सुरक्षा और व्यक्तिगत डेटा प्रबंधित करें।",
      guest: "अतिथि",
      signInToViewAccount: "अपना खाता देखने के लिए साइन इन करें",
      freePlan: "फ्री प्लान",
      messagesSent: "भेजे गए संदेश",
      conversations: "बातचीत",
      changePassword: "पासवर्ड बदलें",
      exportData: "डेटा एक्सपोर्ट करें",
      deleteAccount: "खाता हटाएँ",
      exportReady: "एक्सपोर्ट तैयार है। डाउनलोड शुरू हो रहा है।",
      accountDeleted: "खाते का डेटा हटा दिया गया है। आपको साइन आउट किया जा रहा है...",
      deleteConfirm:
        "अपनी सभी चैट और संदेश हटाना चाहते हैं? इसे वापस नहीं किया जा सकता।",
      passwordManagedByProvider:
        "पासवर्ड परिवर्तन आपके OAuth प्रदाता द्वारा नियंत्रित होते हैं। कृपया इसे GitHub में अपडेट करें।",
      loadUsageError: "उपयोग जानकारी लोड नहीं हो सकी।",
      updatePasswordError: "पासवर्ड अपडेट नहीं हो सका।",
      exportDataError: "डेटा एक्सपोर्ट नहीं हो सका।",
      deleteAccountError: "खाते का डेटा हटाया नहीं जा सका।",
      apiKeyRequired: "कृपया API key दर्ज करें।",
      signInToSaveKeys: "API keys सुरक्षित रूप से सहेजने के लिए साइन इन करें।",
      loadKeysError: "Keys लोड नहीं हो सकीं।",
      loadKeyStatusError: "Key स्थिति लोड नहीं हो सकी।",
      saveApiKeyError: "API key सहेजी नहीं जा सकी।",
      deleteApiKeyError: "API key हटाई नहीं जा सकी।",
      providerRequired: "प्रदाता आवश्यक है।",
      providerAndKeyRequired: "प्रदाता और API key आवश्यक हैं।",
      unsupportedProvider: "असमर्थित प्रदाता।",
      validateKeyError: "अभी API key सत्यापित नहीं की जा सकी।",
      apiKeySaved: "API key सहेजी गई।",
      apiKeyRemoved: "API key हटाई गई।",
      noProviderKey: "इस प्रदाता के लिए कोई API key नहीं मिली।",
      savedKeyEnding: "{provider} key अंत {lastFour} के साथ सहेजी गई है।",
      removedProviderKey: "{provider} key हटा दी गई।",
      savedKeyMasked: "सहेजी गई ••••{lastFour}",
      noProviderApiKeySaved: "{provider} के लिए कोई API key सहेजी नहीं गई है।",
      failedProcessRequest: "अनुरोध पूरा नहीं हो सका।",
      failedExportData: "डेटा एक्सपोर्ट नहीं हो सका।",
      failedDeleteAccountData: "खाते का डेटा हटाया नहीं जा सका।",
    },
    states: {
      somethingWentWrong: "कुछ गलत हो गया",
      unexpectedError:
        "एक अप्रत्याशित त्रुटि हुई। फिर से कोशिश करें, और अगर यह बार-बार हो तो पेज रिफ्रेश करें।",
      loadingDescription: "आपके लिए सब कुछ तैयार किया जा रहा है…",
      pageNotFound: "पेज नहीं मिला",
      pageNotFoundDescription:
        "आप जो पेज ढूँढ रहे हैं वह अब मौजूद नहीं है या उसे कहीं और ले जाया गया है।",
    },
  },
};

const directMessageKeys = {
  "Unauthorized.": "common.unauthorized",
  "Unable to sign in right now.": "auth.signInUnavailable",
  "Invalid email or password.": "auth.invalidCredentials",
  "This email is already linked to a different sign-in method.": "auth.oauthLinked",
  "Access was denied. Try again or use another sign-in method.": "auth.accessDenied",
  "Authentication is not configured correctly for this environment.": "auth.authConfiguration",
  "Database is not configured. Set MONGODB_URI in .env.local.": "auth.databaseMissing",
  "Database connection failed. MongoDB Atlas is blocking this machine. Add your current IP to the Atlas IP access list or update MONGODB_URI.": "auth.databaseBlocked",
  "Email, password, and confirmation are required.": "auth.registerMissingFields",
  "Password must be at least 8 characters.": "auth.registerPasswordLength",
  "Passwords do not match.": "auth.registerPasswordsMismatch",
  "An account already exists for this email.": "auth.accountExists",
  "Failed to create account.": "auth.createAccountError",
  "Unable to create account.": "auth.createAccountError",
  "Unable to load chats.": "chat.loadChatsError",
  "Chat not found.": "chat.chatNotFound",
  "Unable to load messages.": "chat.loadMessagesError",
  "Unable to send message.": "chat.sendMessageError",
  "Select a model after saving an API key.": "chat.selectModel",
  "Provider and API key are required.": "settings.providerAndKeyRequired",
  "Unsupported provider.": "settings.unsupportedProvider",
  "Unable to validate API key right now.": "settings.validateKeyError",
  "API key saved.": "settings.apiKeySaved",
  "Failed to save API key.": "settings.saveApiKeyError",
  "Provider is required.": "settings.providerRequired",
  "No API key found for provider.": "settings.noProviderKey",
  "API key removed.": "settings.apiKeyRemoved",
  "Failed to delete API key.": "settings.deleteApiKeyError",
  "Unable to load keys.": "settings.loadKeysError",
  "Unable to load key status.": "settings.loadKeyStatusError",
  "Please enter an API key.": "settings.apiKeyRequired",
  "Please sign in to save API keys securely.": "settings.signInToSaveKeys",
  "Password changes are managed by your OAuth provider. Please update it in GitHub.": "settings.passwordManagedByProvider",
  "Unable to load usage.": "settings.loadUsageError",
  "Unable to update password.": "settings.updatePasswordError",
  "Unable to export data.": "settings.exportDataError",
  "Unable to delete account data.": "settings.deleteAccountError",
  "Failed to process request.": "settings.failedProcessRequest",
  "Failed to export data.": "settings.failedExportData",
  "Failed to delete account data.": "settings.failedDeleteAccountData",
};

function resolveDictionary(locale) {
  return dictionaries[normalizeLocale(locale)];
}

function resolveKey(dictionary, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], dictionary);
}

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function getStoredLocale() {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
}

export function translate(locale, key, variables = {}) {
  const dictionary = resolveDictionary(locale);
  const fallbackDictionary = resolveDictionary(DEFAULT_LOCALE);
  const template = resolveKey(dictionary, key) ?? resolveKey(fallbackDictionary, key) ?? key;

  return template.replace(/\{(\w+)\}/g, (_, token) => String(variables[token] ?? `{${token}}`));
}

export function localizeMessage(message, locale = DEFAULT_LOCALE) {
  if (!message) {
    return translate(locale, "common.genericError");
  }

  const directKey = directMessageKeys[message];

  if (directKey) {
    return translate(locale, directKey);
  }

  const savedKeyMatch = message.match(/^Saved (.+) key ending in (.+)\.$/);
  if (savedKeyMatch) {
    return translate(locale, "settings.savedKeyEnding", {
      provider: savedKeyMatch[1],
      lastFour: savedKeyMatch[2],
    });
  }

  const removedKeyMatch = message.match(/^(.+) key removed\.$/);
  if (removedKeyMatch) {
    return translate(locale, "settings.removedProviderKey", {
      provider: removedKeyMatch[1],
    });
  }

  const savedMaskedMatch = message.match(/^Saved ••••(.+)$/);
  if (savedMaskedMatch) {
    return translate(locale, "settings.savedKeyMasked", {
      lastFour: savedMaskedMatch[1],
    });
  }

  const noProviderKeyMatch = message.match(/^No (.+) API key saved\.$/);
  if (noProviderKeyMatch) {
    return translate(locale, "settings.noProviderApiKeySaved", {
      provider: noProviderKeyMatch[1],
    });
  }

  return message;
}