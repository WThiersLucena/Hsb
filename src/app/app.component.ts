import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  currentImageIndex = 0;
  carouselInterval: any;
  isMobile = false;
  menuOpen = false;
  headerVisible = true;
  lastScrollTop = 0;
  presentationAnimated = false;
  
  // Imagens do carrossel - todas as imagens de hbs exceto Image-10 e Image-11
  carouselImages: string[] = [
    'assets/hbs/Image-01.jpeg',
    'assets/hbs/Image-02.jpeg',
    'assets/hbs/Image-03.jpeg',
    'assets/hbs/Image-04.jpeg',
    'assets/hbs/Image-05.jpeg',
    'assets/hbs/Image-06.jpeg',
    'assets/hbs/Image-07.jpeg',
    'assets/hbs/Image-08.jpeg',
    'assets/hbs/Image-09.jpeg',
    'assets/hbs/Image-12.jpeg',
    'assets/hbs/Image-13.jpeg',
    'assets/hbs/Image-14.jpeg'
  ];

  // Patrocinadores - 12 espaços, 5 preenchidos
  sponsors = [
    { 
      name: 'Garage', 
      logo: 'assets/patrocinadores/garage.webp',
      url: 'https://lp.grupostation.com.br/?gad_source=1&gad_campaignid=23269422909&gbraid=0AAAABCB1I9xv3kSsJX7X2KUHgapLwtfli&gclid=CjwKCAiAssfLBhBDEiwAcLpwfkDVTHtlG7-qkydQoHkYq0eC6c2jm6eKO0wIcb-45wAi9fCFXXl1ZRoCBrkQAvD_BwE'
    },
    { 
      name: 'Soluções em Tecnologia', 
      logo: 'assets/patrocinadores/Logo-Sem-Fundo.png',
      url: 'https://thiers.vercel.app/'
    },
    { 
      name: 'Vereador Juvenildo', 
      logo: 'assets/patrocinadores/Pratoc-02.jpeg',
      url: 'https://www.instagram.com/vereador_juvenildo_barboza?igsh=MWFocGVwNWZ3YmQ1dg%3D%3D&utm_source=qr'
    },
    { 
      name: 'Vereador Thiago Urso', 
      logo: 'assets/patrocinadores/Pratoc-01.jpeg',
      url: 'https://www.instagram.com/tiagoursaooficial?igsh=MTd2Nnp6bmJweHptNA=='
    },
    { 
      name: 'Vereador Caio Mãos Solidarias', 
      logo: 'assets/patrocinadores/Pratoc-03.png',
      url: null
    },
    { name: null, logo: null, url: null }, // 6
    { name: null, logo: null, url: null }, // 7
    { name: null, logo: null, url: null }, // 8
    { name: null, logo: null, url: null }, // 9
    { name: null, logo: null, url: null }, // 10
    { name: null, logo: null, url: null }, // 11
    { name: null, logo: null, url: null }  // 12
  ];

  filledSponsors = 5;

  @ViewChild('textBlock1') textBlock1!: ElementRef;
  @ViewChild('textBlock2') textBlock2!: ElementRef;
  @ViewChild('textBlock3') textBlock3!: ElementRef;

  ngOnInit() {
    // Verificar se é mobile
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    
    // Iniciar animação de apresentação
    setTimeout(() => {
      this.presentationAnimated = true;
      // Iniciar carrossel automático após animação se for mobile
      if (this.isMobile) {
        setTimeout(() => {
          this.startAutoCarousel();
        }, 1600);
      }
    }, 100);
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.startAutoCarousel();
    } else {
      this.stopAutoCarousel();
    }
  }

  startAutoCarousel() {
    this.stopAutoCarousel(); // Limpar intervalo anterior se existir
    this.carouselInterval = setInterval(() => {
      this.nextImage();
    }, 3000); // 3 segundos
  }

  stopAutoCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  ngOnDestroy() {
    this.stopAutoCarousel();
    window.removeEventListener('resize', () => this.checkMobile());
  }

  ngAfterViewInit() {
    // Aguardar um pouco para garantir que o DOM está totalmente renderizado
    setTimeout(() => {
      this.initScrollObservers();
    }, 100);
  }

  initScrollObservers() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Opcional: parar de observar após aparecer para melhor performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar os blocos de texto
    if (this.textBlock1?.nativeElement) {
      observer.observe(this.textBlock1.nativeElement);
    }
    if (this.textBlock2?.nativeElement) {
      observer.observe(this.textBlock2.nativeElement);
    }
    if (this.textBlock3?.nativeElement) {
      observer.observe(this.textBlock3.nativeElement);
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    // Não esconder header se menu mobile estiver aberto
    if (this.menuOpen) {
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Se estiver no topo, sempre mostra o header
    if (scrollTop <= 50) {
      this.headerVisible = true;
      this.lastScrollTop = scrollTop;
      return;
    }
    
    // Verifica se rolou para baixo
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      // Rolando para baixo - esconde o header
      this.headerVisible = false;
    } else if (scrollTop < this.lastScrollTop) {
      // Rolando para cima - mostra o header
      this.headerVisible = true;
    }
    
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    // Reiniciar auto-carrossel se for mobile
    if (this.isMobile) {
      this.stopAutoCarousel();
      this.startAutoCarousel();
    }
  }

  previousImage() {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.carouselImages.length - 1 
      : this.currentImageIndex - 1;
    // Reiniciar auto-carrossel se for mobile
    if (this.isMobile) {
      this.stopAutoCarousel();
      this.startAutoCarousel();
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
    // Reiniciar auto-carrossel se for mobile
    if (this.isMobile) {
      this.stopAutoCarousel();
      this.startAutoCarousel();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    // Garantir que header esteja visível quando menu abrir
    if (this.menuOpen) {
      this.headerVisible = true;
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
