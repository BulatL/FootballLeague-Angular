import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-season-leaders',
  imports: [NgFor],
  templateUrl: './season-leaders.component.html',
  styleUrl: './season-leaders.component.css'
})
export class SeasonLeadersComponent {
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

  players = [
    { name: 'Stefan Bosnić', team: 'Imperial Buildings', goals: 16, image: 'default-player.png' },
    { name: 'Obrad Jašić', team: 'Imperial Buildings', goals: 12, image: 'default-player.png' },
    { name: 'Marko Burka', team: 'Eastern', goals: 10, image: 'default-player.png' },
    { name: 'Srđan Stanić', team: 'NS Union Tehnika', goals: 10, image: 'default-player.png' },
    { name: 'Dušan Sikiric', team: 'Eastern', goals: 10, image: 'default-player.png' },
    { name: 'Veselin Guberinić', team: 'nSpark app', goals: 9, image: 'default-player.png' },
    { name: 'Marko Vujović', team: 'nSpark app', goals: 9, image: 'default-player.png' },
    { name: 'Nemanja Jevtić', team: 'Intraspekt Norma Petrol', goals: 9, image: 'default-player.png' },
  ];

  topPlayer = {
    firstName: 'Ognjen',
    lastName: 'Borovnica',
    goals: 21,
    image: 'default-player.png'
  };
  
  category = 'goal';

   selectCategory(category: string) {
    this.category = category;
    // TODO: Fetch or update `topPlayer` and `players` based on `category`
    // This is where you'd call your API or update the data manually
    console.log('Selected category:', category);
  }
}
