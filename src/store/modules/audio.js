import defaultVoice from '@/assets/audio/default.mp3'
import helmet from '@/assets/audio/helmet.wav'
import fallDown from '@/assets/audio/fallDown.wav'
import fireSmoke from '@/assets/audio/fireSmoke.wav'
import invasion from '@/assets/audio/invasion.wav'
import leakOil from '@/assets/audio/leakOil.wav'
import phone from '@/assets/audio/phone.wav'
import skinExposure from '@/assets/audio/skinExposure.wav'
import smoke from '@/assets/audio/smoke.wav'
import uniform from '@/assets/audio/uniform.wav'
import vest from '@/assets/audio/vest.wav'

const state = {
  voiceBroadcast: [],
  voiceOption: {
    voice: false,
    notify: false,
    time: 1,
    isAudition: false,
    algorithm: [
      {
        str: 'default',
        voice: defaultVoice
      },
      {
        str: 'helmet',
        voice: helmet
      },
      {
        str: 'uniform',
        voice: uniform
      },
      {
        str: 'vest',
        voice: vest
      },
      {
        str: 'clothing',
        voice: helmet
      },
      {
        str: 'invasion',
        voice: invasion
      },
      {
        str: 'clothingVest',
        voice: vest
      },
      {
        str: 'skinExposure',
        voice: skinExposure
      },
      {
        str: 'fireSmoke',
        voice: fireSmoke
      },
      {
        str: 'smokePhone',
        voice: smoke
      },
      {
        str: 'smoke',
        voice: smoke
      },
      {
        str: 'phone',
        voice: phone
      },
      {
        str: 'redUniform',
        voice: uniform
      },
      {
        str: 'blueUniform',
        voice: uniform
      },
      {
        str: 'leakOil',
        voice: leakOil
      },
      {
        str: 'leakOilIndoor',
        voice: leakOil
      },
      {
        str: 'fallDown',
        voice: fallDown
      }
    ]
  }
}

const mutations = {
  SET_VOICE_BROADCAST: (state, voice) => {
    state.voiceBroadcast = voice
  },
  SET_VOICE_OPTION: (state, audio) => {
    state.voiceOption[audio.key] = audio.value
  }
}

const actions = {
  setVoiceBroadcast({ commit }, voice) {
    commit('SET_VOICE_BROADCAST', voice)
  },
  setVoiceOption({ commit }, audio) {
    commit('SET_VOICE_OPTION', audio)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

