const allLanguages = {
  Abkhaz: 'ab',
  Afar: 'aa',
  Afrikaans: 'af',
  Akan: 'ak',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Aragonese: 'an',
  Armenian: 'hy',
  Assamese: 'as',
  Avaric: 'av',
  Avestan: 'ae',
  Aymara: 'ay',
  Azerbaijani: 'az',
  Bambara: 'bm',
  Bashkir: 'ba',
  Basque: 'eu',
  Belarusian: 'be',
  Bengali: 'bn',
  Bihari: 'bh',
  Bislama: 'bi',
  Bosnian: 'bs',
  Breton: 'br',
  Bulgarian: 'bg',
  Burmese: 'my',
  Catalan: 'ca',
  Valencian: 'ca',
  Chamorro: 'ch',
  Chechen: 'ce',
  Chichewa: 'ny',
  Chewa: 'ny',
  Nyanja: 'ny',
  Chinese: 'zh',
  Chuvash: 'cv',
  Cornish: 'kw',
  Corsican: 'co',
  Cree: 'cr',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  Divehi: 'dv',
  Dhivehi: 'dv',
  Maldivian: 'dv',
  Dutch: 'nl',
  English: 'en',
  Esperanto: 'eo',
  Estonian: 'et',
  Ewe: 'ee',
  Faroese: 'fo',
  Fijian: 'fj',
  Finnish: 'fi',
  French: 'fr',
  Fula: 'ff',
  Fulah: 'ff',
  Pulaar: 'ff',
  Pular: 'ff',
  Galician: 'gl',
  Georgian: 'ka',
  German: 'de',
  Greek: 'el',
  Modern: 'el',
  Guaraní: 'gn',
  Gujarati: 'gu',
  Haitian: 'ht',
  Haitian_Creole: 'ht',
  Hausa: 'ha',
  Hebrew: 'he',
  Herero: 'hz',
  Hindi: 'hi',
  Hiri_Motu: 'ho',
  Hungarian: 'hu',
  Interlingua: 'ia',
  Indonesian: 'id',
  Interlingue: 'ie',
  Irish: 'ga',
  Igbo: 'ig',
  Inupiaq: 'ik',
  Ido: 'io',
  Icelandic: 'is',
  Italian: 'it',
  Inuktitut: 'iu',
  Japanese: 'ja',
  Javanese: 'jv',
  Kalaallisut: 'kl',
  Greenlandic: 'kl',
  Kannada: 'kn',
  Kanuri: 'kr',
  Kashmiri: 'ks',
  Kazakh: 'kk',
  Khmer: 'km',
  Kikuyu: 'ki',
  Gikuyu: 'ki',
  Kinyarwanda: 'rw',
  Kirghiz: 'ky',
  Kyrgyz: 'ky',
  Komi: 'kv',
  Kongo: 'kg',
  Korean: 'ko',
  Kurdish: 'ku',
  Kwanyama: 'kj',
  Kuanyama: 'kj',
  Latin: 'la',
  Luxembourgish: 'lb',
  Letzeburgesch: 'lb',
  Luganda: 'lg',
  Limburgish: 'li',
  Limburgan: 'li',
  Limburger: 'li',
  Lingala: 'ln',
  Lao: 'lo',
  Lithuanian: 'lt',
  Luba_Katanga: 'lu',
  Latvian: 'lv',
  Manx: 'gv',
  Macedonian: 'mk',
  Malagasy: 'mg',
  Malay: 'ms',
  Malayalam: 'ml',
  Maltese: 'mt',
  Māori: 'mi',
  Marathi: 'mr',
  Marshallese: 'mh',
  Mongolian: 'mn',
  Nauru: 'na',
  Navajo: 'nv',
  Navaho: 'nv',
  Norwegian_Bokmal: 'nb',
  North_Ndebele: 'nd',
  Nepali: 'ne',
  Ndonga: 'ng',
  Norwegian_Nynorsk: 'nn',
  Norwegian: 'no',
  Nuosu: 'ii',
  South_Ndebele: 'nr',
  Occitan: 'oc',
  Ojibwe: 'oj',
  Ojibwa: 'oj',
  Old_Church_Slavonic: 'cu',
  Church_Slavic: 'cu',
  Church_Slavonic: 'cu',
  Old_Bulgarian: 'cu',
  Old_Slavonic: 'cu',
  Oromo: 'om',
  Oriya: 'or',
  Ossetian: 'os',
  Ossetic: 'os',
  Panjabi: 'pa',
  Punjabi: 'pa',
  Pāli: 'pi',
  Persian: 'fa',
  Polish: 'pl',
  Pashto: 'ps',
  Pushto: 'ps',
  Portuguese: 'pt',
  Quechua: 'qu',
  Romansh: 'rm',
  Kirundi: 'rn',
  Romanian: 'ro',
  Moldavian: 'ro',
  Moldovan: 'ro',
  Russian: 'ru',
  Sanskrit: 'sa',
  Sardinian: 'sc',
  Sindhi: 'sd',
  Northern_Sami: 'se',
  Samoan: 'sm',
  Sango: 'sg',
  Serbian: 'sr',
  Scottish_Gaelic: 'gd',
  Gaelic: 'gd',
  Shona: 'sn',
  Sinhala: 'si',
  Sinhalese: 'si',
  Slovak: 'sk',
  Slovene: 'sl',
  Somali: 'so',
  Southern_Sotho: 'st',
  Spanish: 'es',
  Castilian: 'es',
  Sundanese: 'su',
  Swahili: 'sw',
  Swati: 'ss',
  Swedish: 'sv',
  Tamil: 'ta',
  Telugu: 'te',
  Tajik: 'tg',
  Thai: 'th',
  Tigrinya: 'ti',
  Tibetan_Standard: 'bo',
  Tibetan: 'bo',
  Central: 'bo',
  Turkmen: 'tk',
  Tagalog: 'tl',
  Tswana: 'tn',
  Tonga: 'to',
  Turkish: 'tr',
  Tsonga: 'ts',
  Tatar: 'tt',
  Twi: 'tw',
  Tahitian: 'ty',
  Uighur: 'ug',
  Uyghur: 'ug',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Uzbek: 'uz',
  Venda: 've',
  Vietnamese: 'vi',
  Volapük: 'vo',
  Walloon: 'wa',
  Welsh: 'cy',
  Wolof: 'wo',
  Western_Frisian: 'fy',
  Xhosa: 'xh',
  Yiddish: 'yi',
  Yoruba: 'yo',
  Zhuang: 'za',
  Chuang: 'za',
};

const languages = Object.keys(allLanguages);
const languaguesShort = Object.values(allLanguages);

module.exports = {
  languages,
  languaguesShort,
};
