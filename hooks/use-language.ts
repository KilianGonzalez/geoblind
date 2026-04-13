'use client'

import { useState, useEffect } from 'react'

const translations = {
  es: {
    daily: 'Diario',
    infinite: 'Infinito',
    region: 'Región',
    timed: 'Contrarreloj',
    hard: 'Difícil',
    modeDaily: 'MODO DIARIO',
    modeInfinite: 'MODO INFINITO',
    modeRegion: 'MODO REGIÓN',
    modeTimed: 'CONTRARRELOJ',
    modeHard: 'MODO DIFÍCIL',
    attempt: 'Intento',
    attemptsLeft: 'restantes',
    withoutLimit: 'Sin límite',
    time: 'Tiempo',
    writeCountry: 'Escribe un país...',
    startWriting: 'Empieza escribiendo un país arriba',
    hintsInfo: 'Te daremos pistas de distancia y dirección',
    giveUp: 'Rendirse',
    sure: '¿Seguro?',
    yesGiveUp: 'Sí, rendirse',
    cancel: 'Cancelar',
    seeResult: 'Ver resultado',
    day: 'Día',
    // Reglas page
    howToPlay: 'Cómo Jugar',
    rulesSubtitle: 'Aprende las reglas básicas y conviértete en un maestro de la geografía',
    gameDescription: 'Adivina el país misterioso en menos de 6 intentos. Cada día, un nuevo país desafía tu conocimiento geográfico. Utiliza las pistas de distancia, dirección y temperatura para encontrar la respuesta correcta.',
    howItWorks: 'Cómo Funciona',
    makeFirstGuess: 'Haz tu Primer Intento',
    makeFirstGuessDesc: 'Escribe el nombre de cualquier país que creas que podría ser el correcto.',
    keepTrying: 'Sigue Intentando',
    keepTryingDesc: 'Usa las pistas para acercarte cada vez más a la respuesta correcta.',
    receiveHints: 'Recibe Pistas',
    receiveHintsDesc: 'Obtén información sobre distancia, dirección y temperatura del país misterioso.',
    distance: 'Distancia',
    distanceDesc: 'Te indica exactamente cuántos kilómetros de distancia hay entre tu país y el país misterioso.',
    direction: 'Dirección',
    directionDesc: 'Muestra la dirección cardinal donde se encuentra el país misterioso desde tu posición.',
    temperature: 'Temperatura',
    temperatureDesc: 'Proporciona el rango de temperatura promedio del país misterioso.',
    distanceExample: 'Ejemplo: 2,450 km',
    directionExample: 'Ejemplo: Noreste',
    temperatureExample: 'Ejemplo: 15°C - 25°C',
    strategies: 'Estrategias',
    strategiesDesc: 'Consejos para mejorar tu precisión',
    strategy1: 'Usa la temperatura para eliminar climas extremos.',
    strategy2: 'Combina distancia y dirección para triangular la ubicación.',
    back: 'Volver',
    // Auth page
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    email: 'Correo',
    password: 'Contraseña',
    username: 'Nombre de usuario',
    signingIn: 'Iniciando sesión...',
    signingUp: 'Registrando...',
    loginError: 'Error al iniciar sesión',
    registerError: 'Error al registrarse',
    welcomeBack: '¡Bienvenido de nuevo!',
    welcome: '¡Bienvenido a GeoBlind!',
    createAccount: 'Crear cuenta',
    alreadyHaveAccount: '¿Ya tienes una cuenta?'
  },
  en: {
    daily: 'Daily',
    infinite: 'Infinite',
    region: 'Region',
    timed: 'Timed',
    hard: 'Hard',
    modeDaily: 'DAILY MODE',
    modeInfinite: 'INFINITE MODE',
    modeRegion: 'REGION MODE',
    modeTimed: 'TIMED MODE',
    modeHard: 'HARD MODE',
    attempt: 'Attempt',
    attemptsLeft: 'remaining',
    withoutLimit: 'No limit',
    time: 'Time',
    writeCountry: 'Type a country...',
    startWriting: 'Start typing a country above',
    hintsInfo: 'We will give you distance and direction hints',
    giveUp: 'Give Up',
    sure: 'Sure?',
    yesGiveUp: 'Yes, give up',
    cancel: 'Cancel',
    seeResult: 'See result',
    day: 'Day',
    // Reglas page
    howToPlay: 'How to Play',
    rulesSubtitle: 'Learn the basic rules and become a geography master',
    gameDescription: 'Guess the mystery country in less than 6 attempts. Each day, a new country challenges your geographical knowledge. Use distance, direction and temperature hints to find the correct answer.',
    howItWorks: 'How It Works',
    makeFirstGuess: 'Make Your First Guess',
    makeFirstGuessDesc: 'Type the name of any country you think could be the correct one.',
    keepTrying: 'Keep Trying',
    keepTryingDesc: 'Use the hints to get closer to the correct answer each time.',
    receiveHints: 'Receive Hints',
    receiveHintsDesc: 'Get information about distance, direction and temperature of the mystery country.',
    distance: 'Distance',
    distanceDesc: 'Indicates exactly how many kilometers of distance there are between your country and the mystery country.',
    direction: 'Direction',
    directionDesc: 'Shows the cardinal direction where the mystery country is located from your position.',
    temperature: 'Temperature',
    temperatureDesc: 'Provides the average temperature range of the mystery country.',
    distanceExample: 'Example: 2,450 km',
    directionExample: 'Example: Northeast',
    temperatureExample: 'Example: 15°C - 25°C',
    strategies: 'Strategies',
    strategiesDesc: 'Tips to improve your accuracy',
    strategy1: 'Use temperature to eliminate extreme climates.',
    strategy2: 'Combine distance and direction to triangulate the location.',
    back: 'Back',
    // Auth page
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    signingIn: 'Signing in...',
    signingUp: 'Signing up...',
    loginError: 'Error signing in',
    registerError: 'Error registering',
    welcomeBack: 'Welcome back!',
    welcome: 'Welcome to GeoBlind!',
    createAccount: 'Create account',
    alreadyHaveAccount: 'Already have an account?'
  }
}

export function useLanguage() {
  const [language, setLanguage] = useState<'es' | 'en'>('es')

  useEffect(() => {
    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('language') as 'es' | 'en' | null
    const initialLanguage = savedLanguage || 'es'
    if (initialLanguage !== language) {
      setLanguage(initialLanguage)
    }
  }, [])

  const changeLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: keyof typeof translations.es) => {
    return translations[language][key] || translations.es[key]
  }

  const getLanguageFlag = (lang: 'es' | 'en') => {
    return lang === 'es' ? '🇪🇸' : '🇺🇸'
  }

  const getLanguageName = (lang: 'es' | 'en') => {
    return lang === 'es' ? 'Español' : 'English'
  }

  return { language, changeLanguage, t, getLanguageFlag, getLanguageName }
}
