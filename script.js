// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTopBtn = document.getElementById('backToTop');
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');
const contactForm = document.getElementById('contactForm');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
const body = document.body;
const allImages = document.querySelectorAll('img');

// Preload images for better performance
function preloadImages() {
  allImages.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
      const newImg = new Image();
      newImg.src = src;
      img.classList.add('lazy-load');
      newImg.onload = () => {
        img.classList.add('loaded');
      };
      
      // Fallback if image fails to load
      img.addEventListener('error', function() {
        this.src = 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        this.classList.add('loaded');
      });
    }
  });
}

// Scroll Event Listener with debounce for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      // Header scroll effect
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Back to top button
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }

      // Reveal animations on scroll
      const revealElements = document.querySelectorAll('.reveal-from-left, .reveal-from-right, .reveal-from-bottom');
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.classList.add('reveal-active');
        }
      });
      
      scrollTimeout = null;
    }, 10);
  }
});

// Mobile Menu Toggle with improved accessibility
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  body.classList.toggle('menu-open');
  
  // Improve accessibility
  if (menuToggle.classList.contains('active')) {
    menuToggle.setAttribute('aria-expanded', 'true');
  } else {
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') && 
      !e.target.closest('.nav-links') && 
      !e.target.closest('.menu-toggle')) {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Back to Top Button with smooth scroll
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Product Category Filter with animation
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    categoryBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    const category = btn.getAttribute('data-category');
    
    // Filter products with animation
    productCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.classList.remove('hide');
        setTimeout(() => {
          card.style.display = 'block';
        }, 500);
      } else {
        card.classList.add('hide');
        setTimeout(() => {
          card.style.display = 'none';
        }, 500);
      }
    });
  });
});

// Contact Form Submission with validation
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    
    // Here you would typically send the form data to a server
    // For demo purposes, we'll just log it and show an alert
    console.log({ name, email, phone, subject, message });
    
    // Show success message
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    
    // Reset form
    contactForm.reset();
  });
}

// Testimonials Slider with improved UX
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
  // Hide all testimonials
  testimonialCards.forEach(card => {
    card.classList.remove('active');
  });
  
  // Remove active class from all dots
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Show the selected testimonial
  testimonialCards[index].classList.add('active');
  
  // Add active class to the corresponding dot
  dots[index].classList.add('active');
  
  // Update current testimonial index
  currentTestimonial = index;
}

// Next button click
nextBtn.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
  resetAutoSlide();
});

// Previous button click
prevBtn.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(currentTestimonial);
  resetAutoSlide();
});

// Dot click
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showTestimonial(index);
    resetAutoSlide();
  });
});

// Swipe functionality for testimonials on mobile with improved detection
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
const testimonialsSlider = document.querySelector('.testimonials-slider');

if (testimonialsSlider) {
  testimonialsSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  testimonialsSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const xDiff = touchEndX - touchStartX;
    const yDiff = touchEndY - touchStartY;
    
    // Only detect horizontal swipes (ignore vertical scrolling)
    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 50) {
      if (xDiff < 0) {
        // Swipe left, show next
        nextBtn.click();
      } else {
        // Swipe right, show previous
        prevBtn.click();
      }
    }
  }
}

// Auto slide testimonials with reset on interaction
function startAutoSlide() {
  testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(testimonialInterval);
  startAutoSlide();
}

// Stop auto slide on hover or touch
if (testimonialsSlider) {
  testimonialsSlider.addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
  });
  
  testimonialsSlider.addEventListener('mouseleave', () => {
    startAutoSlide();
  });
  
  testimonialsSlider.addEventListener('touchstart', () => {
    clearInterval(testimonialInterval);
  }, { passive: true });
  
  testimonialsSlider.addEventListener('touchend', () => {
    startAutoSlide();
  }, { passive: true });
}

