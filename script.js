
        // ========== CONFIGURATION EMAILJS ==========
        emailjs.init("vLZu0CFGbGutQb0xR");

        // Mobile Navigation
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Testimonial Slider
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.slider-dot');
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            testimonials[index].classList.add('active');
            dots[index].classList.add('active');
            currentTestimonial = index;
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showTestimonial(index);
            });
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        
        // Gallery Lightbox
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = document.querySelector('.lightbox img');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                lightboxImg.setAttribute('src', imgSrc);
                lightbox.classList.add('active');
            });
        });
        
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
        
        // Initialize Map
        function initMap() {
            // Coordinates for Nzopi, Faradje (approximate)
            const nzopi = [3.2790812, 29.5878590];
            
            const map = L.map('map').setView(nzopi, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            L.marker(nzopi).addTo(map)
                .bindPopup('Minoterie de Nzopi<br>Territoire de Faradje, Haut-Uélé')
                .openPopup();
        }
        
        // Initialize map when page loads
        window.addEventListener('load', initMap);

        // ========== SYSTÈME DE COMMANDE (NOUVEAU) ==========
        
        // Order Form Functionality
        const quantityInputs = document.querySelectorAll('.quantity-control input');
        const decreaseBtns = document.querySelectorAll('.quantity-control .decrease');
        const increaseBtns = document.querySelectorAll('.quantity-control .increase');
        const orderTotal = document.getElementById('order-total');
        
        function updateOrderTotal() {
            let total = 0;
            
            quantityInputs.forEach(input => {
                const quantity = parseInt(input.value);
                const price = parseFloat(input.getAttribute('data-price'));
                total += quantity * price;
            });
            
            orderTotal.textContent = total.toFixed(2);
        }
        
        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.nextElementSibling;
                if (parseInt(input.value) > 0) {
                    input.value = parseInt(input.value) - 1;
                    updateOrderTotal();
                }
            });
        });
        
        increaseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                input.value = parseInt(input.value) + 1;
                updateOrderTotal();
            });
        });
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', updateOrderTotal);
        });
        
        // ========== FORMULAIRE CONTACTEZ-NOUS ==========

        const contactForm = document.getElementById('contactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Afficher le chargement
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                submitBtn.disabled = true;
                
                try {
                    // Récupérer les valeurs du formulaire
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const phone = document.getElementById('phone').value;
                    const subject = document.getElementById('subject').value;
                    const message = document.getElementById('message').value;
                    
                    // Paramètres pour EmailJS
                    const templateParams = {
                        to_email: 'kosianzopi@yahoo.com',
                        from_name: name,
                        from_email: email,
                        client_phone: phone || 'Non renseigné',
                        subject: subject,
                        message: message,
                        date: new Date().toLocaleString('fr-FR')
                    };
                    
                    // Envoyer l'email via EmailJS
                    const response = await emailjs.send(
                        'service_jhn0kqf', // Votre Service ID
                        'template_62js3zp', // Votre Template ID pour contact
                        templateParams
                    );
                    
                    // Succès
                    alert(`✅ Message envoyé avec succès, ${name} !\n\nNous vous répondrons dans les plus brefs délais à l'adresse ${email}.`);
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                    
                } catch (error) {
                    console.error('Erreur envoi message:', error);
                    alert('❌ Une erreur est survenue lors de l\'envoi du message.\n\nVeuillez nous appeler directement au +243 821 363 626.');
                } finally {
                    // Réactiver le bouton
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
            

        // ========== SYSTÈME DE COMMANDE EMAIL + WHATSAPP ==========
        
        // Fonction principale de soumission de commande
        async function submitOrder(event) {
            event.preventDefault();
            
            // Validation du formulaire
            if (!validateOrderForm()) {
                return;
            }
            
            // Collecte des données
            const orderData = collectOrderData();
            
            try {
                // Afficher un indicateur de chargement
                showLoading(true);
                
                // Envoi simultané Email + WhatsApp
                await Promise.all([
                    sendEmailNotification(orderData),
                    sendWhatsAppNotification(orderData) // CORRIGÉ : utilise sendWhatsAppNotification
                ]);
                
                // Succès
                showSuccessMessage();
                resetOrderForm();
                
            } catch (error) {
                console.error('Erreur envoi commande:', error);
                // Fallback - au moins WhatsApp va fonctionner
                sendWhatsAppNotification(orderData);
                showSuccessMessage();
                resetOrderForm();
            } finally {
                showLoading(false);
            }
        }

        // Validation du formulaire de commande
        function validateOrderForm() {
            const name = document.getElementById('order-name').value.trim();
            const phone = document.getElementById('order-phone').value.trim();
            const address = document.getElementById('order-address').value.trim();
            
            if (!name) {
                alert('Veuillez entrer votre nom complet.');
                document.getElementById('order-name').focus();
                return false;
            }
            
            if (!phone) {
                alert('Veuillez entrer votre numéro de téléphone.');
                document.getElementById('order-phone').focus();
                return false;
            }
            
            if (!address) {
                alert('Veuillez entrer votre adresse de livraison.');
                document.getElementById('order-address').focus();
                return false;
            }
            
            // Vérifier qu'au moins un produit est commandé
            const hasItems = Array.from(document.querySelectorAll('.quantity-control input'))
                .some(input => parseInt(input.value) > 0);
            
            if (!hasItems) {
                alert('Veuillez sélectionner au moins un produit.');
                return false;
            }
            
            return true;
        }

        // Collecte des données de commande
        function collectOrderData() {
            const items = [];
            const quantityInputs = document.querySelectorAll('.quantity-control input');
            
            quantityInputs.forEach(input => {
                const quantity = parseInt(input.value);
                if (quantity > 0) {
                    items.push({
                        name: input.getAttribute('data-name'),
                        quantity: quantity,
                        price: parseFloat(input.getAttribute('data-price')),
                        total: (quantity * parseFloat(input.getAttribute('data-price'))).toFixed(2)
                    });
                }
            });
            
            return {
                name: document.getElementById('order-name').value.trim(),
                email: document.getElementById('order-email').value.trim(),
                phone: document.getElementById('order-phone').value.trim(),
                address: document.getElementById('order-address').value.trim(),
                message: document.getElementById('order-message').value.trim(),
                items: items,
                total: document.getElementById('order-total').textContent,
                date: new Date().toLocaleString('fr-FR'),
                timestamp: new Date().toISOString()
            };
        }

        // Envoi par Email avec EmailJS
        async function sendEmailNotification(orderData) {
            const templateParams = {
                to_email: 'kosianzopi@gmail.com',
                from_name: orderData.name,
                from_email: orderData.email || 'non-renseigné',
                client_phone: orderData.phone,
                delivery_address: orderData.address,
                special_instructions: orderData.message || 'Aucune instruction spéciale',
                order_items: formatItemsForEmail(orderData.items),
                total_amount: orderData.total,
                order_date: orderData.date,
                client_email: orderData.email || 'Non renseigné'
            };
            
            try {
                const response = await emailjs.send(
                    'service_jhn0kqf',
                    'template_b1gzu3p', 
                    templateParams
                );
                
                console.log('Email envoyé avec succès:', response);
                return response;
                
            } catch (error) {
                console.error('Erreur envoi email:', error);
                throw error;
            }
        }

        // Formatage des articles pour l'email
        function formatItemsForEmail(items) {
            if (items.length === 0) return 'Aucun article';
            
            return items.map(item => 
                `• ${item.name}: ${item.quantity}kg × ${item.price} USD = ${item.total} USD`
            ).join('\n');
        }

        // Version sécurisée - WhatsApp rapide avec fermeture automatique
        async function sendWhatsAppNotification(orderData) {
            const phone = "243821363626"; // Numéro WhatsApp du destinataire
            
            const message = `🛒 NOUVELLE COMMANDE - MINOTERIE NZOPI

        👤 Client: ${orderData.name}
        📞 Téléphone: ${orderData.phone}
        📍 Adresse: ${orderData.address}

        📦 COMMANDE:
        ${formatItemsForWhatsApp(orderData.items)}

        💰 Total: ${orderData.total} USD
        📋 Instructions: ${orderData.message || 'Aucune'}

        ⏰ ${orderData.date}

        _Message automatique - Ne pas modifier_`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
            
            // Ouvrir et fermer rapidement
            const whatsappWindow = window.open(whatsappUrl, '_blank');
            
            // Fermer après 3 secondes (WhatsApp est déjà ouvert)
            setTimeout(() => {
                if (whatsappWindow && !whatsappWindow.closed) {
                    whatsappWindow.close();
                }
            }, 3000);
            
            return Promise.resolve();
        }

        // Formatage pour WhatsApp
        function formatItemsForWhatsApp(items) {
            if (items.length === 0) return 'Aucun article';
            
            return items.map(item => 
                `• ${item.name}: ${item.quantity}kg × ${item.price} USD = ${item.total} USD`
            ).join('\n');
        }

        // Affichage du chargement
        function showLoading(show) {
            const submitBtn = document.querySelector('#orderForm button[type="submit"]');
            
            if (show) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                submitBtn.disabled = true;
            } else {
                submitBtn.innerHTML = 'Passer la commande';
                submitBtn.disabled = false;
            }
        }

        // Message de succès
        function showSuccessMessage() {
            alert(`✅ Commande envoyée avec succès !

            Nous avons reçu votre commande par email et WhatsApp.
            Nous vous contacterons dans les plus brefs délais pour confirmer la livraison.

            📞 Vous pouvez aussi nous appeler au +243 821 363 626 pour toute urgence.

            Merci pour votre confiance !`);
        }

        // Réinitialisation du formulaire
        function resetOrderForm() {
            document.getElementById('orderForm').reset();
            
            const quantityInputs = document.querySelectorAll('.quantity-control input');
            quantityInputs.forEach(input => input.value = '0');
            updateOrderTotal();
        }

        // Application du nouveau système de commande
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', submitOrder);
        }
        
        // Scroll reveal animation
        window.addEventListener('scroll', revealOnScroll);
        
        function revealOnScroll() {
            const sections = document.querySelectorAll('.section, .mission-card, .product-card, .process-step, .gallery-item');
            
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (sectionTop < windowHeight - 100) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
            });
        }
        
        // Initialize elements with opacity 0 for animation
        document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('.section, .mission-card, .product-card, .process-step, .gallery-item');
            
            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            
            // Trigger initial reveal
            setTimeout(revealOnScroll, 100);
        });
