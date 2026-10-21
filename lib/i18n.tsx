"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "uz", label: "UZ", name: "O'zbekcha" },
  { code: "ru", label: "RU", name: "Русский" },
] as const;
export type Lang = (typeof LANGS)[number]["code"];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.profile": "Profile", "auth.err.current": "Current password is wrong.",
  "profile.title": "My profile", "profile.notSigned": "Sign in to see your profile.", "profile.viaGoogle": "Signed in with Google",
  "profile.viaEmail": "Email account", "profile.since": "Member since", "profile.details": "Personal details",
  "profile.save": "Save changes", "profile.saved": "Saved ✓", "profile.emailNote": "Email can't be changed.",
  "profile.password": "Change password", "profile.current": "Current password", "profile.new": "New password",
  "profile.googlePw": "Your password is managed by your Google account.", "profile.pwChanged": "Password changed ✓",
  "profile.favorite": "Favourite drink", "profile.favoriteText": "Pick one — then add it to your cart in one tap.",
  "profile.prefs": "Preferences", "profile.cartItems": "{n} item(s) in your cart", "profile.openCart": "Open cart",
  "auth.googleCancelled": "Google sign-in was cancelled.", "auth.googleFailed": "Google sign-in failed — please try again.",
  "auth.successTitle": "Welcome, {name}!", "auth.successCreated": "Your account is ready.", "auth.successSignedIn": "You're signed in.", "auth.enter": "Go to the site →",
  "nav.home": "Home", "nav.menu": "Menu", "nav.about": "About", "nav.contact": "Contact",
  "nav.search": "Search", "nav.cart": "Cart", "nav.account": "Account", "nav.language": "Language",
  "nav.openMenu": "Open menu", "nav.closeMenu": "Close menu",
  "acc.signedIn": "Signed in as", "acc.signOut": "Sign out", "acc.signedOut": "You're signed out",

  "search.placeholder": "Search drinks, add-ons, pages…", "search.drinks": "Drinks", "search.extras": "Add-ons",
  "search.pages": "Pages", "search.empty": "Nothing found for", "search.add": "Add", "search.hint": "Esc to close", "search.close": "Close",

  "cart.title": "Your cart", "cart.empty": "Your cart is empty — go pick a coffero.", "cart.total": "Total",
  "cart.checkout": "Checkout →", "cart.demo": "Checkout is a demo for now ☕", "cart.addFirst": "Add a drink first",
  "cart.added": "added ✓", "cart.close": "Close",

  "auth.welcome": "Welcome to Coffero", "auth.welcomeText": "Get a wide range of speciality iced coffee, cold brew and seasonal swirls.",
  "auth.signIn": "Sign In", "auth.signUp": "Sign Up", "auth.name": "Full name", "auth.email": "Email address",
  "auth.password": "Password", "auth.confirm": "Confirm password", "auth.forgot": "Forgot password?", "auth.or": "or",
  "auth.resetTitle": "Reset password", "auth.resetText": "Enter your email and we'll send a reset link.", "auth.sendLink": "Send link",
  "auth.back": "← Back to sign in", "auth.resetSent": "If this email is registered, a reset link is on its way. (Demo: no email is actually sent.)",
  "auth.social": "{p} sign-in needs a server connection — coming soon.", "auth.welcomeBack": "Welcome back,",
  "auth.created": "Account created — welcome,", "auth.demoNote": "Demo login: accounts are saved only in this browser.",
  "auth.alreadyIn": "You're signed in as", "auth.goHome": "Go to the home page →",
  "auth.err.exists": "An account with this email already exists.", "auth.err.invalid": "Wrong email or password.",
  "auth.err.match": "Passwords don't match.", "auth.err.short": "Password must be at least 6 characters.",
  "auth.err.name": "Please enter your name.", "auth.err.email": "Please enter a valid email.",

  "s1.eyebrow": "Summer 2026 — Cold Brew", "s1.text": "Slow-steeped for 18 hours, poured over ice and finished with a ribbon of salted caramel.",
  "s1.shop": "Shop now →", "s1.scroll": "Scroll to sip",
  "s2.eyebrow": "The swirl edit", "s2.text": "Cold brew meets cream. Every pour is a little different — that's the point.", "s2.cta": "Build your swirl →",
  "s3.eyebrow": "What's in the swirl", "s3.text": "Five ingredients, zero shortcuts.",
  "label.0": "Espresso shot", "label.1": "Vanilla cloud", "label.2": "Oat milk", "label.3": "Salted caramel", "label.4": "Cold brew 18h",
  "s4.section": "Section 1", "s4.size": "Size: L", "s4.new": "New this week", "s4.cta": "Find your swirl →",

  "step.0.title": "Pour", "step.0.text": "18-hour cold brew over clear, slow-melting ice.",
  "step.1.title": "Cream", "step.1.text": "Oat milk or sweet cream, poured from up high.",
  "step.2.title": "Swirl", "step.2.text": "A ribbon of salted caramel — then watch it bloom.",

  "flavor.0": "Cold brew, oat milk, a whisper of cane sugar.", "flavor.1": "Madagascar vanilla, sweet cream, layered slow.",
  "flavor.2": "Salted caramel, double shot, lots of crushed ice.",
  "menu.text": "Our classics, built on 18-hour cold brew. Every glass comes with real caramel and good ice.",
  "menu.full": "See the full menu →", "menu.extrasText": "Add-ons for any drink. Ask the barista — or just point.", "menu.addAria": "Add to cart",
  "extra.0": "Extra shot", "extra.1": "Oat / almond milk", "extra.2": "Salted caramel drizzle", "extra.3": "Vanilla cold foam", "extra.4": "Size up (L → XL)",
  "banner.text": "We steep our beans for 18 hours in cold water. Less bitterness, more chocolate and caramel — and a whole lot of smooth.",

  "hero.menu.eyebrow": "Menu", "hero.menu.text": "Three signature drinks on 18-hour cold brew, plus everything you need to make one your own.",
  "hero.about.eyebrow": "About us", "hero.about.text": "We are a small cold-brew bar in Tashkent. Here is what goes into every glass — and why we refuse to rush it.",
  "hero.contact.eyebrow": "Contact", "hero.contact.text": "Drop by the bar, call us, or send a note — events, wholesale cold brew and questions all welcome.",

  "about.since": "Since 2026",
  "about.text": "Coffero started with one question: what if iced coffee tasted like it was made on purpose? We brew small batches every night, make our caramel by hand and pour every drink to order.",
  "about.stat1": "cold steep", "about.stat2": "signature swirls", "about.stat3": "syrups from a pump",
  "value.0.title": "Slow on purpose", "value.0.text": "Cold water and 18 hours pull out chocolate and caramel notes — and leave the bitterness behind.",
  "value.1.title": "Real ingredients", "value.1.text": "House-made caramel, Madagascar vanilla, oat milk without the gums. Nothing from a pump bottle.",
  "value.2.title": "Made for the city", "value.2.text": "Grab-and-go cups, quick pickup and a spot to sit when you want to slow down too.",

  "visit.address": "Address", "visit.hours": "Hours", "visit.phone": "Phone", "visit.street": "12 Coffero Street", "visit.city": "Tashkent",
  "visit.weekdays": "Mon–Fri 8:00–22:00", "visit.weekend": "Sat–Sun 9:00–23:00", "visit.newsTitle": "Get your first swirl free",
  "visit.join": "Join", "visit.thanks": "You're on the list — your first swirl is on us ✦",
  "contact.text": "Events, wholesale cold brew, or just a question about our caramel — write to us and we'll get back within a day.",
  "contact.name": "Your name", "contact.email": "Email", "contact.topic0": "General question", "contact.topic1": "Events & catering",
  "contact.topic2": "Wholesale cold brew", "contact.message": "Message", "contact.send": "Send message →", "contact.thanks": "Thanks! We'll be in touch soon ✦",

  "footer.pages": "Pages", "footer.visit": "Visit", "footer.contact": "Contact", "footer.write": "Write to us",
  "footer.country": "Tashkent, Uzbekistan", "footer.top": "Back to top",
};

