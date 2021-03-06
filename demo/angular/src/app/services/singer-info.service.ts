import { replaceSizeInUrl } from 'src/app/utils';
import { BASE_ORIGIN } from 'src/app/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

type SingerInfoResponse = {
  info: {
    singerid: number;
    singername: string;
    songcount: number;
    albumcount: number;
    imgurl: string;
    intro: string;
  };
  songs: {
    list: { filename: string; name: string }[];
  };
};

@Injectable({
  providedIn: 'root',
})
export class SingerInfoService {
  singerInfoUrl = `${BASE_ORIGIN}/singer/info`;

  constructor(private http: HttpClient) {}

  async fetchSingerInfo(singerId: string) {
    const response = await this.http
      .get<SingerInfoResponse>(`${this.singerInfoUrl  }/${singerId}&json=true`)
      .toPromise();
    const { info, songs } = response;

    const singerInfo = {
      info: {
        id: info.singerid,
        name: info.singername,
        count: info.songcount,
        albumcount: info.albumcount,
        imgUrl: replaceSizeInUrl(info.imgurl),
        intro: info.intro,
      },
      data: songs.list,
    };
    songs.list.forEach((obj) => {
      obj.name = obj.filename;
    });
    return singerInfo;
  }
}
