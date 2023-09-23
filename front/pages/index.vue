<template>
  <section id="home-page">
    <!-- MENU -->
    <section class="menu">
      <h4 class="title">Music</h4>

      <eth-input type="text" :model-value="musics[currentMusicIndex].title" :icon="['fas', 'magnifying-glass']" theme="dark" />

      <div class="icons">
        <p class="link"><fa class="icon" :icon="['fas', 'music']" /> Songs</p>
        <p class="link"><fa class="icon" :icon="['fas', 'record-vinyl']" /> Albums</p>
        <p class="link"><fa class="icon" :icon="['fas', 'bars']" /> Playlists</p>
        <p class="link"><fa class="icon" :icon="['fas', 'user']" /> Artists</p>
        <p class="link"><fa class="icon" :icon="['fab', 'soundcloud']" /> Now playing</p>
        <p class="link"><fa class="icon" :icon="['fas', 'sliders']" /> Settings</p>
      </div>
    </section>

    <!-- PLAYER -->
    <section class="player">
      <div class="nav">
        <button class="btn_call-to-action --inverted" @click="isReportOpen = true">Tell us who is the author</button>
        <div class="action">
          <fa class="icon" :icon="['fas', 'caret-down']" />
          <fa class="icon" :icon="['fas', 'expand']" />
          <fa class="icon" :icon="['fas', 'close']" />
        </div>
      </div>
      <div class="music-wrapper" :style="`--current-music: ${currentMusicIndex}`">
        <div class="slider">
          <div v-for="(music, index) of musics" :key="`music-${index}`" class="music-data">
            <img :src="music.pictureURL" alt="" />
            <div class="meta">
              <div class="info">
                <h4 class="title">{{ music.title }}</h4>
                <p class="from">{{ artists.find((artist) => artist.id === music.authorId)?.name }}</p>
                <p class="rating">
                  <fa v-for="rating in 5" :key="`icon-${rating}`" class="icon" :icon="rating <= music.rating ? ['fas', 'star'] : ['far', 'star']" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="media">
        <div class="icons">
          <fa class="icon --small" :icon="['fas', 'shuffle']" />
          <fa class="icon --medium" :icon="['far', 'circle-left']" @click="previous" />
          <fa class="icon --large" :icon="['fas', 'play']" />
          <fa class="icon --medium" :icon="['far', 'circle-right']" @click="next" />
          <fa class="icon --small" :icon="['fas', 'rotate-left']" />
        </div>
        <div class="time">
          <p class="current">0:00</p>
          <div class="timeline"></div>
          <p class="of">3:30</p>
        </div>
      </div>
    </section>

    <!-- <i-d-kit-widget
      app_id="app_GBkZ1KlVUdFTjeMXKlVUdFT"
      action="vote_1"
      signal="user_value"
      :on-success="(value: unknown) => console.log({ value })"
      :credential_types="['orb', 'phone']"
      enable-telemetry
    >
    </i-d-kit-widget> -->
    <!-- <button :data="{ open }" @click="open">Click me</button> -->

    <!-- <my-component /> -->

    <eth-modal max-width="500px" :is-open="isReportOpen" @close="isReportOpen = false">
      <h3>Who's the original artist of this song ?</h3>
      <autocomplete-input
        v-model="selectedArtist"
        style="margin-top: 30px;"
        :options="artists.map((artist: IArtist) => ({ display: artist.name, value: artist }))"
        label="Artist's name"
        :selected-style="SelectedOptionStyles.CHIP"
        placeholder="artist's name"
        :options-display-limit="6"
        :error="validator.getErrors()[0]"
        @input="validator.validate()"
      />

      <div style="width: 100%; display: flex; justify-content: center; margin-top: 30px;">
        <button class="btn_call-to-action" style="margin: auto" @click="submit">Submit</button>
      </div>
    </eth-modal>
  </section>
</template>

<script lang="ts">
import { musics, artists } from '@/assets/data'
import { SelectedOptionStyles } from '@/assets/ts'
import { Validator } from '@/composables/useValidator'

