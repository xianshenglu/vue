import { HttpClient } from '@angular/common/http';
import { KU_GOU_ORIGIN, BASE_ORIGIN } from 'src/app/constants';
import { Injectable } from '@angular/core';
import { replaceSizeInUrl } from 'src/app/utils';
import { DeviceService } from './device.service';

export type Music = {
  hash: string;
  filename: string;
};
type Song = {
  hash: string;
  img: string;
  // @ts-ignore
  // eslint-disable-next-line
  play_url: string;
};
@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  musicList: Music[] = [];

  music: Music | null = null; // music info without playUrl, singerImg and some key info.

  song: Song | null = null; // music with  playUrl, singerImg and some key info.

  lyrics = '';

  audioEl: HTMLAudioElement | null = null;

  isLoading = false;

  isPlaying = false;

  isPlayerMedShow = false;

  isPlayerMedSmall = false;

  curPlayerId = 0;

  get getCurMusicIndex() {
    return this.song === null
      ? -1
      : this.musicList.findIndex((music) => music.hash === this.song?.hash);
  }

  // todo getters got triggered when target component hasn't render?
  get singerImg() {
    if (this.song === null || !this.song.img) {
      return '';
    }
    return replaceSizeInUrl(this.song.img, 400);
  }

  get singerName() {
    return this.music && this.music.filename.split('-')[0].trim();
  }

  get songName() {
    return this.music && this.music.filename.split('-')[1].trim();
  }

  get lyricItems() {
    const lyricsArr = this.lyrics.split(/\n/);
    lyricsArr.pop();
    return lyricsArr.map((text) => {
      const arr = text.replace('[', '').split(']');
      const time = arr[0];
      const min = time.split(':')[0];
      const sec = time.split(':')[1].split('.')[0];
      const millisecond = time.split(':')[1].split('.')[1];
      return {
        millisecond:
          Number(min) * 60 * 1000 + Number(sec) * 1000 + Number(millisecond),
        text: arr[1].trim().replace(/(男[:：]\s*)|(女[:：]\s*)/, ''),
      };
    });
  }

  constructor(private http: HttpClient, private device: DeviceService) {}

  findAudioEl(el: HTMLAudioElement) {
    this.audioEl = el;
  }

  wantPlay({
    music,
    musicList = this.musicList,
  }: {
    music: Music;
    musicList?: Music[];
  }) {
    if (this.music && music.hash === this.music.hash) {
      return;
    }
    this.music = music;
    this.isLoading = true;
    this.isPlayerMedSmall = false;
    // when resize event was triggered, PlayerMed will show
    if (window.innerHeight > this.device.vMax * 0.8) {
      this.isPlayerMedShow = true;
    }
    this.fetchMusic({ musicHash: music.hash, musicList });
  }

  togglePlay(status = !this.isPlaying) {
    if (status) {
      this.isLoading = false;
      const playState = this.audioEl?.play();
      if (typeof playState !== 'undefined') {
        playState
          .then(() => {
            this.isPlaying = true;
          })
          .catch(() => {
            this.audioEl?.pause();
            this.isPlaying = false;
          });
      }
    } else {
      this.audioEl?.pause();
      this.isPlaying = false;
    }
  }

  next() {
    let index = this.getCurMusicIndex;
    if (index < 0) {
      return;
    }
    index = index === this.musicList.length - 1 ? -1 : index;
    this.wantPlay({
      music: this.musicList[index + 1],
    });
  }

  prev() {
    let index = this.getCurMusicIndex;
    if (index < 0) {
      return;
    }
    index = index === 0 ? this.musicList.length : index;
    this.wantPlay({
      music: this.musicList[index - 1],
    });
  }

  togglePlayers(from: 0 | 1) {
    // eslint-disable-next-line default-case
    switch (from) {
      case 0:
        this.curPlayerId = 1;
        break;
      case 1:
        this.curPlayerId = 0;
        break;
    }
  }

  fetchMusic({
    musicHash,
    musicList,
  }: {
    musicHash: string;
    musicList: Music[];
  }) {
    const res = this.fetchSongLyric({ hash: musicHash });
    /* eslint-disable */
    //  @ts-ignore
    const { data } = res.data;
    musicList = musicList.length === 0 ? [data] : musicList;
    this.musicList = musicList;
    this.lyrics = data.lyrics;
    this.song = data;
    /* eslint-enable */
  }

  fetchSongLyric(params = {}) {
    return this.http.request('GET', `${KU_GOU_ORIGIN}/yy/index.php`, {
      params: { r: 'play/getdata', ...params },
    });
  }

  fetchSongInfo(params = {}) {
    return this.http.request('GET', `${BASE_ORIGIN}/app/i/getSongInfo.php`, {
      params: { cmd: 'playInfo', ...params },
    });
  }
}