const uz: Dict = {
  "nav.profile": "Profil", "auth.err.current": "Joriy parol noto'g'ri.",
  "profile.title": "Mening profilim", "profile.notSigned": "Profilni ko'rish uchun hisobga kiring.", "profile.viaGoogle": "Google orqali kirgan",
  "profile.viaEmail": "Email orqali hisob", "profile.since": "A'zo bo'lgan sana", "profile.details": "Shaxsiy ma'lumotlar",
  "profile.save": "Saqlash", "profile.saved": "Saqlandi ✓", "profile.emailNote": "Emailni o'zgartirib bo'lmaydi.",
  "profile.password": "Parolni o'zgartirish", "profile.current": "Joriy parol", "profile.new": "Yangi parol",
  "profile.googlePw": "Parolingiz Google akkauntingiz orqali boshqariladi.", "profile.pwChanged": "Parol o'zgartirildi ✓",
  "profile.favorite": "Sevimli ichimlik", "profile.favoriteText": "Birini tanlang — keyin bir bosishda savatga qo'shing.",
  "profile.prefs": "Sozlamalar", "profile.cartItems": "Savatda {n} ta mahsulot", "profile.openCart": "Savatni ochish",
  "auth.googleCancelled": "Google orqali kirish bekor qilindi.", "auth.googleFailed": "Google orqali kirib bo'lmadi — qaytadan urinib ko'ring.",
  "auth.successTitle": "Xush kelibsiz, {name}!", "auth.successCreated": "Hisobingiz tayyor.", "auth.successSignedIn": "Hisobingizga kirdingiz.", "auth.enter": "Saytga o'tish →",
  "nav.home": "Bosh sahifa", "nav.menu": "Menyu", "nav.about": "Biz haqimizda", "nav.contact": "Aloqa",
  "nav.search": "Qidirish", "nav.cart": "Savat", "nav.account": "Hisob", "nav.language": "Til",
  "nav.openMenu": "Menyuni ochish", "nav.closeMenu": "Menyuni yopish",
  "acc.signedIn": "Hisobga kirgan:", "acc.signOut": "Chiqish", "acc.signedOut": "Hisobdan chiqdingiz",

  "search.placeholder": "Ichimlik, qo'shimcha yoki sahifa qidiring…", "search.drinks": "Ichimliklar", "search.extras": "Qo'shimchalar",
  "search.pages": "Sahifalar", "search.empty": "Hech narsa topilmadi:", "search.add": "Qo'shish", "search.hint": "Yopish uchun Esc", "search.close": "Yopish",

  "cart.title": "Savatingiz", "cart.empty": "Savat bo'sh — o'zingizga ichimlik tanlang.", "cart.total": "Jami",
  "cart.checkout": "Rasmiylashtirish →", "cart.demo": "Hozircha to'lov namuna sifatida ishlaydi ☕", "cart.addFirst": "Avval ichimlik qo'shing",
  "cart.added": "qo'shildi ✓", "cart.close": "Yopish",

  "auth.welcome": "Coffero'ga xush kelibsiz", "auth.welcomeText": "Turli xil maxsus muzli kofe, cold brew va mavsumiy ichimliklar sizni kutmoqda.",
  "auth.signIn": "Kirish", "auth.signUp": "Ro'yxatdan o'tish", "auth.name": "Ism", "auth.email": "Email manzil",
  "auth.password": "Parol", "auth.confirm": "Parolni tasdiqlang", "auth.forgot": "Parolni unutdingizmi?", "auth.or": "yoki",
  "auth.resetTitle": "Parolni tiklash", "auth.resetText": "Emailingizni kiriting — tiklash havolasini yuboramiz.", "auth.sendLink": "Havola yuborish",
  "auth.back": "← Kirishga qaytish", "auth.resetSent": "Agar bu email ro'yxatdan o'tgan bo'lsa, havola yuboriladi. (Demo: hozircha email yuborilmaydi.)",
  "auth.social": "{p} orqali kirish uchun server ulanishi kerak — tez orada.", "auth.welcomeBack": "Xush kelibsiz,",
  "auth.created": "Hisob yaratildi — xush kelibsiz,", "auth.demoNote": "Demo: hisoblar faqat shu brauzerda saqlanadi.",
  "auth.alreadyIn": "Siz hisobga kirgansiz:", "auth.goHome": "Bosh sahifaga o'tish →",
  "auth.err.exists": "Bu email bilan hisob allaqachon mavjud.", "auth.err.invalid": "Email yoki parol noto'g'ri.",
  "auth.err.match": "Parollar mos kelmadi.", "auth.err.short": "Parol kamida 6 ta belgidan iborat bo'lsin.",
  "auth.err.name": "Ismingizni kiriting.", "auth.err.email": "To'g'ri email kiriting.",

  "s1.eyebrow": "Yoz 2026 — Cold Brew", "s1.text": "18 soat davomida sekin damlangan, muz ustiga quyilgan va sho'r karamel bilan yakunlangan.",
  "s1.shop": "Xarid qilish →", "s1.scroll": "Pastga aylantiring",
  "s2.eyebrow": "Swirl to'plami", "s2.text": "Cold brew qaymoq bilan uchrashadi. Har bir quyilish o'ziga xos — gap ham shunda.", "s2.cta": "O'zingiznikini tanlang →",
  "s3.eyebrow": "Ichida nima bor", "s3.text": "Besh tarkib, hech qanday qisqa yo'l yo'q.",
  "label.0": "Espresso", "label.1": "Vanilli ko'pik", "label.2": "Suli suti", "label.3": "Sho'r karamel", "label.4": "Cold brew 18 soat",
  "s4.section": "1-bo'lim", "s4.size": "Hajm: L", "s4.new": "Shu haftaning yangiligi", "s4.cta": "O'zingiznikini toping →",

  "step.0.title": "Quyamiz", "step.0.text": "18 soatlik cold brew sekin eriydigan tiniq muz ustiga.",
  "step.1.title": "Qaymoq", "step.1.text": "Suli suti yoki shirin qaymoq, balanddan quyiladi.",
  "step.2.title": "Aylantir", "step.2.text": "Sho'r karamel tasmasi — keyin uning yoyilishini kuzating.",

  "flavor.0": "Cold brew, suli suti va bir chimdim qamish shakari.", "flavor.1": "Madagaskar vanili, shirin qaymoq, qatlam-qatlam.",
  "flavor.2": "Sho'r karamel, ikki espresso va ko'p maydalangan muz.",
  "menu.text": "Klassik ichimliklarimiz 18 soatlik cold brew asosida. Har bir stakanda haqiqiy karamel va sifatli muz.",
  "menu.full": "To'liq menyuni ko'rish →", "menu.extrasText": "Istalgan ichimlikka qo'shimchalar. Baristadan so'rang — yoki shunchaki ko'rsating.", "menu.addAria": "Savatga qo'shish",
  "extra.0": "Qo'shimcha espresso", "extra.1": "Suli / bodom suti", "extra.2": "Sho'r karamel", "extra.3": "Vanilli ko'pik", "extra.4": "Kattaroq hajm (L → XL)",
  "banner.text": "Donlarimizni 18 soat sovuq suvda damlaymiz. Achchiqlik kamroq, shokolad va karamel ta'mi ko'proq — va juda yumshoq.",

  "hero.menu.eyebrow": "Menyu", "hero.menu.text": "18 soatlik cold brew asosidagi uchta maxsus ichimlik va ularni o'zingizga moslash uchun hamma narsa.",
  "hero.about.eyebrow": "Biz haqimizda", "hero.about.text": "Biz Toshkentdagi kichik cold brew bari. Har bir stakanga nima kirishi va nega shoshilmasligimiz haqida.",
  "hero.contact.eyebrow": "Aloqa", "hero.contact.text": "Barimizga keling, qo'ng'iroq qiling yoki xabar yozing — tadbirlar, ulgurji cold brew va savollar uchun.",

  "about.since": "2026-yildan beri",
  "about.text": "Coffero bitta savoldan boshlandi: muzli kofe chindan ham e'tibor bilan tayyorlansa-chi? Har kecha kichik partiyalarda damlaymiz, karamelni qo'lda tayyorlaymiz va har bir ichimlikni buyurtma bo'yicha quyamiz.",
  "about.stat1": "sovuq damlash", "about.stat2": "maxsus ichimlik", "about.stat3": "tayyor sirop",
  "value.0.title": "Ataylab sekin", "value.0.text": "Sovuq suv va 18 soat shokolad va karamel notalarini ochadi — achchiqlikni esa qoldiradi.",
  "value.1.title": "Haqiqiy mahsulotlar", "value.1.text": "Uyda tayyorlangan karamel, Madagaskar vanili, qo'shimchasiz suli suti. Tayyor siroplar yo'q.",
  "value.2.title": "Shahar uchun", "value.2.text": "Olib ketish uchun stakanlar, tez xizmat va shoshmay o'tirish uchun joy.",

  "visit.address": "Manzil", "visit.hours": "Ish vaqti", "visit.phone": "Telefon", "visit.street": "Coffero ko'chasi, 12", "visit.city": "Toshkent",
  "visit.weekdays": "Du–Ju 8:00–22:00", "visit.weekend": "Sha–Ya 9:00–23:00", "visit.newsTitle": "Birinchi ichimlik bizdan bepul",
  "visit.join": "Qo'shilish", "visit.thanks": "Ro'yxatdasiz — birinchi ichimlik bizdan ✦",
  "contact.text": "Tadbirlar, ulgurji cold brew yoki karamel haqida savol — yozing, bir kun ichida javob beramiz.",
  "contact.name": "Ismingiz", "contact.email": "Email", "contact.topic0": "Umumiy savol", "contact.topic1": "Tadbirlar va keytering",
  "contact.topic2": "Ulgurji cold brew", "contact.message": "Xabar", "contact.send": "Yuborish →", "contact.thanks": "Rahmat! Tez orada bog'lanamiz ✦",

  "footer.pages": "Sahifalar", "footer.visit": "Manzil", "footer.contact": "Aloqa", "footer.write": "Bizga yozing",
  "footer.country": "Toshkent, O'zbekiston", "footer.top": "Yuqoriga",
};

