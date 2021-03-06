import { ResponseTypeFromServiceReq } from 'src/app/typings/index';
import { SongListService } from 'src/app/services/song-list.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit {
  songList: ResponseTypeFromServiceReq<
    typeof SongListService,
    'fetchSongList'
  > = [];

  constructor(private songListService: SongListService) {}

  async ngOnInit(): Promise<void> {
    if (this.songList.length === 0) {
      this.songList = await this.songListService.fetchSongList();
    }
  }
}