export default {
  components: {},
  setup() {
    const isReportOpen = ref<boolean>(false)
    const currentMusicIndex = ref<number>(0)
    const selectedArtist = ref<IArtist>()

    const validator = ref<Validator<IArtist>>(
      useValidator().createValidator<IArtist>(
        (value?: IArtist) => {
          if (!value) return ['You must provide an artist']
          else return []
        },
        () => selectedArtist.value
      )
    )

    function previous() {
      currentMusicIndex.value = currentMusicIndex.value ? currentMusicIndex.value - 1 : musics.length - 1
    }

    function next() {
      currentMusicIndex.value = (currentMusicIndex.value + 1) % musics.length
    }

    function submit() {
      if (!validator.value.validate()) return
    }

    return {
      SelectedOptionStyles,

      artists,
      musics,

      isReportOpen,
      currentMusicIndex,
      selectedArtist,

      validator,

      previous,
      next,
      submit
    }
  }
}

// enum CredentialType {
//   Orb = 'orb',
//   Phone = 'phone'
// }

// interface IHandleVerifyPayload {
//   proof: string
//   merkle_root: string
//   nullifier_hash: string
//   credential_type: CredentialType
// }
</script>

<style lang="scss" scoped>
#home-page {
  display: flex;
  height: calc(100vh - 60px);
  // background-image: url(https://cdn.smehost.net/2020sonymusiccouk-ukprod/wp-content/uploads/2019/10/872f6798550fc9f2ab678402db20522d.jpg);
  // background-size: cover;
  // background-position: left;

  $menu-width: 300px;
  $player-width: calc(100vw - $menu-width);

  .menu {
    height: 100%;
    width: 300px;
    padding: $spacing-4;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1e1e1e;

    * {
      color: white !important;
    }

    .vmc-input {
      width: 100%;
    }

    .icons {
      margin-top: $spacing-5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      justify-content: left;

      .link {
        display: flex;
        padding: $spacing-3;
        align-items: center;
        gap: $spacing-2;
        font-size: 15px;
        transition: 0.2s;
        width: 100%;

        &:hover {
          background-color: $white;
          color: #1e1e1e !important;
          cursor: pointer;

          .icon {
            color: #1e1e1e !important;
          }
        }
      }
    }
  }

  .player {
    height: 100%;
    width: $player-width;
    padding: $spacing-5;

    background-color: #444444;
    // background-color: #dddddd;
    // backdrop-filter: blur(30px);

    * {
      color: white !important;
    }

    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .action {
        display: flex;
        gap: $spacing-2;

        .icon {
          transition: 0.2s;
          &:hover {
            cursor: pointer;
            transform: scale(1.2);
          }
        }
      }
    }

    .music-wrapper {
      overflow: hidden;
      $music-data-height: 350px;
      position: relative;
      width: 100%;
      height: $music-data-height;
      margin-top: $spacing-3;
      .slider {
        position: absolute;
        display: flex;
        gap: calc($spacing-5 * 2);
        height: 100%;
        top: 0;
        transition: 0.5s;
        left: calc(((100% + ($spacing-5 * 2)) * var(--current-music)) * -1);
        .music-data {
          display: flex;
          gap: $spacing-4;
          width: calc($player-width - $spacing-5 * 2);
          height: $music-data-height;

          img {
            width: $music-data-height;
            height: $music-data-height;
          }

          .meta {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: space-between;
          }
          .info {
            width: 100%;

            .title {
              font-size: 25px;
            }

            .from {
              font-size: 15px;
              text-decoration: underline;
              margin-top: $spacing-2;
            }

            .rating {
              display: flex;
              margin-top: $spacing-4;
              .icon {
                width: 15px;
              }
            }
          }
        }
      }
    }

    .media {
      margin-top: $spacing-4;
      padding-top: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .icons {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        .icon {
          transition: 0.2s;
          &.--small {
            margin: 0 $spacing-4;
            width: 15px !important;
            height: 15px !important;
          }

          &.--medium {
            width: 30px !important;
            height: 30px !important;
          }

          &.--large {
            margin: 0 $spacing-3;
            width: 40px !important;
            height: 40px !important;
          }

          &:hover {
            cursor: pointer;
            transform: scale(1.2);
          }
        }
      }

      .time {
        display: flex;
        margin-top: $spacing-3;
        align-items: center;
        gap: $spacing-3;

        .timeline {
          height: 7px;
          width: 400px;
          border-radius: 100px;
          background-color: grey;
        }
      }
    }
  }
}
</style>