const ru: Dict = {
  "nav.profile": "Профиль", "auth.err.current": "Текущий пароль неверен.",
  "profile.title": "Мой профиль", "profile.notSigned": "Войдите, чтобы увидеть профиль.", "profile.viaGoogle": "Вход через Google",
  "profile.viaEmail": "Аккаунт по email", "profile.since": "С нами с", "profile.details": "Личные данные",
  "profile.save": "Сохранить", "profile.saved": "Сохранено ✓", "profile.emailNote": "Email изменить нельзя.",
  "profile.password": "Сменить пароль", "profile.current": "Текущий пароль", "profile.new": "Новый пароль",
  "profile.googlePw": "Пароль управляется вашим аккаунтом Google.", "profile.pwChanged": "Пароль изменён ✓",
  "profile.favorite": "Любимый напиток", "profile.favoriteText": "Выберите — и добавляйте в корзину в одно касание.",
  "profile.prefs": "Настройки", "profile.cartItems": "В корзине: {n}", "profile.openCart": "Открыть корзину",
  "auth.googleCancelled": "Вход через Google отменён.", "auth.googleFailed": "Не удалось войти через Google — попробуйте ещё раз.",
  "auth.successTitle": "Добро пожаловать, {name}!", "auth.successCreated": "Ваш аккаунт готов.", "auth.successSignedIn": "Вы вошли в аккаунт.", "auth.enter": "Перейти на сайт →",
  "nav.home": "Главная", "nav.menu": "Меню", "nav.about": "О нас", "nav.contact": "Контакты",
  "nav.search": "Поиск", "nav.cart": "Корзина", "nav.account": "Аккаунт", "nav.language": "Язык",
  "nav.openMenu": "Открыть меню", "nav.closeMenu": "Закрыть меню",
  "acc.signedIn": "Вы вошли как", "acc.signOut": "Выйти", "acc.signedOut": "Вы вышли из аккаунта",

  "search.placeholder": "Поиск напитков, добавок, страниц…", "search.drinks": "Напитки", "search.extras": "Добавки",
  "search.pages": "Страницы", "search.empty": "Ничего не найдено:", "search.add": "Добавить", "search.hint": "Esc — закрыть", "search.close": "Закрыть",

  "cart.title": "Ваша корзина", "cart.empty": "Корзина пуста — выберите напиток.", "cart.total": "Итого",
  "cart.checkout": "Оформить →", "cart.demo": "Оформление пока в демо-режиме ☕", "cart.addFirst": "Сначала добавьте напиток",
  "cart.added": "добавлен ✓", "cart.close": "Закрыть",

  "auth.welcome": "Добро пожаловать в Coffero", "auth.welcomeText": "Широкий выбор холодного кофе, cold brew и сезонных напитков.",
  "auth.signIn": "Войти", "auth.signUp": "Регистрация", "auth.name": "Имя", "auth.email": "Email",
  "auth.password": "Пароль", "auth.confirm": "Повторите пароль", "auth.forgot": "Забыли пароль?", "auth.or": "или",
  "auth.resetTitle": "Сброс пароля", "auth.resetText": "Введите email — мы отправим ссылку для сброса.", "auth.sendLink": "Отправить",
  "auth.back": "← Назад ко входу", "auth.resetSent": "Если этот email зарегистрирован, ссылка уже в пути. (Демо: письмо пока не отправляется.)",
  "auth.social": "Вход через {p} требует подключения сервера — скоро.", "auth.welcomeBack": "С возвращением,",
  "auth.created": "Аккаунт создан — добро пожаловать,", "auth.demoNote": "Демо: аккаунты хранятся только в этом браузере.",
  "auth.alreadyIn": "Вы вошли как", "auth.goHome": "На главную →",
  "auth.err.exists": "Аккаунт с таким email уже существует.", "auth.err.invalid": "Неверный email или пароль.",
  "auth.err.match": "Пароли не совпадают.", "auth.err.short": "Пароль должен быть не короче 6 символов.",
  "auth.err.name": "Введите имя.", "auth.err.email": "Введите корректный email.",

  "s1.eyebrow": "Лето 2026 — Cold Brew", "s1.text": "Настаивается 18 часов, подаётся со льдом и лентой солёной карамели.",
  "s1.shop": "Заказать →", "s1.scroll": "Листайте вниз",
  "s2.eyebrow": "Коллекция Swirl", "s2.text": "Cold brew встречает сливки. Каждая подача немного другая — в этом весь смысл.", "s2.cta": "Соберите свой напиток →",
  "s3.eyebrow": "Что внутри", "s3.text": "Пять ингредиентов, никаких компромиссов.",
  "label.0": "Эспрессо", "label.1": "Ванильная пенка", "label.2": "Овсяное молоко", "label.3": "Солёная карамель", "label.4": "Cold brew 18 ч",
  "s4.section": "Раздел 1", "s4.size": "Размер: L", "s4.new": "Новинка недели", "s4.cta": "Найдите свой →",

  "step.0.title": "Наливаем", "step.0.text": "18-часовой cold brew на прозрачный, медленно тающий лёд.",
  "step.1.title": "Сливки", "step.1.text": "Овсяное молоко или сливки — льём с высоты.",
  "step.2.title": "Вихрь", "step.2.text": "Лента солёной карамели — и смотрите, как она раскрывается.",

  "flavor.0": "Cold brew, овсяное молоко и немного тростникового сахара.", "flavor.1": "Мадагаскарская ваниль и сливки, слоями.",
  "flavor.2": "Солёная карамель, двойной шот и много колотого льда.",
  "menu.text": "Наша классика на 18-часовом cold brew. В каждом стакане — настоящая карамель и хороший лёд.",
  "menu.full": "Всё меню →", "menu.extrasText": "Добавки к любому напитку. Спросите бариста — или просто покажите.", "menu.addAria": "В корзину",
  "extra.0": "Доп. шот эспрессо", "extra.1": "Овсяное / миндальное молоко", "extra.2": "Солёная карамель", "extra.3": "Ванильная пенка", "extra.4": "Размер больше (L → XL)",
  "banner.text": "Мы настаиваем зерно 18 часов в холодной воде. Меньше горечи, больше шоколада и карамели — и очень мягкий вкус.",

  "hero.menu.eyebrow": "Меню", "hero.menu.text": "Три фирменных напитка на 18-часовом cold brew и всё, чтобы сделать их своими.",
  "hero.about.eyebrow": "О нас", "hero.about.text": "Мы — небольшой cold brew бар в Ташкенте. Вот что входит в каждый стакан и почему мы не спешим.",
  "hero.contact.eyebrow": "Контакты", "hero.contact.text": "Заходите в бар, звоните или пишите — мероприятия, опт cold brew и любые вопросы.",

  "about.since": "С 2026 года",
  "about.text": "Coffero начался с одного вопроса: а что если холодный кофе готовить по-настоящему внимательно? Мы варим небольшими партиями каждую ночь, делаем карамель вручную и готовим каждый напиток под заказ.",
  "about.stat1": "холодного настаивания", "about.stat2": "фирменных напитка", "about.stat3": "сиропов из дозатора",
  "value.0.title": "Медленно — специально", "value.0.text": "Холодная вода и 18 часов раскрывают ноты шоколада и карамели и убирают горечь.",
  "value.1.title": "Настоящие ингредиенты", "value.1.text": "Домашняя карамель, мадагаскарская ваниль, овсяное молоко без загустителей. Никаких сиропов.",
  "value.2.title": "Для города", "value.2.text": "Стаканы с собой, быстрая выдача и место, чтобы посидеть и не спешить.",

  "visit.address": "Адрес", "visit.hours": "Часы работы", "visit.phone": "Телефон", "visit.street": "ул. Coffero, 12", "visit.city": "Ташкент",
  "visit.weekdays": "Пн–Пт 8:00–22:00", "visit.weekend": "Сб–Вс 9:00–23:00", "visit.newsTitle": "Первый напиток — бесплатно",
  "visit.join": "Подписаться", "visit.thanks": "Вы в списке — первый напиток за наш счёт ✦",
  "contact.text": "Мероприятия, опт cold brew или вопрос о нашей карамели — пишите, ответим в течение дня.",
  "contact.name": "Ваше имя", "contact.email": "Email", "contact.topic0": "Общий вопрос", "contact.topic1": "Мероприятия и кейтеринг",
  "contact.topic2": "Опт cold brew", "contact.message": "Сообщение", "contact.send": "Отправить →", "contact.thanks": "Спасибо! Скоро свяжемся ✦",

  "footer.pages": "Страницы", "footer.visit": "Адрес", "footer.contact": "Контакты", "footer.write": "Написать нам",
  "footer.country": "Ташкент, Узбекистан", "footer.top": "Наверх",
};

const DICTS: Record<Lang, Dict> = { en, uz, ru };
const KEY = "coffero.lang";
const listeners = new Set<() => void>();

function readLang(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    return v === "uz" || v === "ru" ? v : "en";
  } catch {
    return "en";
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { memoryLang = null; cb(); } };
  addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); removeEventListener("storage", onStorage); };
}

export function setLang(lang: Lang) {
  try { localStorage.setItem(KEY, lang); } catch { /* private mode: still switch for this visit */ }
  memoryLang = lang;
  listeners.forEach((f) => f());
}

// fallback when storage is unavailable
let memoryLang: Lang | null = null;

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, () => memoryLang ?? readLang(), () => "en");
}

/** Returns a translator for the current language; falls back to English. */
export function useT() {
  const lang = useLang();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return useCallback(
    (key: string, vars?: Record<string, string>) => {
      let s = DICTS[lang][key] ?? en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
      return s;
    },
    [lang]
  );
}