// Newsletter Form Submission with validation
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get email value
    const email = newsletterForm.querySelector('input').value;
    
    // Simple validation
    if (!email) {
      alert('يرجى إدخال بريد إلكتروني');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    
    // Here you would typically send the email to a server
    // For demo purposes, we'll just log it and show an alert
    console.log({ email });
    
    // Show success message
    alert('تم الاشتراك في النشرة الإخبارية بنجاح!');
    
    // Reset form
    newsletterForm.reset();
  });
}

// Fix for iOS 100vh issue
function setVhProperty() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the property on initial load
setVhProperty();

// Update the property on resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      setVhProperty();
      resizeTimeout = null;
    }, 250);
  }
});

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
  // Preload images
  preloadImages();
  
  // Show first testimonial
  showTestimonial(0);
  
  // Start auto slide for testimonials
  startAutoSlide();
  
  // Trigger scroll event to check for elements in view on page load
  window.dispatchEvent(new Event('scroll'));
  
  // Add active class to the first nav link
  document.querySelector('.nav-links a').classList.add('active');
  
  // Update active nav link on scroll with improved performance
  const sections = document.querySelectorAll('section[id]');
  
  let scrollTimeoutNav;
  window.addEventListener('scroll', () => {
    if (!scrollTimeoutNav) {
      scrollTimeoutNav = setTimeout(() => {
        let current = '';
        let minDistance = Infinity;
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          const scrollPosition = window.scrollY + 200;
          
          // Find the closest section to the current scroll position
          if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            const distance = Math.abs(scrollPosition - (sectionTop + sectionHeight / 2));
            if (distance < minDistance) {
              minDistance = distance;
              current = section.getAttribute('id');
            }
          }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
        
        scrollTimeoutNav = null;
      }, 100);
    }
  });
  
  // Add accessibility attributes
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'القائمة');
  
  // Add keyboard navigation for product categories
  categoryBtns.forEach(btn => {
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
  
  // Add keyboard navigation for testimonial controls
  prevBtn.setAttribute('aria-label', 'السابق');
  nextBtn.setAttribute('aria-label', 'التالي');
  
  dots.forEach((dot, index) => {
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `الشهادة ${index + 1}`);
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dot.click();
      }
    });
  });
  
  // Add keyboard navigation for back to top button
  backToTopBtn.setAttribute('aria-label', 'العودة إلى الأعلى');
  
  // Fix for images not loading properly on some mobile devices
  allImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    }
  });
});

// Prevent zoom on double tap for iOS devices
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add intersection observer for better performance
if ('IntersectionObserver' in window) {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal-from-left') || 
            entry.target.classList.contains('reveal-from-right') || 
            entry.target.classList.contains('reveal-from-bottom')) {
          entry.target.classList.add('reveal-active');
        }
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with reveal classes
  document.querySelectorAll('.reveal-from-left, .reveal-from-right, .reveal-from-bottom').forEach(el => {
    observer.observe(el);
  });
}

// Add parallax effect for supported devices
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Apply parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.style.backgroundPositionY = `${scrollPosition * 0.1}px`;
    }
    
    // Apply parallax effect to other sections
    const parallaxSections = document.querySelectorAll('.about, .services, .game-downloads');
    parallaxSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition > sectionTop - window.innerHeight && 
          scrollPosition < sectionTop + sectionHeight) {
        const yPos = (scrollPosition - sectionTop) * 0.05;
        section.style.backgroundPositionY = `${yPos}px`;
      }
    });
  });
}

// Add support for dark mode toggle if needed
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDarkScheme.matches) {
  document.body.classList.add('dark-mode');
}

// Fix for iOS Safari 100vh issue
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
});
function checkDeviceAndRedirect() {
  const isLargeDevice = window.innerWidth >= 768;
  if (isLargeDevice && !window.location.pathname.includes('index2.html')) {
    window.location.href = 'index2.html';
  }
  if (!isLargeDevice && window.location.pathname.includes('index2.html')) {
    window.location.href = 'index.html';
  }
}
window.addEventListener('DOMContentLoaded', checkDeviceAndRedirect);
window.addEventListener('resize', checkDeviceAndRedirect);