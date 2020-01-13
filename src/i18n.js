import Vue from "vue"
import VueI18n from "vue-i18n"
import getBrowserLocale from "@/util/i18n/get-browser-locale"
import { supportedLocalesInclude } from "./util/i18n/supported-locales"
import {
  getChoiceIndex,
  setDefaultChoiceIndexGet
} from "./util/i18n/choice-index-for-plural"
import dateTimeFormats from "@/locales/date-time-formats"
import numberFormats from "@/locales/number-formats"

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true })

  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale
  } else {
    return process.env.VUE_APP_I18N_LOCALE || "en"
  }
}

setDefaultChoiceIndexGet(VueI18n.prototype.getChoiceIndex)

VueI18n.prototype.getChoiceIndex = getChoiceIndex

export default new VueI18n({
  locale: getStartingLocale(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),
  dateTimeFormats,
  numberFormats
})
