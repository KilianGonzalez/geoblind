'use client'

import { useState, useEffect } from 'react'

const translations = {
  // Navegación y UI
  howToPlay: 'Cómo Jugar',
  signIn: 'Iniciar Sesión',
  signUp: 'Registrarse',
  signOut: 'Cerrar Sesión',
  profile: 'Perfil',
  settings: 'Configuración',
  ranking: 'Ranking',
  about: 'Sobre Nosotros',
  contact: 'Contacto',
  back: 'Volver',
  play: 'Jugar',
  day: 'DÍA',
  time: 'Tiempo',
  attempts: 'Intentos',
  score: 'Puntuación',
  streak: 'Racha',
  loading: 'Cargando...',
  error: 'Error',
  success: 'Éxito',
  
  // Modos de juego
  dailyMode: 'Modo Diario',
  infiniteMode: 'Modo Infinito',
  regionMode: 'Modo Región',
  practiceMode: 'Modo Práctica',
  timedMode: 'Contrarreloj',
  
  // Juego
  guessCountry: 'Adivina el país',
  enterCountry: 'Escribe un país...',
  makeGuess: 'Hacer intento',
  skip: 'Omitir',
  next: 'Siguiente',
  tryAgain: 'Intentar de nuevo',
  congratulations: '¡Felicidades!',
  gameOver: '¡Juego terminado!',
  youWon: '¡Ganaste!',
  youLost: '¡Perdiste!',
  
  // Estadísticas
  totalGames: 'Partidas totales',
  winRate: 'Tasa de victoria',
  currentStreak: 'Racha actual',
  maxStreak: 'Racha máxima',
  averageAttempts: 'Intentos promedio',
  
  // Formularios
  name: 'Nombre',
  email: 'Correo electrónico',
  password: 'Contraseña',
  confirmPassword: 'Confirmar contraseña',
  username: 'Nombre de usuario',
  subject: 'Asunto',
  message: 'Mensaje',
  send: 'Enviar',
  save: 'Guardar',
  delete: 'Eliminar',
  edit: 'Editar',
  
  // Mensajes
  welcome: '¡Bienvenido a GeoBlind!',
  welcomeBack: '¡Bienvenido de nuevo!',
  createAccount: 'Crear cuenta',
  alreadyHaveAccount: '¿Ya tienes una cuenta?',
  dontHaveAccount: '¿No tienes una cuenta?',
  forgotPassword: '¿Olvidaste tu contraseña?',
  rememberMe: 'Recordarme',
  
  // Errores
  invalidEmail: 'Correo electrónico inválido',
  passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
  passwordsDontMatch: 'Las contraseñas no coinciden',
  userNotFound: 'Usuario no encontrado',
  incorrectPassword: 'Contraseña incorrecta',
  emailAlreadyExists: 'El correo electrónico ya está registrado',
  usernameAlreadyExists: 'El nombre de usuario ya está registrado',
  
  // Reglas
  rules: 'Reglas',
  objective: 'Objetivo',
  gameplay: 'Jugabilidad',
  scoring: 'Puntuación',
  tips: 'Consejos',
  strategies: 'Estrategias',
  strategiesDesc: 'Consejos para mejorar tu precisión',
  strategy1: 'Usa la temperatura para eliminar climas extremos.',
  strategy2: 'Combina distancia y dirección para triangular la ubicación.',
  strategy3: 'Fíjate en la densidad de población y características geográficas.',
  
  // Contacto
  contactUs: 'Contáctanos',
  sendMessage: 'Enviar mensaje',
  messageSent: 'Mensaje enviado',
  messageSentDesc: 'Gracias por contactarnos. Te responderemos lo antes posible.',
  generalInquiry: 'Consulta general',
  reportBug: 'Reportar un error',
  suggestion: 'Sugerencia',
  partnership: 'Colaboración',
  technicalSupport: 'Soporte técnico',
  
  // About
  aboutUs: 'Sobre Nosotros',
  mission: 'Nuestra Misión',
  vision: 'Nuestra Visión',
  team: 'Nuestro Equipo',
  values: 'Nuestros Valores',
  history: 'Nuestra Historia',
  joinUs: 'Únete a la Aventura',
  
  // Footer
  allRightsReserved: 'Todos los derechos reservados',
  madeWith: 'Hecho con',
  privacyPolicy: 'Política de privacidad',
  termsOfService: 'Términos de servicio',
  cookiePolicy: 'Política de cookies',
  
  // Game modes
  daily: 'Diario',
  infinite: 'Infinito',
  region: 'Región',
  practice: 'Práctica',
  timed: 'Contrarreloj',
  
  // Continents
  africa: 'África',
  asia: 'Asia',
  europe: 'Europa',
  northAmerica: 'América del Norte',
  southAmerica: 'América del Sur',
  oceania: 'Oceanía',
  antarctica: 'Antártida',
  
  // Difficulty
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
  expert: 'Experto',
  
  // Game states
  playing: 'Jugando',
  won: 'Ganado',
  lost: 'Perdido',
  paused: 'Pausado',
  finished: 'Finalizado',
  
  // Game specific
  writeCountry: 'Escribe un país...',
  startWriting: 'Comienza a escribir para ver pistas',
  hintsInfo: 'Usa la distancia y dirección para acercarte',
  attempt: 'Intento',
  attemptsLeft: 'intentos restantes',
  withoutLimit: 'sin límite',
  seeResult: 'Ver resultado',
  giveUp: 'Rendirse',
  sure: '¿Seguro?',
  yesGiveUp: 'Sí, rendirme',
  cancel: 'Cancelar',
  
  // Actions
  start: 'Empezar',
  restart: 'Reiniciar',
  continue: 'Continuar',
  quit: 'Salir',
  resume: 'Reanudar',
  pause: 'Pausar',
  
  // Messages
  loadingGame: 'Cargando juego...',
  gameReady: '¡Juego listo!',
  gameError: 'Error en el juego',
  noResults: 'No hay resultados',
  tryDifferentSearch: 'Intenta una búsqueda diferente',
  noMoreAttempts: 'No hay más intentos',
  timeUp: '¡Tiempo agotado!',
  
  // Auth messages
  loginSuccess: '¡Inicio de sesión exitoso!',
  loginError: 'Error al iniciar sesión',
  registerSuccess: '¡Cuenta creada exitosamente!',
  registerError: 'Error al crear cuenta',
  
  // Social
  shareResult: 'Compartir resultado',
  copyLink: 'Copiar enlace',
  copied: '¡Copiado!',
  shareScore: 'Compartir puntuación',
  challengeFriend: 'Desafiar a un amigo',
  
  // Settings
  languageSetting: 'Idioma',
  theme: 'Tema',
  sound: 'Sonido',
  notifications: 'Notificaciones',
  darkMode: 'Modo oscuro',
  lightMode: 'Modo claro',
  autoMode: 'Modo automático',
  
  // Profile
  myProfile: 'Mi Perfil',
  myStats: 'Mis Estadísticas',
  myHistory: 'Mi Historial',
  achievements: 'Logros',
  badges: 'Insignias',
  level: 'Nivel',
  experience: 'Experiencia',
  
  // Auth
  loggingIn: 'Iniciando sesión...',
  registering: 'Registrando...',
  signingIn: 'Iniciando sesión...',
  signingUp: 'Registrando...',
  
  // Validation
  required: 'Este campo es obligatorio',
  invalidFormat: 'Formato inválido',
  tooShort: 'Demasiado corto',
  tooLong: 'Demasiado largo',
  invalidCharacters: 'Caracteres inválidos',
  
  // General
  yes: 'Sí',
  no: 'No',
  ok: 'OK',
  confirm: 'Confirmar',
  close: 'Cerrar',
  open: 'Abrir',
  add: 'Agregar',
  remove: 'Quitar',
  search: 'Buscar',
  filter: 'Filtrar',
  sort: 'Ordenar',
  clear: 'Limpiar',
  reset: 'Restablecer',
  apply: 'Aplicar',
  refresh: 'Actualizar',
  download: 'Descargar',
  upload: 'Subir',
  view: 'Ver',
  hide: 'Ocultar',
  show: 'Mostrar',
  select: 'Seleccionar',
  deselect: 'Deseleccionar',
  all: 'Todos',
  none: 'Ninguno',
  other: 'Otro',
  unknown: 'Desconocido',
  na: 'N/A'
}

export function useLanguage() {
  const [language, setLanguage] = useState<'es'>('es')

  useEffect(() => {
    // Solo cargar desde localStorage si existe
    const savedLanguage = localStorage.getItem('language') as 'es' | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: 'es') => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: keyof typeof translations): string => {
    return translations[key] || key
  }

  const getLanguageFlag = (lang: 'es') => {
    return lang === 'es' ? '🇪🇸' : '🇺🇸'
  }

  const getLanguageName = (lang: 'es') => {
    return lang === 'es' ? 'Español' : 'English'
  }

  return { language, changeLanguage, t, getLanguageFlag, getLanguageName }
}
