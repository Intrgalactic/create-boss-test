import tapeImage from 'src/assets/images/tape.png';
import webpTapeImage from 'src/assets/images/tape.webp';
import microphoneImage from 'src/assets/images/microphone.png';
import webpMicrophoneImage from 'src/assets/images/microphone.webp';
import dotsImage from 'src/assets/images/dots.png';
import webpDotsImage from 'src/assets/images/dots.webp';
import messageImage from 'src/assets/images/message.png';
import webpMessageImage from 'src/assets/images/message.webp';
import autorenewImage from 'src/assets/images/auto-renew.png';
import webpAutorenewImage from 'src/assets/images/auto-renew.webp';
import boughtatImage from 'src/assets/images/bought-at.png';
import webpBoughtatImage from 'src/assets/images/bought-at.webp';
import currentplanImage from 'src/assets/images/current-plan.png';
import webpCurrentPlanImage from 'src/assets/images/current-plan.webp';
import recurringImage from 'src/assets/images/recurring.png';
import webpRecurringImage from 'src/assets/images/recurring.webp';
export const planDetailsData = [
    {
        images: [webpCurrentPlanImage, currentplanImage],
        heading: "Current Plan :",
        description: "Starter",
        imgWidth: "27px",
        imgHeight: "27px",
        alt: "current plan"
    },
    {
        images: [webpRecurringImage, recurringImage],
        heading: "Recurring In :",
        description: "31 Days",
        imgWidth: "25px",
        imgHeight: "27px",
        alt: "recur"
    },
    {
        images: [webpAutorenewImage, autorenewImage],
        heading: "Auto - Renew :",
        description: "Yes",
        imgWidth: "31px",
        imgHeight: "27px",
        alt: "renew"
    },
    {
        images: [boughtatImage, webpBoughtatImage],
        heading: "Bought At :",
        description: "25.07.2023",
        imgWidth: "38px",
        imgHeight: "27px",
        alt: "bought at"
    }
]
export const dashboardActionsData = [
    {
        images: [webpMessageImage,messageImage],
        imgHeight: "22px",
        imgWidth: "22px",
        link: "services/speech-to-text",
        linkDescription: "Speech To Text",
        alt: "message box"
    },
    {
        images: [microphoneImage,webpMicrophoneImage],
        imgHeight: "22px",
        imgWidth: "16px",
        link: "services/text-to-speech",
        linkDescription: "Text To Speech",
        alt: "microphone"
    },
    {
        images: [dotsImage,webpDotsImage],
        imgHeight: "22px",
        imgWidth: "42px",
        link: "services/subtitles-from-video",
        linkDescription: "Subtitles From Video",
        alt: "dots"
    },
    {
        images: [tapeImage,webpTapeImage],
        imgHeight: "22px",
        imgWidth: "22px",
        link: "services/subtitles-to-video",
        linkDescription: "Subtitles To Video",
        alt: "video tape"
    },

]
export const voiceGenderOptions = ["Choose","Male","Female"];
export const voiceAgeOptions = ["Choose","Young","Middle Aged","Old"];
export const voiceAccentOptions = ["Choose","British","American","African","Australian","Indian"];
export const STTOutputExtensionOptions = ["TXT","DOCX","PDF"];
export const trueFalseOptions = ['Yes','No'];
export const STTlanguageData = [
  {
    optgroup: "Danish",
    options: ["Danish (Denmark)"],
    code: ["da"],
  },
  {
    optgroup: "English",
    options: [
      "English",
      "English (Australia)",
      "English (United Kingdom)",
      "English (India)",
      "English (New Zealand)",
      "English (United States)",
    ],
    code: [
      "en",
      "en-AU",
      "en-GB",
      "en-IN",
      "en-NZ",
      "en-US",
    ],
  },
  {
    optgroup: "Spanish",
    options: [
      "Spanish (Latin America and the Caribbean)",
      "Spanish",
    ],
    code: [
      "es-419",
      "es",
    ],
  },
  {
    optgroup: "French",
    options: [
      "French (Canada)",
      "French",
    ],
    code: [
      "fr-CA",
      "fr",
    ],
  },
  {
    optgroup: "Hindi",
    options: ["Hindi", "Hindi (Latin)"],
    code: ["hi", "hi-Latn"],
  },
  {
    optgroup: "Indonesian",
    options: ["Indonesian"],
    code: ["id"],
  },
  {
    optgroup: "Italian",
    options: ["Italian"],
    code: ["it"],
  },
  {
    optgroup: "Japanese",
    options: ["Japanese"],
    code: ["ja"],
  },
  {
    optgroup: "Dutch",
    options: ["Dutch"],
    code: ["nl"],
  },
  {
    optgroup: "Polish",
    options: ["Polish"],
    code: ["pl"],
  },
  {
    optgroup: "Portuguese",
    options: [
      "Portuguese (Brazil)",
      "Portuguese",
      "Portuguese (Portugal)",
    ],
    code: [
      "pt-BR",
      "pt",
      "pt-PT",
    ],
  },
  {
    optgroup: "Russian",
    options: ["Russian"],
    code: ["ru"],
  },
  {
    optgroup: "Swedish",
    options: ["Swedish"],
    code: ["sv"],
  },
  {
    optgroup: "Turkish",
    options: ["Turkish"],
    code: ["tr"],
  },
  {
    optgroup: "Ukrainian",
    options: ["Ukrainian"],
    code: ["uk"],
  },
  {
    optgroup: "Chinese",
    options: ["Chinese (Simplified)", "Chinese (Traditional)"],
    code: ["zh-CN", "zh-TW"],
  },
];
export const languagesData = [
  {
    optgroup: "Afrikaans",
    options: ["Afrikaans (South Africa)"],
    code: ["af-ZA"],
  },
  {
    optgroup: "Arabic",
    options: ["Arabic"],
    code: ["ar"],
  },
  {
    optgroup: "Basque",
    options: ["Basque (Spain)"],
    code: ["eu-ES"],
  },
  {
    optgroup: "Bengali",
    options: ["Bengali (India)"],
    code: ["bn-IN"],
  },
  {
    optgroup: "Bulgarian",
    options: ["Bulgarian (Bulgaria)"],
    code: ["bg-BG"],
  },
  {
    optgroup: "Catalan",
    options: ["Catalan (Spain)"],
    code: ["ca-ES"],
  },
  {
    optgroup: "Chinese",
    options: ["Chinese (Hong Kong)", "Mandarin Chinese"],
    code: ["zh-HK", "zh"],
  },
  {
    optgroup: "Czech",
    options: ["Czech (Czech Republic)"],
    code: ["cs-CZ"],
  },
  {
    optgroup: "Danish",
    options: ["Danish (Denmark)"],
    code: ["da-DK"],
  },
  {
    optgroup: "Dutch",
    options: ["Dutch (Belgium)", "Dutch (Netherlands)"],
    code: ["nl-BE", "nl-NL"],
  },
  {
    optgroup: "English",
    options: ["English (Australia)", "English (India)", "English (UK)", "English (US)"],
    code: ["en-AU", "en-IN", "en-GB", "en-US"],
  },
  {
    optgroup: "Filipino",
    options: ["Filipino (Philippines)"],
    code: ["fil-PH"],
  },
  {
    optgroup: "Finnish",
    options: ["Finnish (Finland)"],
    code: ["fi-FI"],
  },
  {
    optgroup: "French",
    options: ["French (Canada)", "French (France)"],
    code: ["fr-CA", "fr-FR"],
  },
  {
    optgroup: "Galician",
    options: ["Galician (Spain)"],
    code: ["gl-ES"],
  },
  {
    optgroup: "German",
    options: ["German (Germany)"],
    code: ["de-DE"],
  },
  {
    optgroup: "Greek",
    options: ["Greek (Greece)"],
    code: ["el-GR"],
  },
  {
    optgroup: "Gujarati",
    options: ["Gujarati (India)"],
    code: ["gu-IN"],
  },
  {
    optgroup: "Hebrew",
    options: ["Hebrew (Israel)"],
    code: ["he-IL"],
  },
  {
    optgroup: "Hindi",
    options: ["Hindi (India)"],
    code: ["hi-IN"],
  },
  {
    optgroup: "Hungarian",
    options: ["Hungarian (Hungary)"],
    code: ["hu-HU"],
  },
  {
    optgroup: "Icelandic",
    options: ["Icelandic (Iceland)"],
    code: ["is-IS"],
  },
  {
    optgroup: "Indonesian",
    options: ["Indonesian (Indonesia)"],
    code: ["id-ID"],
  },
  {
    optgroup: "Italian",
    options: ["Italian (Italy)"],
    code: ["it-IT"],
  },
  {
    optgroup: "Japanese",
    options: ["Japanese (Japan)"],
    code: ["ja-JP"],
  },
  {
    optgroup: "Kannada",
    options: ["Kannada (India)"],
    code: ["kn-IN"],
  },
  {
    optgroup: "Korean",
    options: ["Korean (South Korea)"],
    code: ["ko-KR"],
  },
  {
    optgroup: "Latvian",
    options: ["Latvian (Latvia)"],
    code: ["lv-LV"],
  },
  {
    optgroup: "Lithuanian",
    options: ["Lithuanian (Lithuania)"],
    code: ["lt-LT"],
  },
  {
    optgroup: "Malay",
    options: ["Malay (Malaysia)"],
    code: ["ms-MY"],
  },
  {
    optgroup: "Malayalam",
    options: ["Malayalam (India)"],
    code: ["ml-IN"],
  },
  {
    optgroup: "Mandarin Chinese",
    options: ["Mandarin Chinese"],
    code: ["zh"],
  },
  {
    optgroup: "Marathi",
    options: ["Marathi (India)"],
    code: ["mr-IN"],
  },
  {
    optgroup: "Norwegian",
    options: ["Norwegian (Norway)"],
    code: ["no-NO"],
  },
  {
    optgroup: "Polish",
    options: ["Polish (Poland)"],
    code: ["pl-PL"],
  },
  {
    optgroup: "Portuguese",
    options: ["Portuguese (Brazil)", "Portuguese (Portugal)"],
    code: ["pt-BR", "pt-PT"],
  },
  {
    optgroup: "Punjabi",
    options: ["Punjabi (India)"],
    code: ["pa-IN"],
  },
  {
    optgroup: "Romanian",
    options: ["Romanian (Romania)"],
    code: ["ro-RO"],
  },
  {
    optgroup: "Russian",
    options: ["Russian (Russia)"],
    code: ["ru-RU"],
  },
  {
    optgroup: "Serbian",
    options: ["Serbian (Serbia)"],
    code: ["sr-RS"],
  },
  {
    optgroup: "Sinhala",
    options: ["Sinhala (Sri Lanka)"],
    code: ["si-LK"],
  },
  {
    optgroup: "Slovak",
    options: ["Slovak (Slovakia)"],
    code: ["sk-SK"],
  },
  {
    optgroup: "Slovenian",
    options: ["Slovenian (Slovenia)"],
    code: ["sl-SI"],
  },
  {
    optgroup: "Spanish",
    options: ["Spanish (Spain)", "Spanish (US)"],
    code: ["es-ES", "es-US"],
  },
  {
    optgroup: "Swahili",
    options: ["Swahili (Kenya)"],
    code: ["sw-KE"],
  },
  {
    optgroup: "Swedish",
    options: ["Swedish (Sweden)"],
    code: ["sv-SE"],
  },
  {
    optgroup: "Tamil",
    options: ["Tamil (India)"],
    code: ["ta-IN"],
  },
  {
    optgroup: "Telugu",
    options: ["Telugu (India)"],
    code: ["te-IN"],
  },
  {
    optgroup: "Thai",
    options: ["Thai (Thailand)"],
    code: ["th-TH"],
  },
  {
    optgroup: "Turkish",
    options: ["Turkish (Turkey)"],
    code: ["tr-TR"],
  },
  {
    optgroup: "Ukrainian",
    options: ["Ukrainian (Ukraine)"],
    code: ["uk-UA"],
  },
  {
    optgroup: "Urdu",
    options: ["Urdu (Pakistan)"],
    code: ["ur-PK"],
  },
  {
    optgroup: "Vietnamese",
    options: ["Vietnamese (Vietnam)"],
    code: ["vi-VN"],
  },
  {
    optgroup: "Welsh",
    options: ["Welsh (UK)"],
    code: ["cy-GB"],
  },
  {
    optgroup: "Zulu",
    options: ["Zulu (South Africa)"],
    code: ["zu-ZA"],
  },
];

export const subtitlesFontOptions = ["Arial","Verdana","Tahoma","Trebuchet MS","Times New Roman"];
export const videoSpeedOptions = ["1X","1.25X","1.5X","1.75X","2X"];
export const detailedAlignmentOptions = ["Bottom Center","Bottom Left","Bottom Right","Center","Center Left","Center Right","Top Center","Top Left","Top Right"];
export const mainAlignmentOptions = ["Bottom","Center","Top"];
export const videoTypeOptions = ["Wide","Narrow","Tiktok"];
export const subtitlesColorOptions = ["White","Black",'Yellow',"Red","Blue","Green"];
export const subBgColorOptions = ["White","Black","Yellow"];
export const subBgOpacityOptions = ['1','0.8','0.5','0.2','0.1'];
export const wordsPerLineOptions = ['Choose','1','2','3','4','5','6','7'];
export const textStrokeOptions = ["1PX","2PX","3PX"];
export const fontSizeOptions = ["48PX","36PX","32PX","24PX","16PX","12PX","8PX"];
export const builtInFontsOptions = ["Nexa Heavy","Helvetica","Roboto","Georgia","Futura","Rockwell"];