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
        imgHeight: "27px"
    },
    {
        images: [webpRecurringImage, recurringImage],
        heading: "Recurring In :",
        description: "31 Days",
        imgWidth: "25px",
        imgHeight: "27px"
    },
    {
        images: [webpAutorenewImage, autorenewImage],
        heading: "Auto - Renew :",
        description: "Yes",
        imgWidth: "31px",
        imgHeight: "27px"
    },
    {
        images: [boughtatImage, webpBoughtatImage],
        heading: "Bought At :",
        description: "25.07.2023",
        imgWidth: "38px",
        imgHeight: "27px"
    }
]
export const dashboardActionsData = [
    {
        images: [webpMessageImage,messageImage],
        imgHeight: "22px",
        imgWidth: "22px",
        link: "speech-to-text",
        linkDescription: "Speech To Text"
    },
    {
        images: [microphoneImage,webpMicrophoneImage],
        imgHeight: "22px",
        imgWidth: "16px",
        link: "text-to-speech",
        linkDescription: "Text To Speech"
    },
    {
        images: [dotsImage,webpDotsImage],
        imgHeight: "22px",
        imgWidth: "42px",
        link: "subtitles-from-video",
        linkDescription: "Subtitles From Video"
    },
    {
        images: [tapeImage,webpTapeImage],
        imgHeight: "22px",
        imgWidth: "22px",
        link: "subtitles-to-video",
        linkDescription: "Subtitles To Video"
    },

]
export const audioSpeedOptions = ["1","1.25","1.5","1.75","2" ];
export const voicePitchOptions = ["-20","-15","-10","-5","0","5","10","15","20" ];
export const voiceGenderOptions = ["Male","Female"];
export const languagesData = [
    {
      optgroup: "Afrikaans",
      options: ["Afrikaans (South Africa)"]
    },
    {
      optgroup: "Arabic",
      options: ["Arabic"]
    },
    {
      optgroup: "Basque",
      options: ["Basque (Spain)"]
    },
    {
      optgroup: "Bengali",
      options: ["Bengali (India)"]
    },
    {
      optgroup: "Bulgarian",
      options: ["Bulgarian (Bulgaria)"]
    },
    {
      optgroup: "Catalan",
      options: ["Catalan (Spain)"]
    },
    {
      optgroup: "Chinese",
      options: ["Chinese (Hong Kong)", "Mandarin Chinese"]
    },
    {
      optgroup: "Czech",
      options: ["Czech (Czech Republic)"]
    },
    {
      optgroup: "Danish",
      options: ["Danish (Denmark)"]
    },
    {
      optgroup: "Dutch",
      options: ["Dutch (Belgium)", "Dutch (Netherlands)"]
    },
    {
      optgroup: "English",
      options: ["English (Australia)", "English (India)", "English (UK)", "English (US)"]
    },
    {
      optgroup: "Filipino",
      options: ["Filipino (Philippines)"]
    },
    {
      optgroup: "Finnish",
      options: ["Finnish (Finland)"]
    },
    {
      optgroup: "French",
      options: ["French (Canada)", "French (France)"]
    },
    {
      optgroup: "Galician",
      options: ["Galician (Spain)"]
    },
    {
      optgroup: "German",
      options: ["German (Germany)"]
    },
    {
      optgroup: "Greek",
      options: ["Greek (Greece)"]
    },
    {
      optgroup: "Gujarati",
      options: ["Gujarati (India)"]
    },
    {
      optgroup: "Hebrew",
      options: ["Hebrew (Israel)"]
    },
    {
      optgroup: "Hindi",
      options: ["Hindi (India)"]
    },
    {
      optgroup: "Hungarian",
      options: ["Hungarian (Hungary)"]
    },
    {
      optgroup: "Icelandic",
      options: ["Icelandic (Iceland)"]
    },
    {
      optgroup: "Indonesian",
      options: ["Indonesian (Indonesia)"]
    },
    {
      optgroup: "Italian",
      options: ["Italian (Italy)"]
    },
    {
      optgroup: "Japanese",
      options: ["Japanese (Japan)"]
    },
    {
      optgroup: "Kannada",
      options: ["Kannada (India)"]
    },
    {
      optgroup: "Korean",
      options: ["Korean (South Korea)"]
    },
    {
      optgroup: "Latvian",
      options: ["Latvian (Latvia)"]
    },
    {
      optgroup: "Lithuanian",
      options: ["Lithuanian (Lithuania)"]
    },
    {
      optgroup: "Malay",
      options: ["Malay (Malaysia)"]
    },
    {
      optgroup: "Malayalam",
      options: ["Malayalam (India)"]
    },
    {
      optgroup: "Mandarin Chinese",
      options: ["Mandarin Chinese"]
    },
    {
      optgroup: "Marathi",
      options: ["Marathi (India)"]
    },
    {
      optgroup: "Norwegian",
      options: ["Norwegian (Norway)"]
    },
    {
      optgroup: "Polish",
      options: ["Polish (Poland)"]
    },
    {
      optgroup: "Portuguese",
      options: ["Portuguese (Brazil)", "Portuguese (Portugal)"]
    },
    {
      optgroup: "Punjabi",
      options: ["Punjabi (India)"]
    },
    {
      optgroup: "Romanian",
      options: ["Romanian (Romania)"]
    },
    {
      optgroup: "Russian",
      options: ["Russian (Russia)"]
    },
    {
      optgroup: "Serbian",
      options: ["Serbian (Serbia)"]
    },
    {
      optgroup: "Sinhala",
      options: ["Sinhala (Sri Lanka)"]
    },
    {
      optgroup: "Slovak",
      options: ["Slovak (Slovakia)"]
    },
    {
      optgroup: "Slovenian",
      options: ["Slovenian (Slovenia)"]
    },
    {
      optgroup: "Spanish",
      options: ["Spanish (Spain)", "Spanish (US)"]
    },
    {
      optgroup: "Swahili",
      options: ["Swahili (Kenya)"]
    },
    {
      optgroup: "Swedish",
      options: ["Swedish (Sweden)"]
    },
    {
      optgroup: "Tamil",
      options: ["Tamil (India)"]
    },
    {
      optgroup: "Telugu",
      options: ["Telugu (India)"]
    },
    {
      optgroup: "Thai",
      options: ["Thai (Thailand)"]
    },
    {
      optgroup: "Turkish",
      options: ["Turkish (Turkey)"]
    },
    {
      optgroup: "Ukrainian",
      options: ["Ukrainian (Ukraine)"]
    },
    {
      optgroup: "Urdu",
      options: ["Urdu (Pakistan)"]
    },
    {
      optgroup: "Vietnamese",
      options: ["Vietnamese (Vietnam)"]
    },
    {
      optgroup: "Welsh",
      options: ["Welsh (UK)"]
    },
    {
      optgroup: "Zulu",
      options: ["Zulu (South Africa)"]
    },
  ];