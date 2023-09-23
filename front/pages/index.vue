<template>
  <section id="home-page">
    <!-- MENU -->
    <section class="menu">
      <h4 class="title">Music</h4>

      <eth-input type="text" :model-value="'Stole The Show'" :icon="['fas', 'magnifying-glass']" theme="dark" />

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
        <button class="btn_call-to-action --inverted">Tell us who is the author</button>
        <div class="action">
          <fa class="icon" :icon="['fas', 'caret-down']" />
          <fa class="icon" :icon="['fas', 'expand']" />
          <fa class="icon" :icon="['fas', 'close']" />
        </div>
      </div>
      <div class="music-data">
        <img src="https://dh22twu0ekfg6.cloudfront.net/media/auction_house/assets/31638/Auction%20Image%20-%20PJ.png" alt="" />
        <div class="meta">
          <div class="info">
            <h4 class="title">Stole The Show</h4>
            <p class="from">DJ Super Cool</p>
            <p class="rating">
              <fa class="icon" :icon="['fas', 'star']" />
              <fa class="icon" :icon="['fas', 'star']" />
              <fa class="icon" :icon="['fas', 'star']" />
              <fa class="icon" :icon="['far', 'star']" />
              <fa class="icon" :icon="['far', 'star']" />
            </p>
          </div>

          <div class="report"></div>
        </div>
      </div>

      <div class="media">
        <div class="icons">
          <fa class="icon --small" :icon="['fas', 'shuffle']" />
          <fa class="icon --medium" :icon="['far', 'circle-left']" />
          <fa class="icon --large" :icon="['fas', 'play']" />
          <fa class="icon --medium" :icon="['far', 'circle-right']" />
          <fa class="icon --small" :icon="['fas', 'rotate-left']" />
        </div>
        <div class="time">
          <p class="current">0:00</p>
          <div class="timeline"></div>
          <p class="of">3:30</p>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
#home-page {
  display: flex;
  height: calc(100vh - 60px);
  // background-image: url(https://cdn.smehost.net/2020sonymusiccouk-ukprod/wp-content/uploads/2019/10/872f6798550fc9f2ab678402db20522d.jpg);
  // background-size: cover;
  // background-position: left;

  .menu {
    height: 100%;
    width: 400px;
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
    width: 100%;
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

    .music-data {
      margin-top: $spacing-3;
      display: flex;
      gap: $spacing-4;
      width: 100%;

      img {
        width: 350px;
        height: 350px;
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
