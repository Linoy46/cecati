import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css']
})
export class TablasComponent implements OnInit {

  ngOnInit() {
    const buttons = document.querySelectorAll('.accordion-button');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        if (content) {
          const isActive = (content as HTMLElement).style.display === 'block';

          document.querySelectorAll('.accordion-content').forEach(content => {
            (content as HTMLElement).style.display = 'none';
          });

          document.querySelectorAll('.accordion-button').forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('.icon');
            if (icon) {
              icon.textContent = '▼';
            }
          });

          if (!isActive) {
            button.classList.add('active');
            (content as HTMLElement).style.display = 'block';
            const icon = button.querySelector('.icon');
            if (icon) {
              icon.textContent = '▲';
            }
          }
        }
      });
    });
  }
}