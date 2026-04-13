'use client'

import Link from 'next/link'
import { 
  Globe, 
  MapPin, 
  Compass, 
  Thermometer, 
  Target, 
  Trophy, 
  Users, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function RulesPage() {
  const { language, t } = useLanguage()
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground">GeoBlind</span>
          </div>
        </div>
      </header>

      {/* Rules Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('howToPlay')}
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t('rulesSubtitle')}
          </p>
        </div>

        {/* Game Objective */}
        <div className="mb-16 p-8 rounded-2xl border border-border/40 bg-card/50">
          <div className="flex items-start gap-4 mb-6">
            <Target className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{language === 'es' ? 'Objetivo del Juego' : 'Game Objective'}</h2>
              <p className="text-foreground/70 leading-relaxed">
                {t('gameDescription')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground">{language === 'es' ? 'Inicia el Juego' : 'Start Game'}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Comienza un nuevo juego y recibirás un país misterioso que debes adivinar.' : 'Start a new game and you will receive a mystery country that you must guess.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-foreground">{t('makeFirstGuess')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {t('makeFirstGuessDesc')}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-foreground">{t('receiveHints')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {t('receiveHintsDesc')}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <span className="font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-foreground">{t('keepTrying')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {t('keepTryingDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Hint System */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{language === 'es' ? 'Sistema de Pistas' : 'Hint System'}</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/40 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
              <MapPin className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t('distance')}</h3>
              <p className="text-foreground/70 text-sm mb-3">
                {t('distanceDesc')}
              </p>
              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                <p className="font-mono text-sm text-blue-300">{t('distanceExample')}</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-gradient-to-br from-green-500/10 to-green-600/5">
              <Compass className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t('direction')}</h3>
              <p className="text-foreground/70 text-sm mb-3">
                {t('directionDesc')}
              </p>
              <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                <p className="font-mono text-sm text-green-300">{t('directionExample')}</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
              <Thermometer className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{t('temperature')}</h3>
              <p className="text-foreground/70 text-sm mb-3">
                {t('temperatureDesc')}
              </p>
              <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20">
                <p className="font-mono text-sm text-orange-300">{t('temperatureExample')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{language === 'es' ? 'Modos de Juego' : 'Game Modes'}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <h3 className="font-semibold text-foreground">{t('daily')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Un nuevo país cada día. Todos los jugadores compiten con el mismo misterio.' : 'A new country every day. All players compete with the same mystery.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h3 className="font-semibold text-foreground">{t('infinite')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Juga sin límites. Practica y mejora tus habilidades geográficas.' : 'Play without limits. Practice and improve your geography skills.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="font-semibold text-foreground">{t('region')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Adivina países de una región específica: Europa, Asia, África, etc.' : 'Guess countries from a specific region: Europe, Asia, Africa, etc.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <h3 className="font-semibold text-foreground">{t('timed')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Adivina tantos países como puedas en un tiempo limitado.' : 'Guess as many countries as you can in a limited time.'}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h3 className="font-semibold text-foreground">{t('hard')}</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Menos intentos, pistas más vagas. Solo para expertos.' : 'Fewer attempts, vaguer hints. For experts only.'}
              </p>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{language === 'es' ? 'Sistema de Puntuación' : 'Scoring System'}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                {language === 'es' ? 'Puntos por Intento' : 'Points per Attempt'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? '1 intento' : '1 attempt'}</span>
                  <span className="font-mono text-primary">1000 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? '2 intentos' : '2 attempts'}</span>
                  <span className="font-mono text-primary">800 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? '3 intentos' : '3 attempts'}</span>
                  <span className="font-mono text-primary">600 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? '4 intentos' : '4 attempts'}</span>
                  <span className="font-mono text-primary">400 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? '5 intentos' : '5 attempts'}</span>
                  <span className="font-mono text-primary">200 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? '6 intentos' : '6 attempts'}</span>
                  <span className="font-mono text-primary">100 pts</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/40 bg-card/30">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                {language === 'es' ? 'Bonificaciones' : 'Bonuses'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? 'Racha diaria' : 'Daily Streak'}</span>
                  <span className="font-mono text-primary">+500 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? 'Perfecto (1/1)' : 'Perfect (1/1)'}</span>
                  <span className="font-mono text-primary">+200 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? 'Modo difícil' : 'Hard Mode'}</span>
                  <span className="font-mono text-primary">x2 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">{language === 'es' ? 'Contrarreloj' : 'Timed'}</span>
                  <span className="font-mono text-primary">+{language === 'es' ? 'Tiempo pts' : 'Time pts'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-16 p-8 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">{t('strategies')}</h2>
          <p className="text-center text-foreground/70 mb-6">{t('strategiesDesc')}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Empieza por países grandes y conocidos para obtener pistas amplias.' : 'Start with large and well-known countries to get broad hints.'}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-foreground/70 text-sm">
                {t('strategy1')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-foreground/70 text-sm">
                {t('strategy2')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-foreground/70 text-sm">
                {language === 'es' ? 'Memoriza países pequeños y menos conocidos para sorprender.' : 'Memorize small and less known countries to surprise.'}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/game"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Globe className="w-5 h-5" />
            Jugar Ahora
          </Link>
          <p className="mt-4 text-foreground/60 text-sm">
            ¿Listo para poner a prueba tu conocimiento geográfico?
          </p>
        </div>
      </section>
    </main>
  )
}
