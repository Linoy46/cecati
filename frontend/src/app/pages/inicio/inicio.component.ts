import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [CommonModule], // Add CommonModule to the imports array
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']  // Corrected styleUrl to styleUrls (plural)
})
export class InicioComponent {
    galleries: { [key: number]: string[] } = {
        1: ['assets/Administración/Imagen1.jpg', 'assets/Administración/Imagen2.jpg', 'assets/Administración/Imagen3.jpg'],
        2: ['assets/Alimentos/Imagen1.jpg', 'assets/Alimentos/Imagen2.jpg', 'assets/Alimentos/Imagen3.jpg', 'assets/Alimentos/Imagen4.jpg', 'assets/Alimentos/Imagen5.jpg', 'assets/Alimentos/Imagen6.jpg', 'assets/Alimentos/Imagen7.jpg', 'assets/Alimentos/Imagen8.jpg', 'assets/Alimentos/Imagen9.jpg', 'assets/Alimentos/Imagen10.jpg'],
        3: ['assets/Normas/Imagen1.jpg', 'assets/Normas/Imagen2.jpg', 'assets/Normas/Imagen3.jpg', 'assets/Normas/Imagen4.jpg', 'assets/Normas/Imagen5.jpg', 'assets/Normas/Imagen6.jpg', 'assets/Normas/Imagen7.jpg', 'assets/Normas/Imagen8.jpg', 'assets/Normas/Imagen9.jpg', 'assets/Normas/Imagen10.jpg', 'assets/Normas/Imagen11.jpg'],
        4: ['assets/Ejecutiva/Imagen1.jpeg', 'assets/Ejecutiva/Imagen2.jpeg', 'assets/Ejecutiva/Imagen3.jpeg'],
        5: ['assets/Prendas/Imagen1.jpg', 'assets/Prendas/Imagen2.jpg', 'assets/Prendas/Imagen3.jpg', 'assets/Prendas/Imagen4.jpg', 'assets/Prendas/Imagen5.jpg', 'assets/Prendas/Imagen6.jpg', 'assets/Prendas/Imagen7.jpg', 'assets/Prendas/Imagen8.jpg', 'assets/Prendas/Imagen9.jpg', 'assets/Prendas/Imagen10.jpg', 'assets/Prendas/Imagen11.jpg', 'assets/Prendas/Imagen12.jpg'],
        7: ['assets/Moda/Imagen1.jpg', 'assets/Moda/Imagen2.jpg', 'assets/Moda/Imagen3.jpg', 'assets/Moda/Imagen4.jpg'],
        8: ['assets/DibujoIndustrial/Imagen1.jpg', 'assets/DibujoIndustrial/Imagen2.jpeg', 'assets/DibujoIndustrial/Imagen3.jpeg', 'assets/DibujoIndustrial/Imagen4.jpeg'],
        9: ['assets/Estilismo/Imagen1.jpg', 'assets/Estilismo/Imagen2.jpg', 'assets/Estilismo/Imagen3.jpg'],
        11: ['assets/SoporteTecnico/Imagen1.jpg', 'assets/SoporteTecnico/Imagen2.jpg', 'assets/SoporteTecnico/Imagen3.jpg'],
        12: ['assets/LenguaInglesa/Imagen1.jpg', 'assets/LenguaInglesa/Imagen2.jpg', 'assets/LenguaInglesa/Imagen3.jpg'],
        13: ['assets/Informatica/Imagen1.jpg', 'assets/Informatica/Imagen2.jpg', 'assets/Informatica/Imagen3.jpg', 'assets/Informatica/Imagen4.jpg'],
    };

    selectedGallery: string[] = [];
    lightboxImageSrc: string = '';
    isGalleryOpen = false;
    isLightboxOpen = false;

    openGallery(id: number): void {
        this.selectedGallery = this.galleries[id] || [];
        this.isGalleryOpen = true;
    }

    closeGallery(event: MouseEvent): void {
      // Only close if the click target is the gallery container itself OR the close area
        if (event.target instanceof Element &&
            (event.target.id === 'gallery' || event.target.classList.contains('close-area'))) {
            this.isGalleryOpen = false;
        }
    }


    openLightbox(src: string, event: MouseEvent): void {
        event.stopPropagation(); // Prevent gallery from closing
        this.lightboxImageSrc = src;
        this.isLightboxOpen = true;
    }


      closeLightbox(event: MouseEvent): void {
        // Check if the click target is the lightbox container itself OR the close area
        if (event.target instanceof Element &&
            (event.target.id === 'lightbox' || event.target.classList.contains('close-area'))) {
            this.isLightboxOpen = false;
        }
    }
}