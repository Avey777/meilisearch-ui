import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { useAppStore } from "@/store";

export const SUPPORTED_LANGUAGES = ["en", "zh"] as const;
export type SUPPORTED_LANGUAGE = (typeof SUPPORTED_LANGUAGES)[number];
export enum SUPPORTED_LANGUAGE_LOCALIZED {
	en = "EN",
	zh = "中文",
}
export const NAMESPACES = [
	"common",
	"dashboard",
	"task",
	"key",
	"upload",
	"document",
	"index",
	"instance",
	"header",
	"sys",
] as const;

// Customize the language detector to prioritize reading from the store
const storeLanguageDetector = {
	name: "store",
	lookup() {
		return useAppStore.getState().language;
	},
	cacheUserLanguage(lng: string) {
		useAppStore.getState().setLanguage(lng as SUPPORTED_LANGUAGE);
	},
};
const languageDetector = new LanguageDetector();
languageDetector.addDetector(storeLanguageDetector);

i18n
	// .use(Backend)
	.use(
		resourcesToBackend(
			(language: string, namespace: string) =>
				import(`../locales/${language}/${namespace}.json`),
		),
	)
	.use(languageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		fallbackLng: SUPPORTED_LANGUAGES[0],
		ns: NAMESPACES,
		fallbackNS: NAMESPACES[0],
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
		detection: {
			// order and from where user language should be detected
			order: ["store", "querystring", "navigator", "htmlTag"],

			// keys or params to lookup language from
			lookupQuerystring: "lang",

			// cache user language on
			caches: ["localStorage", "cookie"],

			// optional htmlTag with lang attribute, the default is:
			htmlTag: document.documentElement,

			// only look up languages rather than locales. default english
			convertDetectedLanguage: (lng) => /^(\w+)/.exec(lng)![0] || "en",
		},
	});
export default i18n;

import semi_en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import semi_zh_CN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";

export const lang2SemiLocale = (lang?: SUPPORTED_LANGUAGE) => {
	switch (lang) {
		case "zh":
			return semi_zh_CN;
		default:
			return semi_en_US;
	}
};

import arco_en_US from "@arco-design/web-react/es/locale/en-US";
import arco_zh_CN from "@arco-design/web-react/es/locale/zh-CN";

export const lang2ArcoLocale = (lang?: SUPPORTED_LANGUAGE) => {
	switch (lang) {
		case "zh":
			return arco_zh_CN;
		default:
			return arco_en_US;
	}
};

export const locale2DayjsLocale = (lang?: SUPPORTED_LANGUAGE) => {
	switch (lang) {
		case "zh":
			return "zh-CN";
		default:
			return "en";
	}
};
