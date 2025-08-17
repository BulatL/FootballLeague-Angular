import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-season-leaders',
  imports: [NgFor, CommonModule],
  templateUrl: './season-leaders.component.html',
  styleUrl: './season-leaders.component.css'
})
export class SeasonLeadersComponent implements OnInit {
sevenGoalPlayers = [
    { name: 'Boris Lazarević', team: 'Vulkan Kać' },
    { name: 'Veselin Guberinić', team: 'nSpark app' },
    { name: 'Ognjen Borovnica', team: 'Medicinari' },
    { name: 'Stefan Bosnić', team: 'Imperial Buildings' },
    { name: 'Čedomír Tomčić', team: 'nSpark app' },
    { name: 'Drožen Lučanović', team: 'nSpark app' },
    { name: 'Ersad Hadija', team: 'SO Taman' },
    { name: 'Jovan Bobar', team: 'JGSP Nezavisnost' }
  ];

  eightGoalPlayers = [
    { name: 'Ersad Hadija', team: 'SO Taman' },
    { name: 'Jovan Bobar', team: 'JGSP Nezavisnost' }
  ];

  // players = [
  //   { name: 'Stefan Bosnić', team: 'Imperial Buildings', goals: 16, image: 'default-player.png' },
  //   { name: 'Obrad Jašić', team: 'Imperial Buildings', goals: 12, image: 'default-player.png' },
  //   { name: 'Marko Burka', team: 'Eastern', goals: 10, image: 'default-player.png' },
  //   { name: 'Srđan Stanić', team: 'NS Union Tehnika', goals: 10, image: 'default-player.png' },
  //   { name: 'Dušan Sikiric', team: 'Eastern', goals: 10, image: 'default-player.png' },
  //   { name: 'Veselin Guberinić', team: 'nSpark app', goals: 9, image: 'default-player.png' },
  //   { name: 'Marko Vujović', team: 'nSpark app', goals: 9, image: 'default-player.png' },
  //   { name: 'Nemanja Jevtić', team: 'Intraspekt Norma Petrol', goals: 9, image: 'default-player.png' },
  // ];

  // topPlayer = {
  //   firstName: 'Ognjen',
  //   lastName: 'Borovnica',
  //   goals: 21,
  //   image: 'default-player.png'
  // };

  category: string = 'goal';
  topPlayer: any = null;
  players: any[] = [];
  

  ngOnInit(): void {
    this.loadCategoryData();
  }

  selectCategory(category: string): void {
    this.category = category;
    this.loadCategoryData();
  }

  hasLeaderData(): boolean {
    return this.topPlayer && this.players && this.players.length > 0;
  }

  getCategoryTitle(): string {
    switch (this.category) {
      case 'goal': return 'Top Strelci';
      case 'assist': return 'Top Asistenti';
      case 'points': return 'Top Odbrane';
      default: return 'Top Igrači';
    }
  }

  getTopPlayerScore(): number {
    if (!this.topPlayer) return 0;
    switch (this.category) {
      case 'goal': return this.topPlayer.goals || 0;
      case 'assist': return this.topPlayer.assists || 0;
      case 'points': return this.topPlayer.saves || 0;
      default: return 0;
    }
  }

  getPlayerScore(player: any): number {
    switch (this.category) {
      case 'goal': return player.goals || 0;
      case 'assist': return player.assists || 0;
      case 'points': return player.saves || 0;
      default: return 0;
    }
  }

  getNoDataMessage(): string {
    switch (this.category) {
      case 'goal': return 'Još uvek nema golova u ovoj sezoni. Sačekajte prve utakmice!';
      case 'assist': return 'Još uvek nema asistencija u ovoj sezoni. Sačekajte prve utakmice!';
      case 'points': return 'Još uvek nema odbrana u ovoj sezoni. Sačekajte prve utakmice!';
      default: return 'Podaci će biti dostupni nakon prvih utakmica.';
    }
  }

  private loadCategoryData(): void {
    // Load data based on selected category
    // Set topPlayer and players based on API response
    // If no data, set them to null/empty array
  }
}
